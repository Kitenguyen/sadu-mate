/* ==========================================================================
   SADU Mate — dữ liệu sản phẩm, bảng giá, đánh giá, FAQ
   (Bản thuần JavaScript, không phụ thuộc framework)
   ========================================================================== */

window.SADU_DATA = (function () {
  var PRODUCTS = [
    {
      id: "nightshade-lotus",
      name: "SADU Mate Xạ Đen & Lá Sen",
      vietnameseName: "Trà Xạ Đen Lá Sen",
      tagline: "Thanh mát, dịu nhẹ mỗi sáng",
      description:
        "Xạ đen kết hợp lá sen và hoa sen khô, cho vị trà thanh, hậu ngọt nhẹ, hương sen thoang thoảng dễ chịu.",
      image: "assets/product-nightshade-lotus.webp",
      accent: "rose",
      notes: ["Xạ đen nguyên lá", "Lá sen Đồng Tháp", "Hoa sen khô nguyên cánh"],
    },
    {
      id: "nightshade",
      name: "SADU Mate Xạ Đen",
      vietnameseName: "Trà Xạ Đen",
      tagline: "Đậm đà, nguyên bản",
      description:
        "Xạ đen nguyên chất, sao thủ công theo phương pháp truyền thống, giữ trọn hương vị mộc mạc và màu nước cánh gián đẹp mắt.",
      image: "assets/product-nightshade.webp",
      accent: "teal",
      notes: ["100% xạ đen tự nhiên", "Sao thủ công", "Không chất bảo quản"],
    },
    {
      id: "chrysanthemum",
      name: "SADU Mate Xạ Đen & Hoa Cúc",
      vietnameseName: "Trà Xạ Đen Hoa Cúc",
      tagline: "Nhẹ nhàng, thư thái cuối ngày",
      description:
        "Hoa cúc chi vàng ươm hoà cùng xạ đen, mang lại tách trà dịu êm, hương thơm ấm áp, thích hợp buổi tối.",
      image: "assets/product-chrysanthemum.webp",
      accent: "amber",
      notes: ["Cúc chi Hưng Yên", "Xạ đen nguyên lá", "Vị dịu, dễ uống"],
    },
  ];

  var UNIT_PRICE = 149000; // VND / hộp
  var FREE_SHIP_THRESHOLD_BOXES = 2;
  var CURRENCY = "₫";

  var PRICING_TIERS = [
    { id: "single", buy: 1, free: 0, label: "Mua lẻ", badge: "" },
    { id: "combo3", buy: 3, free: 1, label: "Mua 3 tặng 1", badge: "Phổ biến nhất" },
    { id: "combo5", buy: 5, free: 2, label: "Mua 5 tặng 2", badge: "Tiết kiệm nhất" },
  ];

  function formatVND(value) {
    return Number(value).toLocaleString("vi-VN") + CURRENCY;
  }

  function bestTierForQuantity(totalBoxes) {
    if (totalBoxes >= 5) return PRICING_TIERS[2];
    if (totalBoxes >= 3) return PRICING_TIERS[1];
    return PRICING_TIERS[0];
  }

  function calculatePricing(requestedBoxes) {
    var boxes = Math.max(0, Math.floor(requestedBoxes));
    var tier = bestTierForQuantity(boxes);
    var combosApplied = tier.buy > 1 ? Math.floor(boxes / tier.buy) : 0;
    var boxesPaidFromCombos = combosApplied * tier.buy;
    var boxesFree = combosApplied * tier.free;
    var looseBoxes = boxes - boxesPaidFromCombos;
    var boxesPaid = boxesPaidFromCombos + looseBoxes;
    var boxesTotal = boxesPaid + boxesFree;
    var subtotal = boxesPaid * UNIT_PRICE;
    var fullPriceEquivalent = boxesTotal * UNIT_PRICE;
    var savings = fullPriceEquivalent - subtotal;
    var freeShipping = boxes >= FREE_SHIP_THRESHOLD_BOXES;
    var perBoxEffective = boxesTotal > 0 ? Math.round(subtotal / boxesTotal) : 0;

    return {
      tier: tier,
      boxesPaid: boxesPaid,
      boxesFree: boxesFree,
      boxesTotal: boxesTotal,
      subtotal: subtotal,
      savings: savings,
      freeShipping: freeShipping,
      perBoxEffective: perBoxEffective,
    };
  }

  var TESTIMONIALS = [
    {
      name: "Minh Thư",
      role: "Nhân viên văn phòng, Q.3, TP.HCM",
      quote:
        "Mình pha một bình mang đi làm mỗi sáng. Vị thanh, không bị chát gắt như vài loại trà thảo mộc mình từng thử.",
      rating: 5,
    },
    {
      name: "Anh Tuấn",
      role: "Kỹ sư phần mềm, Cầu Giấy, Hà Nội",
      quote:
        "Thay trà đá vỉa hè bằng SADU được hơn hai tháng. Đóng gói gọn, pha nhanh, hợp với giờ giấc bận rộn.",
      rating: 5,
    },
    {
      name: "Chị Hạnh",
      role: "Nội trợ, Thủ Đức, TP.HCM",
      quote:
        "Cả nhà mình đều uống được, vị nhẹ nhàng dễ chịu. Mua combo 5 tặng 2 dùng được gần hai tháng, khá tiết kiệm.",
      rating: 5,
    },
    {
      name: "Bảo Trân",
      role: "Giáo viên, Ninh Kiều, Cần Thơ",
      quote: "Mùi hoa cúc thơm nhẹ, không nồng. Mình hay uống buổi tối thay vì cà phê để dễ ngủ hơn.",
      rating: 4,
    },
    {
      name: "Quốc Huy",
      role: "Quản lý bán hàng, Hải Châu, Đà Nẵng",
      quote: "Đặt hàng qua form rất nhanh, giao đúng hẹn. Trà đóng gói cẩn thận, túi lọc không bị vụn.",
      rating: 5,
    },
    {
      name: "Diễm My",
      role: "Freelancer, Bình Thạnh, TP.HCM",
      quote: "Mình để hẳn một hộp trên bàn làm việc. Hương xạ đen nguyên bản, không pha tạp mùi hương liệu.",
      rating: 5,
    },
  ];

  TESTIMONIALS.forEach(function (item, index) {
    var avatars = [
      { avatar: "image/nu-feedback (1).jpg", badge: "Uống mỗi sáng" },
      { avatar: "image/nam-feedback (1).jfif", badge: "Đặt lượng 2" },
      { avatar: "image/nu-feedback (7).jpg", badge: "Mua combo 5+2" },
      { avatar: "image/nu-feedback (8).jpg", badge: "Hương hoa cúc" },
      { avatar: "image/nam-feedback (3).jpg", badge: "Giao nhanh" },
      { avatar: "image/nu-feedback (11).jpg", badge: "Vị nguyên bản" },
    ];

    item.avatar = avatars[index] ? avatars[index].avatar : avatars[0].avatar;
    item.badge = avatars[index] ? avatars[index].badge : "";
  });

  var ORDER_FEED = [
    {
      city: "Hà Nội",
      timeAgo: "2 phút trước",
      customer: "Chị Lan, Thanh Xuân",
      avatar: "image/nu-feedback (4).jpg",
      combo: "Combo 3 tặng 1",
      note: "Đặt sẵn cho cả nhà uống buổi sáng, ưu tiên vị lá sen dễ uống.",
    },
    {
      city: "TP.HCM",
      timeAgo: "7 phút trước",
      customer: "Anh Hưng, Phú Nhuận",
      avatar: "image/nam-feedback (4).jpg",
      combo: "2 hộp xạ đen nguyên bản",
      note: "Khách mua lần 2, nhắn giao giờ hành chính vì mang đi làm.",
    },
    {
      city: "Đà Nẵng",
      timeAgo: "12 phút trước",
      customer: "Chị Thảo, Hải Châu",
      avatar: "image/nu-feedback (6).jpg",
      combo: "Combo 5 tặng 2",
      note: "Đặt chung cho nhóm văn phòng, muốn giao trước cuối tuần.",
    },
    {
      city: "Cần Thơ",
      timeAgo: "19 phút trước",
      customer: "Cô Mai, Ninh Kiều",
      avatar: "image/nu-feedback (9).jpg",
      combo: "3 hộp hoa cúc",
      note: "Ưu tiên vị nhẹ cho người lớn tuổi, yêu cầu kiểm tra hàng trước khi nhận.",
    },
    {
      city: "Hải Phòng",
      timeAgo: "26 phút trước",
      customer: "Anh Đức Thành, Lê Chân",
      avatar: "image/nam-feedback (2).jpg",
      combo: "Combo 5 hộp + tặng 2 quà tặng",
      note: "Chốt đơn cho gia đình và đồng nghiệp, ưu tiên giao sớm trong ngày.",
    },
    {
      city: "Bình Dương",
      timeAgo: "34 phút trước",
      customer: "Chị Diễm My, Dĩ An",
      avatar: "image/nu-feedback (12).jpg",
      combo: "2 hộp lá sen + 1 hộp hoa cúc",
      note: "Khách thích vị thanh nhẹ, đặt để uống thay nước ngọt buổi chiều.",
    },
  ];

  var REVIEW_COUNT = 2483;
  var AVERAGE_RATING = 4.8;

  var FAQ_ITEMS = [
    {
      question: "SADU Mate phù hợp uống vào thời điểm nào trong ngày?",
      answer:
        "Bạn có thể pha một bình vào buổi sáng để mang đi làm, hoặc pha buổi tối để thư giãn trước khi ngủ. Trà không chứa caffeine nên phù hợp uống bất cứ lúc nào trong ngày.",
    },
    {
      question: "Một hộp trà pha được bao nhiêu ấm?",
      answer:
        "Mỗi hộp 150g pha được khoảng 25 đến 30 ấm tuỳ khẩu vị đậm nhạt, tương đương dùng trong 2 đến 3 tuần nếu uống mỗi ngày.",
    },
    {
      question: "Nguyên liệu có nguồn gốc từ đâu?",
      answer:
        "Xạ đen, lá sen, hoa sen và hoa cúc chi đều được thu hái từ các vùng trồng thảo mộc tại Việt Nam, sơ chế và sao khô thủ công theo quy trình kiểm soát chất lượng của SADU.",
    },
    {
      question: "Trà có vị đắng hay khó uống không?",
      answer:
        "SADU Mate được phối trộn để có vị thanh, hậu ngọt dịu, dễ uống hằng ngày, không gắt hay khó chịu như trà thảo mộc pha đặc thông thường.",
    },
    {
      question: "Đây có phải là thuốc hoặc thực phẩm chức năng điều trị bệnh không?",
      answer:
        "Không. SADU Mate là trà thảo mộc dùng hằng ngày, hỗ trợ một lối sống lành mạnh và trải nghiệm thưởng trà dễ chịu. Sản phẩm không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.",
    },
    {
      question: "Chính sách đổi trả và bảo đảm như thế nào?",
      answer:
        "Nếu bạn không hài lòng về hương vị trong lần đầu sử dụng, SADU hỗ trợ đổi sản phẩm khác hoặc hoàn tiền trong vòng 14 ngày kể từ ngày nhận hàng, chỉ cần hộp còn từ 80% khối lượng trở lên.",
    },
    {
      question: "Đặt hàng và giao hàng mất bao lâu?",
      answer:
        "Đơn hàng nội thành thường giao trong 1 đến 2 ngày, các tỉnh thành khác từ 2 đến 4 ngày làm việc. Bạn có thể thanh toán khi nhận hàng (COD) trên toàn quốc.",
    },
  ];

  return {
    PRODUCTS: PRODUCTS,
    UNIT_PRICE: UNIT_PRICE,
    FREE_SHIP_THRESHOLD_BOXES: FREE_SHIP_THRESHOLD_BOXES,
    PRICING_TIERS: PRICING_TIERS,
    formatVND: formatVND,
    calculatePricing: calculatePricing,
    TESTIMONIALS: TESTIMONIALS,
    ORDER_FEED: ORDER_FEED,
    REVIEW_COUNT: REVIEW_COUNT,
    AVERAGE_RATING: AVERAGE_RATING,
    FAQ_ITEMS: FAQ_ITEMS,
  };
})();
