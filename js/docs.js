async function initDocs() {
  // 1) inject all HTML + CSS components
  //await includeComponent('vault-assets-placeholder',   '/html-components/vault-assets.html',   'css/vault-card.css');
  await includeComponent(
    "header-placeholder",
    "/html-components/header.html",
    "css/header.css"
  );
  await includeComponent(
    "footer-placeholder",
    "/html-components/footer.html",
    "css/footer.css"
  );
}
