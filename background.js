const SHEET_URL = "https://script.google.com/macros/s/AKfycbzXhxKKDlHEQ9LIDmqKkE7s6a9qvPKUovIIVb7kJGVtdFukW2KDw01n97gUxZT6aKua/exec";

chrome.runtime.onMessage.addListener((request) => {
  if (request.action !== "SAVE_TO_SHEET") return;

  fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request.payload)
  }).catch(err => console.error("Sheet save failed", err));
});
