/* ============================================================================
   MERY COFFEE CLUB — INTERFACE TEXT (Persian + English)
   Every visible string lives here so wording can be changed in one place.
   ========================================================================== */

const MERY_I18N = {
  fa: {
    dir: "rtl", lang: "fa",
    htmlTitle: "کافه مری | مکث روزانه‌ی شما — رشت",
    metaDesc:
      "کافه مری در رشت؛ قهوه تخصصی، صبحانه، دسر و ماکتیل. هر روز از ۶ صبح تا ۱۱ شب. مکث روزانه‌ی شما.",

    skipToContent: "رفتن به محتوای اصلی",
    langToggle: "English",
    langToggleAria: "تغییر زبان به انگلیسی",

    nav: {
      menu: "منو",
      story: "داستان ما",
      club: "باشگاه مشتریان",
      instagram: "اینستاگرام",
      find: "ما را بیابید",
      openMenu: "باز کردن منوی ناوبری",
      closeMenu: "بستن منوی ناوبری",
    },

    hero: {
      line1: "قهوه.",
      line2: "صبحانه.",
      line3: "مکث.",
      tagline: "مکث روزانه‌ی شما",
      cta: "دیدن منو",
      scroll: "بچرخانید",
      pauseVideo: "توقف ویدیو",
      playVideo: "پخش ویدیو",
      videoAria: "ویدیوی فضای داخلی کافه مری",
    },

    menu: {
      eyebrow: "منوی کامل",
      title: "چه میل دارید؟",
      intro:
        "همهٔ نوشیدنی‌ها با دانهٔ تازه رست‌شده و شیر تازه آماده می‌شوند. برای دیدن هر بخش، دسته‌ای را انتخاب کنید.",
      all: "همه",
      signature: "پیشنهاد مری",
      priceSoon: "به‌زودی",
      priceNote: "قیمت‌ها به‌زودی در همین صفحه به‌روزرسانی می‌شوند.",
      filterAria: "فیلتر دسته‌بندی منو",
      jumpAria: "پرش به دسته",
      searchAria: "جستجو در منو",
      searchPlaceholder: "جستجوی نوشیدنی یا غذا…",
      searchClearAria: "پاک کردن جستجو",
      searchResults: (n, q) => `${n} نتیجه برای «${q}»`,
      searchEmpty: (q) => `چیزی برای «${q}» پیدا نشد.`,
    },

    story: {
      eyebrow: "داستان ما",
      title: "یک فنجان، یک مکث",
      p1: "کافه مری از یک ایده‌ی ساده شروع شد: جایی کوچک و آرام در دل رشت که بشود چند دقیقه از شلوغی روز فاصله گرفت.",
      p2: "هر فنجان اینجا دستی آماده می‌شود؛ از اسپرسوی کلاسیک تا ماچا و ماکتیل‌های تابستانی. صبحانه‌ها تازه‌اند و دسرها هر روز آماده می‌شوند.",
      p3: "چه ایستاده پشت بار، چه نشسته کنار پنجره، چه در راه — مری همان مکث کوتاه روزانه‌ی شماست.",
      quote: "شاید قهوه به من معتاد شده!",
      quoteSource: "روی دیوار کافه",
      videoAria: "ویدیوی آماده‌سازی لاته توسط باریستا",
    },

    club: {
      eyebrow: "باشگاه مشتریان مری",
      title: "عضو باشگاه مری شوید",
      intro:
        "با ثبت شماره‌تان عضو باشگاه مشتریان مری شوید و هدیهٔ خوش‌آمدگویی‌تان را همین حالا بگیرید.",
      perkTeaser: "هدیهٔ خوش‌آمدگویی ویژهٔ اعضای جدید",
      nameLabel: "نام شما",
      phoneLabel: "شماره موبایل",
      phoneHint: "برای اطلاع از جایزه و پیشنهادهای ویژه",
      submit: "عضویت در باشگاه",
      submitting: "در حال ثبت…",
      privacyNote: "شماره شما فقط برای باشگاه مشتریان استفاده می‌شود و به اشتراک گذاشته نمی‌شود.",
      successTitle: "خوش آمدید!",
      successBody: (desc, date) => `عضویت شما ثبت شد. هدیهٔ شما: «${desc}» — تا ${date} معتبر است.`,
      joinAnother: "ثبت شمارهٔ دیگر",
      errors: {
        invalid_name: "نام را کامل وارد کنید.",
        invalid_phone: "شماره موبایل معتبر نیست. مثال: 09123456789",
        invalid_birthday: "تاریخ تولد نامعتبر است.",
        duplicate_phone: "این شماره قبلاً عضو باشگاه شده است.",
        rate_limited: "تعداد درخواست‌ها زیاد بوده، کمی بعد دوباره امتحان کنید.",
        invalid_request: "درخواست نامعتبر است. صفحه را تازه کنید و دوباره امتحان کنید.",
        network: "ارتباط برقرار نشد. اتصال اینترنت را بررسی کنید.",
        generic: "مشکلی پیش آمد. لطفاً دوباره امتحان کنید.",
      },
    },

    ig: {
      eyebrow: "اینستاگرام",
      title: "هر روز در اینستاگرام",
      intro:
        "تازه‌ترین نوشیدنی‌ها، صبحانه‌ها و لحظه‌های کافه را آنجا منتشر می‌کنیم.",
      storiesLabel: "استوری‌ها",
      postsLabel: "پست‌ها",
      follow: "دنبال کنید",
      openOnIg: "دیدن در اینستاگرام",
      storyPrev: "استوری قبلی",
      storyNext: "استوری بعدی",
      viewerClose: "بستن",
      viewerAria: "نمایشگر استوری",
      counter: (i, n) => `استوری ${i} از ${n}`,
    },

    find: {
      eyebrow: "ما را بیابید",
      title: "سری به ما بزنید",
      addressLabel: "نشانی",
      hoursLabel: "ساعت کاری",
      contactLabel: "ارتباط با ما",
      directions: "مسیریابی",
      call: "تماس",
      mapAria: "نقشهٔ موقعیت کافه مری",
      mapNote: "نقشه را باز کنید تا مسیر دقیق را ببینید.",
    },

    footer: {
      tagline: "مکث روزانه‌ی شما",
      rights: "کافه مری. تمامی حقوق محفوظ است.",
      backToTop: "بازگشت به بالا",
    },
  },

  en: {
    dir: "ltr", lang: "en",
    htmlTitle: "Mery Coffee Club | Your Daily Pause — Rasht",
    metaDesc:
      "Mery Coffee Club in Rasht — specialty coffee, brunch, desserts and mocktails. Open daily 6 AM to 11 PM. Your daily pause.",

    skipToContent: "Skip to main content",
    langToggle: "فارسی",
    langToggleAria: "Switch language to Persian",

    nav: {
      menu: "Menu",
      story: "Our Story",
      club: "Customer Club",
      instagram: "Instagram",
      find: "Find Us",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
    },

    hero: {
      line1: "Coffee.",
      line2: "Brunch.",
      line3: "Pause.",
      tagline: "Your Daily Pause",
      cta: "View Menu",
      scroll: "Scroll",
      pauseVideo: "Pause video",
      playVideo: "Play video",
      videoAria: "Video of the Mery Coffee Club interior",
    },

    menu: {
      eyebrow: "Full Menu",
      title: "What are you having?",
      intro:
        "Everything is made to order with freshly roasted beans and fresh milk. Pick a category to jump to it.",
      all: "All",
      signature: "House favourite",
      priceSoon: "Soon",
      priceNote: "Prices are being added and will appear here shortly.",
      filterAria: "Filter menu by category",
      jumpAria: "Jump to category",
      searchAria: "Search the menu",
      searchPlaceholder: "Search for a drink or dish…",
      searchClearAria: "Clear search",
      searchResults: (n, q) => `${n} result${n === 1 ? "" : "s"} for "${q}"`,
      searchEmpty: (q) => `Nothing found for "${q}".`,
    },

    story: {
      eyebrow: "Our Story",
      title: "One cup, one pause",
      p1: "Mery started from a simple idea: a small, calm room in the middle of Rasht where you can step out of the noise for a few minutes.",
      p2: "Every cup here is made by hand — from a classic espresso to matcha and summer mocktails. Breakfast is fresh and the desserts are made daily.",
      p3: "Standing at the bar, sitting by the window, or grabbing it to go — Mery is your short daily pause.",
      quote: "Maybe coffee is addicted to me!",
      quoteSource: "On the café wall",
      videoAria: "Video of a barista pouring latte art",
    },

    club: {
      eyebrow: "Mery Customer Club",
      title: "Join the Mery Club",
      intro:
        "Leave your number to join the Mery customer club and claim your welcome gift right now.",
      perkTeaser: "A welcome gift for new members",
      nameLabel: "Your name",
      phoneLabel: "Mobile number",
      phoneHint: "So we can reach you about your gift and offers",
      submit: "Join the club",
      submitting: "Submitting…",
      privacyNote: "Your number is only used for the customer club and is never shared.",
      successTitle: "Welcome!",
      successBody: (desc, date) => `You're in. Your gift: "${desc}" — valid until ${date}.`,
      joinAnother: "Register another number",
      errors: {
        invalid_name: "Please enter your full name.",
        invalid_phone: "That doesn't look like a valid number. Example: 09123456789",
        invalid_birthday: "Invalid birthday.",
        duplicate_phone: "This number is already a club member.",
        rate_limited: "Too many attempts — please try again shortly.",
        invalid_request: "Invalid request. Refresh the page and try again.",
        network: "Couldn't connect. Check your internet connection.",
        generic: "Something went wrong. Please try again.",
      },
    },

    ig: {
      eyebrow: "Instagram",
      title: "Every day on Instagram",
      intro: "New drinks, breakfasts and moments from the café go up there first.",
      storiesLabel: "Stories",
      postsLabel: "Posts",
      follow: "Follow",
      openOnIg: "View on Instagram",
      storyPrev: "Previous story",
      storyNext: "Next story",
      viewerClose: "Close",
      viewerAria: "Story viewer",
      counter: (i, n) => `Story ${i} of ${n}`,
    },

    find: {
      eyebrow: "Find Us",
      title: "Come on in",
      addressLabel: "Address",
      hoursLabel: "Hours",
      contactLabel: "Contact",
      directions: "Get directions",
      call: "Call",
      mapAria: "Map showing the location of Mery Coffee Club",
      mapNote: "Open the map for exact directions.",
    },

    footer: {
      tagline: "Your Daily Pause",
      rights: "Mery Coffee Club. All rights reserved.",
      backToTop: "Back to top",
    },
  },
};
