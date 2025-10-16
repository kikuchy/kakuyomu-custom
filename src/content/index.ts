import browser from "webextension-polyfill";

function isTargetEpisodePage(): boolean {
  return /^\/works\/[^/]+\/episodes\/[^/]+/.test(location.pathname);
}

function insertSystemColorSchemeOption(): void {
  const modalContainer = document.querySelector("#displaySetting-modalContainer");
  if (!modalContainer) return;

  const list = modalContainer.querySelector("#displaySetting section:nth-child(2) ul");
  if (!list) return;

  if (
    modalContainer.querySelector(
      ".widget-displaySetting-bgColor-system, #input-displaySetting-bgColor-system",
    )
  ) {
    return; // 既に追加済み
  }

  const li = document.createElement("li");
  li.className = "widget-displaySetting-bgColor-system";
  li.innerHTML =
    '<input id="input-displaySetting-bgColor-system" type="radio" name="color_theme" value="system"><label for="input-displaySetting-bgColor-system">システム</label>';
  list.appendChild(li);
}

function enhanceKakuyomu(): void {
  if (!isTargetEpisodePage()) return;
  insertSystemColorSchemeOption();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceKakuyomu);
} else {
  enhanceKakuyomu();
}

// iOS Safari向けに、Safari Web Extensions移植時でも動作するpolyfill想定
void browser.storage.local.get(null);
