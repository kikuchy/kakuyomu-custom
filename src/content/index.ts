import browser from "webextension-polyfill";

function isTargetEpisodePage(): boolean {
  return /^\/works\/[^/]+\/episodes\/[^/]+/.test(location.pathname);
}

const STORAGE_KEY_BG_COLOR = "bgColorSelection";
let removeSystemListener: (() => void) | null = null;

function removeExistingColorThemeClasses(target: HTMLElement): void {
  const toRemove: string[] = [];
  target.classList.forEach((cls) => {
    if (cls.startsWith("colorTheme-")) toRemove.push(cls);
  });
  toRemove.forEach((cls) => target.classList.remove(cls));
}

function applySystemTheme(): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const body = document.body;
  removeExistingColorThemeClasses(body);
  body.classList.add(prefersDark ? "colorTheme-black" : "colorTheme-white");
}

function startSystemThemeSync(): void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => applySystemTheme();
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", listener);
    removeSystemListener = () => mql.removeEventListener("change", listener);
  } else {
    mql.addListener(listener);
    removeSystemListener = () => mql.removeListener(listener);
  }
}

function stopSystemThemeSync(): void {
  if (removeSystemListener) {
    removeSystemListener();
    removeSystemListener = null;
  }
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

  const systemInput = li.querySelector<HTMLInputElement>("#input-displaySetting-bgColor-system");
  systemInput?.addEventListener("change", async () => {
    if (!systemInput.checked) return;
    await browser.storage.local.set({ [STORAGE_KEY_BG_COLOR]: "system" });
    applySystemTheme();
    startSystemThemeSync();
    li.classList.add("isActive");
    li.parentElement?.querySelectorAll(":scope > li").forEach((sibling) => {
      if (sibling !== li) sibling.classList.remove("isActive");
    });
  });

  const otherRadios = list.querySelectorAll<HTMLInputElement>('li input[type="radio"][name="color_theme"]');
  otherRadios.forEach((input) => {
    if (input.value === "system") return;
    input.addEventListener("change", async () => {
      if (!input.checked) return;
      await browser.storage.local.remove(STORAGE_KEY_BG_COLOR);
      stopSystemThemeSync();
    });
  });
}

function enhanceKakuyomu(): void {
  if (!isTargetEpisodePage()) return;
  insertSystemColorSchemeOption();

  browser.storage.local.get(STORAGE_KEY_BG_COLOR).then((stored) => {
    if (stored?.[STORAGE_KEY_BG_COLOR] !== "system") return;

    const modalContainer = document.querySelector("#displaySetting-modalContainer");
    const list = modalContainer?.querySelector("#displaySetting section:nth-child(2) ul");
    const li = list?.querySelector<HTMLLIElement>("li.widget-displaySetting-bgColor-system");
    const systemInput = li?.querySelector<HTMLInputElement>("#input-displaySetting-bgColor-system");

    if (systemInput && li) {
      systemInput.checked = true;
      li.classList.add("isActive");
      li.parentElement?.querySelectorAll(":scope > li").forEach((sibling) => {
        if (sibling !== li) sibling.classList.remove("isActive");
      });
    }

    applySystemTheme();
    startSystemThemeSync();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceKakuyomu);
} else {
  enhanceKakuyomu();
}

// iOS Safari向けに、Safari Web Extensions移植時でも動作するpolyfill想定
void browser.storage.local.get(null);
