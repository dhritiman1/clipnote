chrome.storage.local.get("savedTexts", (data) => {
  const textContainer = document.getElementsByClassName("selected-texts")[0];
  if (data.savedTexts && data.savedTexts.length > 0) {
    textContainer.innerHTML = "";
    data.savedTexts.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      textContainer.appendChild(p);
    });
  } else {
    textContainer.textContent = "nothing marked yet!";
  }
});
