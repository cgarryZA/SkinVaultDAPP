async function initHomePage() {
  // 1) inject all HTML + CSS components
  await includeComponent('footer-placeholder',         '/html-components/footer.html',         'css/footer.css');

  initVaultAssets();
}