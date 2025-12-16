
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz7XvykzW1blBJcR2APRdKgbFAXZ5V0zYvQMfY77TZMUbeeYPZDW-Pl76FS5JjNv4eqcA/exec";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== "SAVE_TO_SHEET") return;

  const {
    itemId,
    url,
    title,
    price,
    images,
    category,       // ✅ MUST EXIST
    itemSpecifics
  } = request.payload;

  fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      itemId,
      url,
      title,
      price,
      images,
      category,       // ✅ MUST BE SENT
      itemSpecifics
    })
  }).catch(err => {
    console.error("Sheet save failed", err);
  });
});

