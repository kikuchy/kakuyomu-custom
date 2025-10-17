import browser from "webextension-polyfill";

import "./style.css";

const VERTICAL_WRAPPER_CLASS = "kakuyomu-extension-vertical-wrapper";
const VERTICAL_BODY_CLASS = "kakuyomu-extension-vertical-body";

function isTargetEpisodePage(): boolean {
  return /^\/works\/[^/]+\/episodes\/[^/]+/.test(location.pathname);
}

const STORAGE_KEY_BG_COLOR = "bgColorSelection";
const STORAGE_KEY_VERTICAL_READING = "verticalReadingEnabled";
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

  const otherRadios = list.querySelectorAll<HTMLInputElement>(
    'li input[type="radio"][name="color_theme"]',
  );
  otherRadios.forEach((input) => {
    if (input.value === "system") return;
    input.addEventListener("change", async () => {
      if (!input.checked) return;
      await browser.storage.local.remove(STORAGE_KEY_BG_COLOR);
      stopSystemThemeSync();
    });
  });
}

function setVerticalReadingMode(enabled: boolean): void {
  const wrapper = document.querySelector<HTMLElement>("#contentMain .widget-episode-inner");
  if (wrapper) wrapper.classList.toggle(VERTICAL_WRAPPER_CLASS, enabled);

  const body = document.querySelector<HTMLElement>(
    "#contentMain .widget-episode-inner .widget-episodeBody",
  );
  if (body) body.classList.toggle(VERTICAL_BODY_CLASS, enabled);
}

function insertVerticalReadingSetting(initiallyVertical: boolean): void {
  const displaySetting = document.querySelector("#displaySetting");
  if (!displaySetting) return;

  if (displaySetting.querySelector(".kakuyomu-extension-writing-mode")) return;

  const section = document.createElement("section");
  section.className = "kakuyomu-extension-writing-mode";

  const list = document.createElement("ul");
  const options: Array<{
    value: "horizontal" | "vertical";
    label: string;
  }> = [
    { value: "horizontal", label: "横書き" },
    { value: "vertical", label: "縦書き" },
  ];

  options.forEach((option) => {
    const li = document.createElement("li");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "kakuyomu-extension-writing-mode";
    input.value = option.value;

    const isVerticalOption = option.value === "vertical";
    const isSelected = initiallyVertical === isVerticalOption;
    input.checked = isSelected;
    if (isSelected) li.classList.add("isActive");

    input.addEventListener("change", async () => {
      if (!input.checked) return;

      const enableVertical = option.value === "vertical";
      setVerticalReadingMode(enableVertical);

      await browser.storage.local.set({
        [STORAGE_KEY_VERTICAL_READING]: enableVertical,
      });

      list.querySelectorAll("li").forEach((item) => item.classList.remove("isActive"));
      li.classList.add("isActive");
    });

    li.appendChild(input);
    li.append(document.createTextNode(option.label));
    list.appendChild(li);
  });

  section.appendChild(list);
  displaySetting.appendChild(section);
}

function enhanceKakuyomu(): void {
  if (!isTargetEpisodePage()) return;
  insertSystemColorSchemeOption();

  browser.storage.local
    .get({
      [STORAGE_KEY_BG_COLOR]: undefined,
      [STORAGE_KEY_VERTICAL_READING]: false,
    })
    .then((stored) => {
      const verticalEnabled = stored?.[STORAGE_KEY_VERTICAL_READING] === true;
      setVerticalReadingMode(verticalEnabled);
      insertVerticalReadingSetting(verticalEnabled);

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
