const output = document.getElementById("output");

document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url?.includes("ebay.com")) {
    output.textContent = "Open an eBay product page";
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  chrome.tabs.sendMessage(tab.id, { action: "SCRAPE_PRODUCT_FULL" }, res => {
    if (!res) {
      output.textContent = "Scrape failed. Refresh page.";
      return;
    }
    output.textContent = JSON.stringify(res, null, 2);
  });
});
