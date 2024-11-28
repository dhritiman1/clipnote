document.addEventListener("DOMContentLoaded", () => {
  const dlBtn = document.getElementById("dl-btn");
  function updateSidebar(taburl) {
    chrome.storage.local.get("savedTexts", (data, index) => {
      const savedTexts = data.savedTexts || {};
      const texts = savedTexts[taburl] || [];

      const textContainer =
        document.getElementsByClassName("selected-texts")[0];

      if (texts.length > 0) {
        textContainer.innerHTML = "";
        texts.forEach((text) => {
          const div = document.createElement("div");
          div.className = "text-container";
          const p = document.createElement("p");
          p.className = "para";
          const btn = document.createElement("div");
          btn.className = "delete-btn";

          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            `;

          btn.addEventListener("click", () => {
            deleteText(index, taburl);
          });
          p.textContent = text;

          div.appendChild(p);
          div.appendChild(btn);

          textContainer.appendChild(div);
        });
      } else {
        textContainer.textContent = "nothing saved yet!";
      }
    });
  }

  function downloadMD(url) {
    chrome.storage.local.get("savedTexts", (data) => {
      const savedTexts = data.savedTexts || {};
      const texts = savedTexts[url] || [];

      if (texts.length === 0) {
        return;
      }

      let markdown = ``;
      texts.forEach((text) => {
        markdown += `- ${text}\n`;
      });

      markdown += `\n > [ref](${url})\n`;

      const blob = new Blob([markdown], { text: "text/markdown" });
      const blobUrl = URL.createObjectURL(blob);

      const dl = document.createElement("a");
      dl.href = blobUrl;
      dl.download = `${new Date()}.md`;
      document.body.appendChild(dl);
      dl.click();

      document.body.removeChild(dl);
      URL.revokeObjectURL(blobUrl);
    });
  }

  dlBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabURL = new URL(tabs[0].url);
      downloadMD(tabURL);
    });
  });

  function deleteText(index, url) {
    chrome.storage.local.get("savedTexts", (data) => {
      const savedTexts = data.savedTexts;
      const texts = savedTexts[url];

      texts.splice(index, 1);
      if (texts.length === 0) {
        delete savedTexts[url];
      } else {
        savedTexts[url] = texts;
      }

      chrome.storage.local.set({ savedTexts }, () => {
        updateSidebar(url);
      });
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length == 0) return;

    const taburl = new URL(tabs[0].url);

    updateSidebar(taburl);

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.savedTexts) {
        updateSidebar(taburl);
      }
    });
  });
});
