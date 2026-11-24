(function () {
  var loginView = document.getElementById("loginView");
  var dashView = document.getElementById("dashView");
  var logoutBtn = document.getElementById("logoutBtn");

  function api(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    opts.credentials = "same-origin";
    return fetch(url, opts).then(function (r) {
      return r.json().then(function (data) { return { status: r.status, data: data }; });
    });
  }

  function showDash() {
    loginView.classList.add("hidden");
    dashView.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loadSettings();
    loadMembers();
    loadReviews();
    loadPrices();
  }
  function showLogin() {
    dashView.classList.add("hidden");
    loginView.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  api("/api/admin/session").then(function (res) {
    if (res.data.isAdmin) showDash(); else showLogin();
  });

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var errEl = document.getElementById("loginError");
    errEl.classList.add("hidden");
    api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }),
    }).then(function (res) {
      if (res.data.ok) { showDash(); }
      else { errEl.textContent = res.data.error || "خطا در ورود"; errEl.classList.remove("hidden"); }
    });
  });

  logoutBtn.addEventListener("click", function () {
    api("/api/admin/logout", { method: "POST" }).then(showLogin);
  });

  // ---- settings ----
  function loadSettings() {
    api("/api/admin/settings").then(function (res) {
      if (!res.data.ok) return;
      var map = {};
      res.data.settings.forEach(function (s) { map[s.key] = s.value; });
      document.getElementById("rewardDesc").value = map.welcome_reward_description || "";
      document.getElementById("rewardDays").value = map.welcome_reward_valid_days || "";
    });
  }

  document.getElementById("settingsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = document.getElementById("settingsMsg");
    msg.className = "hidden";
    api("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({
        description: document.getElementById("rewardDesc").value,
        validDays: Number(document.getElementById("rewardDays").value),
      }),
    }).then(function (res) {
      msg.className = res.data.ok ? "success" : "error";
      msg.textContent = res.data.ok ? "ذخیره شد." : (res.data.error || "خطا در ذخیره");
    });
  });

  // ---- members ----
  var searchBox = document.getElementById("searchBox");
  var searchTimer;
  searchBox.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadMembers, 300);
  });

  function rewardBadge(reward) {
    if (!reward) return '<span class="muted">—</span>';
    if (reward.redeemed_at) return '<span class="badge badge-redeemed">استفاده‌شده</span>';
    if (new Date(reward.expires_at) < new Date()) return '<span class="badge badge-expired">منقضی</span>';
    return '<span class="badge badge-active">' + reward.description + '</span>';
  }

  function loadMembers() {
    var q = searchBox.value.trim();
    api("/api/admin/members" + (q ? "?q=" + encodeURIComponent(q) : "")).then(function (res) {
      if (!res.data.ok) return;
      var tbody = document.getElementById("membersBody");
      var empty = document.getElementById("membersEmpty");
      var members = res.data.members;
      empty.classList.toggle("hidden", members.length > 0);
      tbody.innerHTML = members.map(function (m) {
        var reward = m.rewards && m.rewards[0];
        var canRedeem = reward && !reward.redeemed_at && new Date(reward.expires_at) >= new Date();
        var redeemBtn = canRedeem
          ? '<button class="btn-danger-outline" data-redeem="' + reward.id + '">ثبت استفاده</button>'
          : "";
        return "<tr>" +
          "<td>" + escapeHtml(m.name) + "</td>" +
          '<td dir="ltr" style="text-align:right;">' + escapeHtml(m.phone) + "</td>" +
          "<td>" + escapeHtml((m.created_at || "").slice(0, 10)) + "</td>" +
          "<td>" + rewardBadge(reward) + "</td>" +
          "<td>" + redeemBtn + "</td>" +
          "</tr>";
      }).join("");

      Array.prototype.forEach.call(tbody.querySelectorAll("[data-redeem]"), function (btn) {
        btn.addEventListener("click", function () {
          btn.disabled = true;
          api("/api/admin/rewards/" + btn.getAttribute("data-redeem") + "/redeem", { method: "POST" })
            .then(function () { loadMembers(); });
        });
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- tabs ----
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var membersView = document.getElementById("membersView");
  var reviewsView = document.getElementById("reviewsView");
  var pricesView = document.getElementById("pricesView");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      var tab = btn.getAttribute("data-tab");
      membersView.classList.toggle("hidden", tab !== "members");
      reviewsView.classList.toggle("hidden", tab !== "reviews");
      pricesView.classList.toggle("hidden", tab !== "prices");
      if (tab === "prices") loadPrices();
    });
  });

  // ---- menu prices ----
  function menuItemKey(categoryId, item) {
    var slug = String(item.en || "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return categoryId + ":" + slug;
  }

  function priceMode(price) {
    if (price === null) return "soon";
    if (price === "variable") return "variable";
    return Array.isArray(price) ? "two" : "single";
  }

  function priceLabel(mode) {
    return { single: "یک قیمت", two: "دو قیمت", soon: "به‌زودی", variable: "وابسته به سفارش" }[mode];
  }

  function createPriceField(label, className) {
    var wrap = document.createElement("div");
    wrap.className = "price-field " + className;
    var fieldLabel = document.createElement("label");
    fieldLabel.textContent = label;
    var input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "1000000";
    input.step = "1";
    input.inputMode = "numeric";
    wrap.appendChild(fieldLabel);
    wrap.appendChild(input);
    return wrap;
  }

  function syncPriceFields(row) {
    var mode = row.querySelector("[data-price-mode]").value;
    var primary = row.querySelector(".price-primary");
    var secondary = row.querySelector(".price-secondary");
    primary.classList.toggle("hidden", mode === "soon" || mode === "variable");
    secondary.classList.toggle("hidden", mode !== "two");
  }

  function showPriceMessage(row, ok, message) {
    var msg = row.querySelector(".price-msg");
    msg.className = "price-msg " + (ok ? "success" : "error");
    msg.textContent = message;
  }

  function readPrice(row) {
    var mode = row.querySelector("[data-price-mode]").value;
    if (mode === "soon") return { price: null };
    if (mode === "variable") return { price: "variable" };

    var first = Number(row.querySelector(".price-primary input").value);
    var second = Number(row.querySelector(".price-secondary input").value);
    if (!Number.isInteger(first) || first < 0 || first > 1000000) return { error: "قیمت اول را به‌صورت عدد صحیح وارد کنید." };
    if (mode === "two") {
      if (!Number.isInteger(second) || second < 0 || second > 1000000) return { error: "قیمت دوم را به‌صورت عدد صحیح وارد کنید." };
      return { price: [first, second] };
    }
    return { price: first };
  }

  function createPriceRow(category, item, override) {
    var key = menuItemKey(category.id, item);
    var price = override === undefined ? item.price : override;
    var mode = priceMode(price);
    var row = document.createElement("div");
    row.className = "price-row";

    var name = document.createElement("div");
    name.className = "price-name";
    name.textContent = item.fa;
    var englishName = document.createElement("small");
    englishName.dir = "ltr";
    englishName.textContent = item.en;
    name.appendChild(englishName);

    var modeField = document.createElement("div");
    modeField.className = "price-field";
    var modeLabel = document.createElement("label");
    modeLabel.textContent = "وضعیت";
    var select = document.createElement("select");
    select.setAttribute("data-price-mode", "");
    ["single", "two", "soon", "variable"].forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = priceLabel(value);
      option.selected = value === mode;
      select.appendChild(option);
    });
    modeField.appendChild(modeLabel);
    modeField.appendChild(select);

    var firstField = createPriceField("قیمت اول", "price-primary");
    var secondField = createPriceField("قیمت دوم", "price-secondary");
    firstField.querySelector("input").value = Array.isArray(price) ? price[0] : (typeof price === "number" ? price : "");
    secondField.querySelector("input").value = Array.isArray(price) ? price[1] : "";

    var save = document.createElement("button");
    save.type = "button";
    save.className = "btn-primary";
    save.textContent = "ذخیره";
    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn-outline";
    reset.textContent = "بازگردانی";
    reset.disabled = override === undefined;

    var message = document.createElement("p");
    message.className = "price-msg hidden";
    row.appendChild(name);
    row.appendChild(modeField);
    row.appendChild(firstField);
    row.appendChild(secondField);
    row.appendChild(save);
    row.appendChild(reset);
    row.appendChild(message);
    syncPriceFields(row);

    select.addEventListener("change", function () { syncPriceFields(row); });
    save.addEventListener("click", function () {
      var result = readPrice(row);
      if (result.error) return showPriceMessage(row, false, result.error);
      save.disabled = true;
      api("/api/admin/menu-prices", { method: "POST", body: JSON.stringify({ itemKey: key, price: result.price }) })
        .then(function (res) {
          if (res.data.ok) {
            reset.disabled = false;
            showPriceMessage(row, true, "ذخیره شد؛ منوی سایت به‌روز شد.");
          } else {
            showPriceMessage(row, false, res.data.error || "خطا در ذخیره");
          }
        })
        .catch(function () { showPriceMessage(row, false, "خطا در ارتباط با سرور"); })
        .then(function () { save.disabled = false; });
    });
    reset.addEventListener("click", function () {
      reset.disabled = true;
      api("/api/admin/menu-prices/" + encodeURIComponent(key), { method: "DELETE" })
        .then(function (res) {
          if (res.data.ok) loadPrices();
          else { reset.disabled = false; showPriceMessage(row, false, res.data.error || "خطا در بازگردانی"); }
        })
        .catch(function () { reset.disabled = false; showPriceMessage(row, false, "خطا در ارتباط با سرور"); });
    });
    return row;
  }

  function loadPrices() {
    if (typeof MERY_MENU === "undefined") return;
    api("/api/admin/menu-prices").then(function (res) {
      if (!res.data.ok) return;
      var overrides = {};
      res.data.overrides.forEach(function (entry) { overrides[entry.itemKey] = entry.price; });
      var list = document.getElementById("pricesList");
      list.innerHTML = "";
      MERY_MENU.forEach(function (category) {
        var heading = document.createElement("h3");
        heading.className = "price-category";
        heading.textContent = category.name.fa;
        list.appendChild(heading);
        category.items.forEach(function (item) {
          var key = menuItemKey(category.id, item);
          var hasOverride = Object.prototype.hasOwnProperty.call(overrides, key);
          list.appendChild(createPriceRow(category, item, hasOverride ? overrides[key] : undefined));
        });
      });
    }).catch(function () {
      var error = document.getElementById("pricesError");
      error.textContent = "خطا در بارگذاری قیمت‌ها";
      error.classList.remove("hidden");
    });
  }

  // ---- reviews ----
  var reviewStatus = "pending";
  var subtabBtns = Array.prototype.slice.call(document.querySelectorAll(".subtab-btn"));

  subtabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      subtabBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      reviewStatus = btn.getAttribute("data-status");
      loadReviews();
    });
  });

  function formatDate(s) {
    if (!s) return "";
    return String(s).slice(0, 10);
  }

  function loadReviews() {
    api("/api/admin/reviews?status=" + encodeURIComponent(reviewStatus)).then(function (res) {
      if (!res.data.ok) return;
      var list = document.getElementById("reviewsList");
      var empty = document.getElementById("reviewsEmpty");
      var reviews = res.data.reviews;
      empty.classList.toggle("hidden", reviews.length > 0);

      list.innerHTML = reviews.map(function (r) {
        var pendingActions = reviewStatus === "pending"
          ? '<button class="btn-ok" data-approve="' + r.id + '">تأیید</button>' +
            '<button class="btn-reject" data-reject="' + r.id + '">رد</button>'
          : "";
        var actions = '<div class="actions">' + pendingActions +
          '<button class="btn-delete" data-delete="' + r.id + '">حذف</button>' +
          "</div>";
        return '<div class="review-card">' +
          '<div class="meta">' +
            "<strong>" + escapeHtml(r.display_name) + "</strong>" +
            '<span dir="ltr">' + escapeHtml(r.phone) + "</span>" +
            "<span>" + formatDate(r.created_at) + "</span>" +
            (r.item_tag ? "<span>" + escapeHtml(r.item_tag) + "</span>" : "") +
            "<span>♥ " + r.reaction_count + "</span>" +
          "</div>" +
          '<p class="body-text">' + escapeHtml(r.body) + "</p>" +
          actions +
        "</div>";
      }).join("");

      Array.prototype.forEach.call(list.querySelectorAll("[data-approve]"), function (btn) {
        btn.addEventListener("click", function () {
          btn.disabled = true;
          api("/api/admin/reviews/" + btn.getAttribute("data-approve") + "/approve", { method: "POST" })
            .then(function () { loadReviews(); });
        });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-reject]"), function (btn) {
        btn.addEventListener("click", function () {
          btn.disabled = true;
          api("/api/admin/reviews/" + btn.getAttribute("data-reject") + "/reject", { method: "POST" })
            .then(function () { loadReviews(); });
        });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-delete]"), function (btn) {
        btn.addEventListener("click", function () {
          if (!window.confirm("این نظر برای همیشه حذف می‌شود. ادامه می‌دهید؟")) return;
          btn.disabled = true;
          api("/api/admin/reviews/" + btn.getAttribute("data-delete") + "/delete", { method: "POST" })
            .then(function () { loadReviews(); });
        });
      });
    });

    // pending-count badge always reflects pending, regardless of which subtab is open
    api("/api/admin/reviews?status=pending").then(function (res) {
      if (!res.data.ok) return;
      var n = res.data.reviews.length;
      document.getElementById("pendingCount").textContent = n > 0 ? "(" + n + ")" : "";
    });
  }
})();
