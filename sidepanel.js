document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length == 0) return;

    const taburl = new URL(tabs[0].url);

    chrome.storage.local.get("savedTexts", (data) => {
      const savedTexts = data.savedTexts || {};
      const texts = savedTexts[taburl] || [];

      const textContainer =
        document.getElementsByClassName("selected-texts")[0];

      if (texts.length > 0) {
        textContainer.innerHTML = "";
        texts.forEach((text) => {
          const p = document.createElement("p");
          p.textContent = text;
          textContainer.appendChild(p);
        });
      } else {
        textContainer.textContent = "nothing saved yet!";
      }
    });
  });
});
