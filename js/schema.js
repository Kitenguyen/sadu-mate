/* ==========================================================================
   SADU Mate - Structured data generator
   Builds JSON-LD dynamically after DOM is ready to avoid hard-coding schema
   in index.html while keeping the current UI and JavaScript logic intact.
   ========================================================================== */
(function () {
  "use strict";

  var SCHEMA_SCRIPT_ID = "sadu-product-schema";
  var DEFAULT_SITE_URL = "https://mate.sadu.com.vn";
  var DEFAULT_LOGO_PATH = "assets/logo-badge.webp";
  var DEFAULT_HERO_IMAGE_PATH = "assets/hero-background.webp";
  var DEFAULT_CONTACT_EMAIL = "nongnghiepcncthanglong@gmail.com";
  var DEFAULT_PHONE = "19008952";
  var DEFAULT_ORG_NAME = "SADU Mate";
  var DEFAULT_SELLER_NAME = "SADU";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function getCanonicalUrl() {
    var canonicalEl = document.querySelector('link[rel="canonical"]');
    var canonicalUrl = canonicalEl && canonicalEl.href ? canonicalEl.href : window.location.href.split("#")[0];
    return canonicalUrl.replace(/\/+$/, "");
  }

  function toAbsoluteUrl(path, baseUrl) {
    if (!path) return "";

    try {
      return new URL(path, baseUrl + "/").href;
    } catch (error) {
      return "";
    }
  }

  function getProductSource() {
    var config = window.SADU_CONFIG || {};
    var data = window.SADU_DATA || {};

    return {
      brandName: config.brandName || DEFAULT_ORG_NAME,
      sellerName: config.sellerName || DEFAULT_SELLER_NAME,
      price: typeof config.unitPrice === "number" ? config.unitPrice : data.UNIT_PRICE,
      products: Array.isArray(config.products) && config.products.length ? config.products : data.PRODUCTS || []
    };
  }

  function getSiteMeta(baseUrl) {
    var titleEl = document.querySelector("title");
    var metaDescription = document.querySelector('meta[name="description"]');
    var heroImage = document.querySelector(".hero img");
    var faqItems = (window.SADU_DATA && Array.isArray(window.SADU_DATA.FAQ_ITEMS)) ? window.SADU_DATA.FAQ_ITEMS : [];

    return {
      siteUrl: baseUrl || DEFAULT_SITE_URL,
      pageTitle: titleEl ? titleEl.textContent.trim() : DEFAULT_ORG_NAME,
      pageDescription: metaDescription ? metaDescription.getAttribute("content") : "",
      organizationName: DEFAULT_ORG_NAME,
      sellerName: DEFAULT_SELLER_NAME,
      email: DEFAULT_CONTACT_EMAIL,
      phone: DEFAULT_PHONE,
      logoUrl: toAbsoluteUrl(DEFAULT_LOGO_PATH, baseUrl || DEFAULT_SITE_URL),
      heroImageUrl: toAbsoluteUrl(DEFAULT_HERO_IMAGE_PATH, baseUrl || DEFAULT_SITE_URL),
      heroImageAlt: heroImage ? (heroImage.getAttribute("alt") || "") : "",
      faqItems: faqItems
    };
  }

  function normalizeProductName(product, brandName) {
    var preferredName = product.vietnameseName || product.name || "";
    if (!preferredName) return "";
    return preferredName.indexOf(brandName) === -1 ? preferredName + " " + brandName : preferredName;
  }

  function createProductNode(product, source, baseUrl) {
    var productUrl = baseUrl + "#products";
    var imageUrl = toAbsoluteUrl(product.image, baseUrl);
    var name = normalizeProductName(product, source.brandName);

    if (!name || !product.description || !imageUrl || typeof source.price !== "number") {
      return null;
    }

    return {
      "@type": "Product",
      name: name,
      description: product.description,
      image: [imageUrl],
      sku: product.id,
      brand: {
        "@type": "Brand",
        name: source.brandName
      },
      url: productUrl,
      offers: {
        "@type": "Offer",
        price: String(source.price),
        priceCurrency: "VND",
        availability: "https://schema.org/InStock",
        url: baseUrl + "#order",
        seller: {
          "@type": "Organization",
          name: source.sellerName
        }
      }
    };
  }

  function createOrganizationNode(meta) {
    return {
      "@type": "Organization",
      "@id": meta.siteUrl + "/#organization",
      name: meta.organizationName,
      url: meta.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: meta.logoUrl
      },
      email: meta.email,
      telephone: meta.phone,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: meta.phone,
        contactType: "customer service",
        availableLanguage: ["vi"]
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Dai Yen",
        addressLocality: "Chuong My",
        addressRegion: "Ha Noi",
        addressCountry: "VN"
      }
    };
  }

  function createWebsiteNode(meta) {
    return {
      "@type": "WebSite",
      "@id": meta.siteUrl + "/#website",
      url: meta.siteUrl,
      name: meta.organizationName,
      publisher: {
        "@id": meta.siteUrl + "/#organization"
      }
    };
  }

  function createHeroImageNode(meta) {
    return {
      "@type": "ImageObject",
      "@id": meta.siteUrl + "/#hero-image",
      url: meta.heroImageUrl,
      contentUrl: meta.heroImageUrl,
      caption: meta.heroImageAlt || meta.organizationName
    };
  }

  function createBreadcrumbNode(meta) {
    return {
      "@type": "BreadcrumbList",
      "@id": meta.siteUrl + "#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chu",
          item: meta.siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: meta.organizationName,
          item: meta.siteUrl
        }
      ]
    };
  }

  function createWebPageNode(meta) {
    return {
      "@type": ["CollectionPage", "WebPage"],
      "@id": meta.siteUrl + "#webpage",
      url: meta.siteUrl,
      name: meta.pageTitle,
      description: meta.pageDescription,
      inLanguage: "vi-VN",
      primaryImageOfPage: {
        "@id": meta.siteUrl + "/#hero-image"
      },
      isPartOf: {
        "@id": meta.siteUrl + "/#website"
      },
      about: {
        "@id": meta.siteUrl + "/#organization"
      },
      breadcrumb: {
        "@id": meta.siteUrl + "#breadcrumb"
      }
    };
  }

  function createReturnPolicyNode(meta) {
    return {
      "@type": "MerchantReturnPolicy",
      "@id": meta.siteUrl + "#return-policy",
      applicableCountry: "VN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      description: "Khong hai long lan dau co the doi san pham khac hoac hoan tien trong 14 ngay ke tu ngay nhan hang."
    };
  }

  function createShippingNode(meta) {
    return {
      "@type": "OfferShippingDetails",
      "@id": meta.siteUrl + "#shipping",
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "VN"
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 1,
          unitCode: "DAY"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 4,
          unitCode: "DAY"
        }
      }
    };
  }

  function createFaqNode(meta) {
    if (!meta.faqItems.length) return null;

    return {
      "@type": "FAQPage",
      "@id": meta.siteUrl + "#faq",
      mainEntity: meta.faqItems
        .filter(function (item) {
          return item && item.question && item.answer;
        })
        .map(function (item) {
          return {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          };
        })
    };
  }

  function buildSchemaPayload() {
    var baseUrl = getCanonicalUrl();
    var source = getProductSource();
    var meta = getSiteMeta(baseUrl);
    var products = source.products
      .map(function (product) {
        return createProductNode(product, source, baseUrl);
      })
      .filter(Boolean);
    var graph = [
      createOrganizationNode(meta),
      createWebsiteNode(meta),
      createHeroImageNode(meta),
      createBreadcrumbNode(meta),
      createWebPageNode(meta),
      createReturnPolicyNode(meta),
      createShippingNode(meta),
      createFaqNode(meta)
    ].filter(Boolean).concat(products);

    if (!graph.length) return null;

    return {
      "@context": "https://schema.org",
      "@graph": graph
    };
  }

  function injectSchema() {
    if (document.getElementById(SCHEMA_SCRIPT_ID)) return;

    var payload = buildSchemaPayload();
    if (!payload) return;

    var script = document.createElement("script");
    script.id = SCHEMA_SCRIPT_ID;
    script.type = "application/ld+json";
    script.text = JSON.stringify(payload);

    document.head.appendChild(script);
  }

  onReady(injectSchema);
})();
