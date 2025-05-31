const STEAM_BOT_ID = '76561199861217732';     // ← your bot’s SteamID64
const STEAM_APP_ID = 730;                     // CS:GO
const STEAM_CONTEXT_ID = 2;                   // CS:GO community context

async function includeComponent(htmlId, htmlUrl, cssUrl) {
  // 1) inject the component CSS into <head>
  if (cssUrl) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
  }
  // 2) fetch & inject the HTML
  const placeholder = document.getElementById(htmlId);
  const rsp = await fetch(htmlUrl);
  placeholder.innerHTML = await rsp.text();
}