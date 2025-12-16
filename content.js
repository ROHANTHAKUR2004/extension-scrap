

// Prevent double injection
(function () {
  // Prevent double injection safely
  if (window.__EBAY_TOP_BUTTON__) {
    console.log("Scraper already injected");
    return;
  }
  window.__EBAY_TOP_BUTTON__ = true;

  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(fn, 0);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  onReady(() => {
    console.log("EBAY SCRAPER CONTENT SCRIPT LOADED");

    /* ===== BUTTON ===== */
    const btn = document.createElement("button");
    btn.textContent = "Scrape Product";

    Object.assign(btn.style, {
      position: "fixed",
      top: "72px",
      right: "16px",
      zIndex: "99999",
      padding: "8px 14px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    });

    document.body.appendChild(btn);

    /* ===== TOAST ===== */
    const toast = document.createElement("div");
    Object.assign(toast.style, {
      position: "fixed",
      top: "112px",
      right: "16px",
      padding: "8px 12px",
      background: "#111",
      color: "#fff",
      borderRadius: "6px",
      fontSize: "12px",
      display: "none",
      zIndex: "99999"
    });

    document.body.appendChild(toast);

    function showToast(msg, ok = true) {
      toast.textContent = msg;
      toast.style.background = ok ? "#16a34a" : "#dc2626";
      toast.style.display = "block";
      setTimeout(() => (toast.style.display = "none"), 2000);
    }

    /* ===== SCRAPE ===== */
    btn.addEventListener("click", () => {
      btn.textContent = "Scraping...";
      btn.disabled = true;

      const itemId =
        location.pathname.match(/\/itm\/(\d+)/)?.[1] || "";

      const payload = {
        itemId,
        url: location.href,
        title:
          document.querySelector(".x-item-title__mainTitle span")?.innerText || "",
        price: [...document.querySelectorAll(".x-price-section .ux-textspans")]
          .map(e => e.innerText.trim())
          .join(" "),
        images: [...document.querySelectorAll(".ux-image-grid img")]
          .map(i => i.src)
          .filter(Boolean),
        category: [...document.querySelectorAll('nav[role="navigation"] a')]
          .map(a => a.innerText.trim())
          .join(" > "),
        itemSpecifics: (() => {
          const obj = {};
          document.querySelectorAll(".ux-labels-values__labels").forEach(l => {
            const k = l.innerText.trim();
            const v = l.nextElementSibling?.innerText.trim();
            if (k && v) obj[k] = v;
          });
          return obj;
        })()
      };

      chrome.runtime.sendMessage(
        { action: "SAVE_TO_SHEET", payload },
        res => {
          btn.textContent = "Scrape Product";
          btn.disabled = false;

          if (res?.status === "duplicate") {
            showToast("Already scraped", false);
          } else if (res?.status === "inserted") {
            showToast("Saved to Google Sheet");
          } else {
            showToast("Scrape failed", false);
          }
        }
      );
    });
  });
})();

