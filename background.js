chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.commands.onCommand.addListener((command) => {
  if (command === "saveText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: getSelectedText,
        },

        (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }

          const selectedText = results[0]?.result;
          if (selectedText) {
            console.log("selected text:", selectedText);
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
    console.log("sidebar opened");
  }
});

function getSelectedText() {
  return window.getSelection().toString().trim();
}
