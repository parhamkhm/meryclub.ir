/* ============================================================================
   MERY COFFEE CLUB — INSTAGRAM CONTENT
   ----------------------------------------------------------------------------
   Each entry drives BOTH the stories row and the posts grid.

   To add a new one:
     1. Put the tall image in  assets/img/stories/<slug>.jpg  (and .webp)
        plus a small  <slug>-thumb.jpg / .webp
     2. Put a square crop in   assets/img/posts/<slug>.jpg  (and .webp)
     3. Add a block below with the same <slug>.

   "alt" is read aloud by screen readers — describe what is in the picture.
   Set  post: false  to keep something in the stories row but out of the grid.
   ========================================================================== */

const MERY_GALLERY = [
  {
    slug: "morning-latte",
    caption: { fa: "صبح‌ها با مری", en: "Mornings at Mery" },
    alt: {
      fa: "فنجان لاته با طرح روی شیر، کنار ظرف صبحانه با توت‌فرنگی",
      en: "A latte with poured art beside a breakfast jar topped with strawberries",
    },
  },
  {
    slug: "mango-berry",
    caption: { fa: "ماکتیل انبه و توت‌فرنگی", en: "Mango Berry" },
    alt: {
      fa: "لیوان ماکتیل توت‌فرنگی و انبه با خامه و توت‌فرنگی تازه",
      en: "A tall mango and strawberry mocktail topped with cream and fresh strawberry",
    },
  },
  {
    slug: "oreo-milkshake",
    caption: { fa: "شیک اورئو", en: "Oreo Milkshake" },
    alt: {
      fa: "شیک اورئو با خامه و سس شکلات",
      en: "An Oreo milkshake with whipped cream and chocolate sauce",
    },
  },
  {
    slug: "iced-lemon-tea",
    caption: { fa: "آیس لمون تی", en: "Iced Lemon Tea" },
    alt: {
      fa: "لیوان آیس لمون تی روی سینی، کنار یک برش کیک",
      en: "A glass of iced lemon tea on a tray next to a slice of cake",
    },
  },
  {
    slug: "abghoore-dollar",
    caption: { fa: "آبغوره دلار", en: "Verjuice Cooler" },
    alt: {
      fa: "دو لیوان نوشیدنی سرد آبغوره روی میز تیره کنار گلدان",
      en: "Two glasses of chilled verjuice on a dark table beside a small vase",
    },
  },
  {
    slug: "mery-nola",
    caption: { fa: "مری نولا", en: "Mery Nola" },
    alt: {
      fa: "چند ظرف صبحانه گرانولا با روبان آبی و توت‌فرنگی",
      en: "Granola breakfast boxes tied with blue ribbon and topped with strawberries",
    },
  },
  {
    slug: "breakfast-sandwiches",
    caption: { fa: "صبحانه و ساندویچ", en: "Breakfast & Sandwiches" },
    alt: {
      fa: "چیدمان ساندویچ‌های صبحانه روی سینی",
      en: "An arrangement of breakfast sandwiches on a serving tray",
    },
  },
  {
    slug: "sweets-desserts",
    caption: { fa: "شیرینی و دسر", en: "Sweets & Desserts" },
    alt: {
      fa: "انواع کیک و دسر چیده‌شده کنار هم",
      en: "An assortment of cakes and desserts arranged together",
    },
  },
  {
    slug: "mery-yakhooi",
    caption: { fa: "مری یخویی", en: "Mery Yakhooi" },
    alt: {
      fa: "لیوان نوشیدنی سرد آبی‌رنگ در فضای شب",
      en: "A bright blue iced drink held outdoors at night",
    },
  },
  {
    slug: "sunday-iced",
    caption: { fa: "یکشنبه", en: "Sunday" },
    alt: {
      fa: "دو لیوان نوشیدنی سرد مری در فضای باز",
      en: "Two Mery iced drinks outdoors",
    },
  },
  {
    slug: "beans-and-grinders",
    caption: { fa: "دانه و آسیاب", en: "Beans & Grinders" },
    alt: {
      fa: "قفسهٔ دانه‌های قهوه و آسیاب‌ها در کافه",
      en: "A shelf of coffee beans and grinders in the café",
    },
  },
  {
    slug: "tuesday-terrace",
    caption: { fa: "سه‌شنبه", en: "Tuesday" },
    alt: {
      fa: "میز و صندلی کنار پنجرهٔ کافه",
      en: "A table and chair beside the café window",
    },
  },
];
