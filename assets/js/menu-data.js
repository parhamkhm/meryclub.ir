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
      { en: "Espresso Classic",   fa: "اسپرسو کلاسیک",  price: [150, 170] },
      { en: "Espresso Premium",   fa: "اسپرسو پریمیوم", price: [175, 210] },
      { en: "Americano",          fa: "آمریکانو",       price: 180 },
      { en: "Cappuccino",         fa: "کاپوچینو",       price: 210 },
      { en: "Latte",              fa: "لاته",           price: 220 },
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
      { en: "Iced Americano",         fa: "آیس آمریکانو",       price: 190, img: "iced-americano-1ee43b" },
      { en: "Iced Latte",             fa: "آیس لاته",           price: 230, img: "iced-latte-ef151f" },
      { en: "Iced Mocha",             fa: "آیس موکا",           price: 260, img: "iced-mocha-3dfa88" },
      { en: "Iced Caramel Macchiato", fa: "آیس کارامل ماکیاتو", price: 260, img: "iced-caramel-macchiato-b0c064" },
      { en: "Affogato",               fa: "آفوگاتو",            price: 210, img: "affogato-d09bb9" },
      { en: "Iced Dalgona",           fa: "آیس دالگونا",        price: 230, img: "iced-dalgona-7898c2" },
      { en: "Iced Romano",            fa: "آیس رومانو",         price: 195, img: "iced-romano-590290" },
    ],
  },
  {
    id: "smoothies",
    name: { en: "Smoothies", fa: "اسموتی" },
    items: [
      { en: "Strawberry Smoothie",  fa: "اسموتی توت‌فرنگی", price: 280, img: "strawberry-smoothie-ff8933" },
      { en: "Mango Smoothie",       fa: "اسموتی انبه",      price: 270, img: "mango-smoothie-f7bae5" },
      { en: "Mixed Berry Smoothie", fa: "اسموتی بری میکس",  price: null, img: "mixed-berry-smoothie-b69530" },
      { en: "Tropical Smoothie",    fa: "اسموتی استوایی",   price: null, img: "tropical-smoothie-868709" },
    ],
  },
  {
    id: "mocktails",
    name: { en: "Mocktails", fa: "ماکتیل" },
    items: [
      { en: "Classic Mojito",      fa: "موهیتو کلاسیک",    price: 235, img: "classic-mojito-3bf40d" },
      { en: "Mojito Passion Fruit",fa: "موهیتو پشن فروت",  price: 265, img: "mojito-passion-fruit-9a5644" },
      { en: "Blue Lagoon",         fa: "بلو لاگون",        price: 210, img: "blue-lagoon-649f68" },
      { en: "Strawberry Spark",    fa: "استرابری اسپارک",  price: 270, img: "strawberry-spark-a1920f" },
      { en: "Mery Berry",          fa: "مری بری",          price: null, signature: true },
      { en: "Mery Yoohoo",         fa: "مری یوهویی",       price: "variable" },
      { en: "Custom Drink",        fa: "نوشیدنی دلخواه",   price: "variable", img: "custom-drink-715539" },
    ],
  },
  {
    id: "matcha-bar",
    name: { en: "Matcha Bar", fa: "ماچا بار" },
    items: [
      { en: "Matcha Latte",            fa: "ماچا لاته",           price: 250, img: "matcha-latte-dd305d" },
      { en: "Strawberry Matcha Latte", fa: "ماچا توت‌فرنگی لاته", price: 330, img: "strawberry-matcha-latte-0a22a6" },
      { en: "Matcha Affogato",         fa: "ماچا آفوگاتو",        price: null },
      { en: "Matcha Mango",            fa: "ماچا انبه",           price: 360, img: "matcha-mango-059b4c" },
    ],
  },
  {
    id: "milkshakes",
    name: { en: "Milkshakes", fa: "شیک" },
    items: [
      { en: "Strawberry",    fa: "توت‌فرنگی",   price: 330, img: "strawberry-shake-330fd7" },
      { en: "Chocolate",     fa: "شکلات",       price: 330, img: "chocolate-shake-163bf7" },
      { en: "Vanilla",       fa: "وانیل",       price: 290, img: "vanilla-shake-5a192d" },
      { en: "Caramel",       fa: "کارامل",      price: 290, img: "caramel-shake-dec645" },
      { en: "Hazelnut",      fa: "فندق",        price: 290, img: "hazelnut-shake-52a542" },
      { en: "Nutella",       fa: "نوتلا",       price: 360, img: "nutella-shake-889ae4" },
      { en: "Oreo",          fa: "اورئو",       price: 360, img: "oreo-shake-5506fb" },
      { en: "Peanut Butter", fa: "بادام زمینی", price: 320, img: "peanut-butter-shake-7a7420" },
      { en: "Lotus Biscoff", fa: "لوتوس",       price: 360, img: "lotus-biscoff-shake-6555d8" },
      { en: "Banana",        fa: "موز",         price: 360, img: "banana-shake-3c2baf" },
      { en: "Mango",         fa: "انبه",        price: 330, img: "mango-shake-9ccea1" },
      { en: "Espresso",      fa: "اسپرسو",      price: 300, img: "espresso-shake-3397dd" },
    ],
  },
  {
    id: "hot-drinks",
    name: { en: "Hot Drinks", fa: "نوشیدنی گرم" },
    items: [
      { en: "Black Tea",       fa: "چای سیاه",   price: [75, 100], img: "black-tea-3256b0" },
      { en: "Karak Tea",       fa: "چای کرک",    price: 220, img: "karak-tea-a3c302" },
      { en: "Green Tea",       fa: "چای سبز",    price: 180, img: "green-tea-79437d" },
      { en: "Chamomile",       fa: "بابونه",     price: 180, img: "chamomile-15b3fe" },
      { en: "Borage",          fa: "گل گاوزبان", price: 180, img: "borage-350a01" },
      { en: "Peppermint",      fa: "نعناع",      price: 180, img: "peppermint-564951" },
      { en: "Saffron Tea",     fa: "چای زعفران", price: 180, img: "saffron-tea-b66150" },
      { en: "Masala Tea",      fa: "چای ماسالا", price: 220, img: "masala-tea-4bbe06" },
      { en: "Hot Chocolate",   fa: "هات چاکلت",  price: 220, img: "hot-chocolate-935c79" },
      { en: "White Chocolate", fa: "وایت چاکلت", price: 220, img: "white-chocolate-d9471b" },
      { en: "Hot Lotus",       fa: "هات لوتوس",  price: 260, img: "hot-lotus-d12c73" },
      { en: "Matcha Latte",    fa: "ماچا لاته",  price: 250, img: "matcha-latte-hot-3df7b6" },
    ],
  },
  {
    id: "iced-tea",
    name: { en: "Iced Tea", fa: "آیس تی" },
    items: [
      { en: "Iced Tea",            fa: "آیس تی",           price: 140, img: "iced-tea-0a6070" },
      { en: "Iced Lemon Tea",      fa: "آیس لمون تی",      price: 170, img: "iced-lemon-tea-0eaa40" },
      { en: "Mery Strawberry Tea", fa: "مری استرابری تی",  price: 195, signature: true, img: "mery-strawberry-tea-6c0e14" },
    ],
  },
  {
    id: "dessert",
    name: { en: "Dessert", fa: "دسر" },
    items: [
      { en: "Cheesecake", fa: "چیز کیک",  price: 290, img: "cheesecake-8b79a2" },
      { en: "Jar Cake",   fa: "جار کیک",  price: 240, img: "jar-cake-46f4e7" },
      { en: "Tiramisu",   fa: "تیرامیسو", price: 270, img: "tiramisu-ffab0d" },
    ],
  },
  {
    id: "breakfast",
    name: { en: "Breakfast / Brunch", fa: "صبحانه و برانچ" },
    items: [
      { en: "Toast",     fa: "تست",     price: null, img: "toast-d7c2f9" },
      { en: "Croissant", fa: "کروسان",  price: null, img: "croissant-c2f238" },
      { en: "Oatmeal",   fa: "اوتمیل",  price: null, img: "oatmeal-501ab3" },
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
