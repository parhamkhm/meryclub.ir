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
})();
