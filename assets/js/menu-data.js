/* ============================================================================
   MERY COFFEE CLUB — MENU DATA
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE MENU.

   To add a price:   change   price: null      to   price: 120000
   (Numbers only — no commas, no "تومان". The site formats it for you.)

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
  multiplier: 1,
};

const MERY_MENU = [
  {
    id: "warm-coffee",
    name: { en: "Warm Coffee", fa: "قهوه گرم" },
    items: [
      { en: "Espresso Classic",   fa: "اسپرسو کلاسیک",  price: null, img: "espresso-classic" },
      { en: "Espresso Premium",   fa: "اسپرسو پریمیوم", price: null },
      { en: "Americano",          fa: "آمریکانو",       price: null },
      { en: "Cappuccino",         fa: "کاپوچینو",       price: null, img: "cappuccino" },
      { en: "Latte",              fa: "لاته",           price: null, img: "latte" },
      { en: "Cortado",            fa: "کورتادو",        price: null },
      { en: "Espresso Chocolate", fa: "اسپرسو شکلات",   price: null },
      { en: "Mocha",              fa: "موکا",           price: null },
      { en: "Dalgona",            fa: "دالگونا",        price: null },
    ],
  },
  {
    id: "iced-coffee",
    name: { en: "Iced Coffee", fa: "قهوه سرد" },
    items: [
      { en: "Iced Americano",         fa: "آیس آمریکانو",       price: null },
      { en: "Iced Latte",             fa: "آیس لاته",           price: null, img: "iced-latte" },
      { en: "Iced Mocha",             fa: "آیس موکا",           price: null },
      { en: "Iced Caramel Macchiato", fa: "آیس کارامل ماکیاتو", price: null, img: "iced-caramel-macchiato" },
      { en: "Affogato",               fa: "آفوگاتو",            price: null },
      { en: "Iced Dalgona",           fa: "آیس دالگونا",        price: null },
      { en: "Iced Romano",            fa: "آیس رومانو",         price: null },
    ],
  },
  {
    id: "smoothies",
    name: { en: "Smoothies", fa: "اسموتی" },
    items: [
      { en: "Strawberry Smoothie",  fa: "اسموتی توت‌فرنگی", price: null, img: "smoothie-strawberry" },
      { en: "Mango Smoothie",       fa: "اسموتی انبه",      price: null },
      { en: "Mixed Berry Smoothie", fa: "اسموتی بری میکس",  price: null },
      { en: "Tropical Smoothie",    fa: "اسموتی استوایی",   price: null },
    ],
  },
  {
    id: "mocktails",
    name: { en: "Mocktails", fa: "ماکتیل" },
    items: [
      { en: "Classic Mojito",      fa: "موهیتو کلاسیک",    price: null, img: "mocktail-mojito-classic" },
      { en: "Mojito Passion Fruit",fa: "موهیتو پشن فروت",  price: null },
      { en: "Blue Lagoon",         fa: "بلو لاگون",        price: null, img: "mocktail-blue-lagoon" },
      { en: "Strawberry Spark",    fa: "استرابری اسپارک",  price: null },
      { en: "Mery Berry",          fa: "مری بری",          price: null, signature: true, img: "mocktail-mery-berry" },
      { en: "Mery Yoohoo",         fa: "مری یوهویی",       price: null },
      { en: "Custom Drink",        fa: "نوشیدنی دلخواه",   price: null },
    ],
  },
  {
    id: "matcha-bar",
    name: { en: "Matcha Bar", fa: "ماچا بار" },
    items: [
      { en: "Matcha Latte",            fa: "ماچا لاته",           price: null },
      { en: "Strawberry Matcha Latte", fa: "ماچا توت‌فرنگی لاته", price: null, img: "matcha-strawberry" },
      { en: "Matcha Affogato",         fa: "ماچا آفوگاتو",        price: null },
      { en: "Matcha Mango",            fa: "ماچا انبه",           price: null },
    ],
  },
  {
    id: "milkshakes",
    name: { en: "Milkshakes", fa: "شیک" },
    items: [
      { en: "Strawberry",    fa: "توت‌فرنگی",   price: null },
      { en: "Chocolate",     fa: "شکلات",       price: null, img: "shake-chocolate" },
      { en: "Vanilla",       fa: "وانیل",       price: null },
      { en: "Caramel",       fa: "کارامل",      price: null },
      { en: "Hazelnut",      fa: "فندق",        price: null },
      { en: "Nutella",       fa: "نوتلا",       price: null },
      { en: "Oreo",          fa: "اورئو",       price: null, img: "shake-oreo" },
      { en: "Peanut Butter", fa: "بادام زمینی", price: null },
      { en: "Lotus Biscoff", fa: "لوتوس",       price: null, img: "shake-lotus" },
      { en: "Banana",        fa: "موز",         price: null },
      { en: "Mango",         fa: "انبه",        price: null },
      { en: "Espresso",      fa: "اسپرسو",      price: null },
    ],
  },
  {
    id: "hot-drinks",
    name: { en: "Hot Drinks", fa: "نوشیدنی گرم" },
    items: [
      { en: "Black Tea",       fa: "چای سیاه",   price: null },
      { en: "Karak Tea",       fa: "چای کرک",    price: null, img: "tea-karak" },
      { en: "Green Tea",       fa: "چای سبز",    price: null },
      { en: "Chamomile",       fa: "بابونه",     price: null },
      { en: "Borage",          fa: "گل گاوزبان", price: null },
      { en: "Peppermint",      fa: "نعناع",      price: null },
      { en: "Saffron Tea",     fa: "چای زعفران", price: null },
      { en: "Masala Tea",      fa: "چای ماسالا", price: null },
      { en: "Hot Chocolate",   fa: "هات چاکلت",  price: null, img: "hot-chocolate" },
      { en: "White Chocolate", fa: "وایت چاکلت", price: null },
      { en: "Hot Lotus",       fa: "هات لوتوس",  price: null },
      { en: "Matcha Latte",    fa: "ماچا لاته",  price: null },
    ],
  },
  {
    id: "iced-tea",
    name: { en: "Iced Tea", fa: "آیس تی" },
    items: [
      { en: "Iced Tea",            fa: "آیس تی",           price: null },
      { en: "Iced Lemon Tea",      fa: "آیس لمون تی",      price: null },
      { en: "Mery Strawberry Tea", fa: "مری استرابری تی",  price: null, signature: true },
    ],
  },
  {
    id: "dessert",
    name: { en: "Dessert", fa: "دسر" },
    items: [
      { en: "Cheesecake", fa: "چیز کیک",  price: null, img: "dessert-cheesecake" },
      { en: "Jar Cake",   fa: "جار کیک",  price: null },
      { en: "Tiramisu",   fa: "تیرامیسو", price: null, img: "dessert-tiramisu" },
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
