const output = document.getElementById("output");

document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || !tab.url.includes("ebay.com")) {
    output.textContent = "Open an eBay product page";
    return;
  }

  try {
    // Inject content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    // Ask content script to scrape
    chrome.tabs.sendMessage(
      tab.id,
      { action: "SCRAPE_PRODUCT_FULL" },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          output.textContent = "Failed to scrape. Refresh page and try again.";
          return;
        }

        output.textContent = JSON.stringify(response, null, 2);
      }
    );
  } catch (err) {
    output.textContent = "Injection error.";
  }
});
