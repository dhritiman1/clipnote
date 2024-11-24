chrome.storage.local.get("selectedTexts", (data) => {
  const textContainer = document.getElementsByClassName("selected-texts")[0];
  if (data.selectedTexts && data.selectedTexts.length > 0) {
    textContainer.innerHTML = "";
    data.selectedTexts.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      textContainer.appendChild(p);
    });
  } else {
    textContainer.textContent = "nothing marked yet!";
  }
});
