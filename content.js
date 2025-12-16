if (!window.__EBAY_SCRAPER_LOADED__) {
  window.__EBAY_SCRAPER_LOADED__ = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== "SCRAPE_PRODUCT_FULL") return;

    const url = window.location.href;

    const itemIdMatch = window.location.pathname.match(/\/itm\/(\d+)/);
    const itemId = itemIdMatch ? itemIdMatch[1] : "";

    const title =
      document.querySelector(".x-item-title__mainTitle span")?.innerText || "";

    const price = [...document.querySelectorAll(".x-price-section .ux-textspans")]
      .map(el => el.innerText.trim())
      .join(" ");

    const images = [...document.querySelectorAll(".ux-image-grid img")]
      .map(img => img.src)
      .filter(Boolean);

    // CATEGORY TREE
    const category = [...document.querySelectorAll(
      'nav[role="navigation"] a'
    )]
      .map(el => el.innerText.trim())
      .filter(Boolean)
      .join(" > ");

    const itemSpecifics = {};
    document
      .querySelectorAll(".ux-labels-values__labels")
      .forEach(label => {
        const key = label.innerText.trim();
        const value =
          label.nextElementSibling?.innerText.trim();
        if (key && value) itemSpecifics[key] = value;
      });

    sendResponse({
      itemId,
      url,
      title,
      price,
      images,
      category,
      itemSpecifics
    });

    chrome.runtime.sendMessage({
      action: "SAVE_TO_SHEET",
      payload: {
        itemId,
        url,
        title,
        price,
        images,
        category,
        itemSpecifics
      }
    });

    return true;
  });
}
