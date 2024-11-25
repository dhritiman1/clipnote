chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.commands.onCommand.addListener((command) => {
  if (command === "saveText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tab = tabs[0];
      const domain = new URL(tab.url);

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: getSelectedText,
        },

        (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }

          const selectedText = results[0]?.result;
          if (selectedText) {
            chrome.storage.local.get("savedTexts", (data) => {
              const savedTexts = data.savedTexts || {};
              if (!savedTexts[domain]) savedTexts[domain] = [];
              savedTexts[domain].push(selectedText);

              chrome.storage.local.set({ savedTexts });
            });
          } else {
            console.log("no text selected");
          }
        }
      );
    });
  } else if (command === "openSidebar") {
    chrome.sidePanel.setOptions({
      path: "sidepanel.html",
      enabled: true,
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString().trim();
}
