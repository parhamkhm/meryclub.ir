/* ============================================================================
   MERY COFFEE CLUB — MENU DATA
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE MENU.

   To add a price:   change   price: null      to   price: 120
   (In thousands of Toman, as on the printed menu — 120 shows as ۱۲۰٬۰۰۰
   تومان. Numbers only, no commas, no "تومان". The site formats it for you.)
   Two sizes (e.g. single / double):   price: [150, 170]
   Price depends on the order:          price: "variable"

   To hide an item temporarily:   add   hidden: true
   To mark an item as a favourite: add   signature: true
   To highlight with the amber "پیشنهاد مری" pill: add   promo: true
   To add a short description:     add   note: { fa: "...", en: "..." }

   After editing, just save the file and refresh the page.
   ========================================================================== */

const MERY_CURRENCY = {
  fa: "تومان",
  en: "Toman",
  // Prices are written in the data below WITHOUT the trailing zeros you may
  // be used to. Set this to 1 if you enter full rials, or 1000 if you enter
  // prices in thousands. Default assumes you type the full Toman amount.
  multiplier: 1000,
};

const MERY_MENU = [
  {
    id: "warm-coffee",
    name: { en: "Warm Coffee", fa: "قهوه گرم" },
    items: [
      { en: "Espresso Classic",   fa: "اسپرسو کلاسیک",  price: [150, 170], img: "espresso-classic" },
      { en: "Espresso Premium",   fa: "اسپرسو پریمیوم", price: [175, 210] },
      { en: "Americano",          fa: "آمریکانو",       price: 180 },
      { en: "Cappuccino",         fa: "کاپوچینو",       price: 210, img: "cappuccino" },
      { en: "Latte",              fa: "لاته",           price: 220, img: "latte" },
      { en: "Cortado",            fa: "کورتادو",        price: 200 },
      { en: "Espresso Chocolate", fa: "اسپرسو شکلات",   price: 200 },
      { en: "Mocha",              fa: "موکا",           price: 250 },
      { en: "Dalgona",            fa: "دالگونا",        price: 200 },
    ],
  },
  {
    id: "iced-coffee",
    name: { en: "Iced Coffee", fa: "قهوه سرد" },
    items: [
      { en: "Iced Americano",         fa: "آیس آمریکانو",       price: 190 },
      { en: "Iced Latte",             fa: "آیس لاته",           price: 230, img: "iced-latte" },
      { en: "Iced Mocha",             fa: "آیس موکا",           price: 260 },
      { en: "Iced Caramel Macchiato", fa: "آیس کارامل ماکیاتو", price: 260, img: "iced-caramel-macchiato" },
      { en: "Affogato",               fa: "آفوگاتو",            price: 210 },
      { en: "Iced Dalgona",           fa: "آیس دالگونا",        price: 230 },
      { en: "Iced Romano",            fa: "آیس رومانو",         price: 195 },
    ],
  },
  {
    id: "smoothies",
    name: { en: "Smoothies", fa: "اسموتی" },
    items: [
      { en: "Strawberry Smoothie",  fa: "اسموتی توت‌فرنگی", price: 280, img: "smoothie-strawberry" },
      { en: "Mango Smoothie",       fa: "اسموتی انبه",      price: 270 },
      { en: "Mixed Berry Smoothie", fa: "اسموتی بری میکس",  price: null },
      { en: "Tropical Smoothie",    fa: "اسموتی استوایی",   price: null },
    ],
  },
  {
    id: "mocktails",
    name: { en: "Mocktails", fa: "ماکتیل" },
    items: [
      { en: "Classic Mojito",      fa: "موهیتو کلاسیک",    price: 235, img: "mocktail-mojito-classic" },
      { en: "Mojito Passion Fruit",fa: "موهیتو پشن فروت",  price: 265 },
      { en: "Blue Lagoon",         fa: "بلو لاگون",        price: 210, img: "mocktail-blue-lagoon" },
      { en: "Strawberry Spark",    fa: "استرابری اسپارک",  price: 270 },
      { en: "Mery Berry",          fa: "مری بری",          price: null, signature: true, img: "mocktail-mery-berry" },
      { en: "Mery Yoohoo",         fa: "مری یوهویی",       price: "variable" },
      { en: "Custom Drink",        fa: "نوشیدنی دلخواه",   price: "variable" },
    ],
  },
  {
    id: "matcha-bar",
    name: { en: "Matcha Bar", fa: "ماچا بار" },
    items: [
      { en: "Matcha Latte",            fa: "ماچا لاته",           price: 250 },
      { en: "Strawberry Matcha Latte", fa: "ماچا توت‌فرنگی لاته", price: 330, img: "matcha-strawberry" },
      { en: "Matcha Affogato",         fa: "ماچا آفوگاتو",        price: null },
      { en: "Matcha Mango",            fa: "ماچا انبه",           price: 360 },
    ],
  },
  {
    id: "milkshakes",
    name: { en: "Milkshakes", fa: "شیک" },
    items: [
      { en: "Strawberry",    fa: "توت‌فرنگی",   price: 330 },
      { en: "Chocolate",     fa: "شکلات",       price: 330, img: "shake-chocolate" },
      { en: "Vanilla",       fa: "وانیل",       price: 290 },
      { en: "Caramel",       fa: "کارامل",      price: 290 },
      { en: "Hazelnut",      fa: "فندق",        price: 290 },
      { en: "Nutella",       fa: "نوتلا",       price: 360 },
      { en: "Oreo",          fa: "اورئو",       price: 360, img: "shake-oreo" },
      { en: "Peanut Butter", fa: "بادام زمینی", price: 320 },
      { en: "Lotus Biscoff", fa: "لوتوس",       price: 360, img: "shake-lotus" },
      { en: "Banana",        fa: "موز",         price: 360 },
      { en: "Mango",         fa: "انبه",        price: 330 },
      { en: "Espresso",      fa: "اسپرسو",      price: 300 },
    ],
  },
  {
    id: "hot-drinks",
    name: { en: "Hot Drinks", fa: "نوشیدنی گرم" },
    items: [
      { en: "Black Tea",       fa: "چای سیاه",   price: [75, 100] },
      { en: "Karak Tea",       fa: "چای کرک",    price: 220, img: "tea-karak" },
      { en: "Green Tea",       fa: "چای سبز",    price: 180 },
      { en: "Chamomile",       fa: "بابونه",     price: 180 },
      { en: "Borage",          fa: "گل گاوزبان", price: 180 },
      { en: "Peppermint",      fa: "نعناع",      price: 180 },
      { en: "Saffron Tea",     fa: "چای زعفران", price: 180 },
      { en: "Masala Tea",      fa: "چای ماسالا", price: 220 },
      { en: "Hot Chocolate",   fa: "هات چاکلت",  price: 220, img: "hot-chocolate" },
      { en: "White Chocolate", fa: "وایت چاکلت", price: 220 },
      { en: "Hot Lotus",       fa: "هات لوتوس",  price: 260 },
      { en: "Matcha Latte",    fa: "ماچا لاته",  price: 250 },
    ],
  },
  {
    id: "iced-tea",
    name: { en: "Iced Tea", fa: "آیس تی" },
    items: [
      { en: "Iced Tea",            fa: "آیس تی",           price: 140 },
      { en: "Iced Lemon Tea",      fa: "آیس لمون تی",      price: 170 },
      { en: "Mery Strawberry Tea", fa: "مری استرابری تی",  price: 195, signature: true },
    ],
  },
  {
    id: "dessert",
    name: { en: "Dessert", fa: "دسر" },
    items: [
      { en: "Cheesecake", fa: "چیز کیک",  price: 290, img: "dessert-cheesecake" },
      { en: "Jar Cake",   fa: "جار کیک",  price: 240 },
      { en: "Tiramisu",   fa: "تیرامیسو", price: 270, img: "dessert-tiramisu" },
    ],
  },
  {
    id: "breakfast",
    name: { en: "Breakfast / Brunch", fa: "صبحانه و برانچ" },
    items: [
      { en: "Toast",     fa: "تست",     price: null },
      { en: "Croissant", fa: "کروسان",  price: null, img: "breakfast-croissant" },
      { en: "Oatmeal",   fa: "اوتمیل",  price: null },
    ],
  },
  {
    id: "gile-bar",
    name: { en: "Gile Bar", fa: "گیله‌بار" },
    items: [
      { en: "Dollar Limoo",   fa: "دلار لیمو",    price: null },
      { en: "Naranj Nana",    fa: "نارنج نعنا",   price: null },
      { en: "Abghoore Dollar",fa: "آبعوره دلار",  price: null },
      { en: "Gile Mix",       fa: "گیله میکس",    price: null, promo: true },
    ],
  },
];
