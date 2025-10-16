import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  // 初回インストール時の初期化処理
  console.log("Kakuyomu Custom installed");
});

browser.runtime.onMessage.addListener((message: unknown) => {
  const maybe =
    typeof message === "object" && message !== null
      ? (message as { type?: string })
      : {};
  if (maybe.type === "PING") {
    return Promise.resolve({ ok: true });
  }
});
