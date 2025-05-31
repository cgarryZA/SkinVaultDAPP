async function initRoadmap() {
  // 1) inject all HTML + CSS components
  await includeComponent('header-placeholder',         '/html-components/header.html',         'css/header.css');

  await includeComponent('footer-placeholder',         '/html-components/footer.html',         'css/footer.css');

  initVaultAssets();
}