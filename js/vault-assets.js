async function initVaultAssets(){
// 2) set up ethers provider & signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();

  // 3) fetch skins‐value and NAV (vaultValuation)
  const vaultData = await vaultContractUtils.getVaultData(VAULT_ADDRESS, signer);
  const skinsOwned = parseFloat(ethers.utils.formatEther(vaultData.skinsValueWei));
  const nav        = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));
  const ethHeld    = parseFloat(ethers.utils.formatEther(vaultData.ethBalanceWei));
  const btcHeld    = parseFloat(ethers.utils.formatEther(vaultData.btcReserveWei));
  const vaultVal   = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));
  const ethDeposited = parseFloat(ethers.utils.formatEther(vaultData.ethDepositedWei));

  // 5) compute vault growth % = NAV / ETH‐in * 100
  const vaultGrowth = ethDeposited > 0
  ? ((nav - ethDeposited) / ethDeposited) * 100
  : 0;

    // 6) write values into your banner cards
  document.getElementById('ethDepositedValue').textContent  =
    `${trimDecimals(ethDeposited, 4)} ETH`;
  document.getElementById('ethHeldValue').textContent       =
    `${trimDecimals(ethHeld,      4)} ETH`;
  document.getElementById('skinsOwnedValue').textContent    =
    `${trimDecimals(skinsOwned,   4)} ETH`;
  document.getElementById('btcHeldValue').textContent       =
    `${trimDecimals(btcHeld,      4)} BTC`;
  document.getElementById('VaultValue').textContent         =
    `${trimDecimals(vaultVal,     4)} ETH`;
  document.getElementById('vaultGrowthValue').textContent   =
    `${trimDecimals(vaultGrowth,  2)} %`;
}

function trimDecimals(num, maxDecimals) {
  return num
    .toFixed(maxDecimals)      // e.g. "1.230000"
    .replace(/\.?0+$/, '');    // => "1.23"  or "1" if it was "1.000000"
}