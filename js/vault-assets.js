async function initVaultAssetsWallet(){
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

async function initVaultAssets() {
  // 1) Set up Infura provider (read-only, no signer)
  const INFURA_URL = 'https://mainnet.infura.io/v3/5dba97c18dde4cc8b8a9bcf2c9b3c510'; // <-- edit this
  const provid = new ethers.providers.JsonRpcProvider(INFURA_URL);

  // 2) Define Vault contract address and ABI (read-only)
  const vaultData = await vaultContractUtils.getVaultData(window.VAULT_ADDRESS, provid);

  // 4) Format as ETH/BTC
  const skinsOwned = parseFloat(ethers.utils.formatEther(vaultData.skinsValueWei));
  const nav        = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));
  const ethHeld    = parseFloat(ethers.utils.formatEther(vaultData.ethBalanceWei));
  const btcHeld    = parseFloat(ethers.utils.formatEther(vaultData.btcReserveWei));
  const vaultVal   = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));
  const ethDeposited = parseFloat(ethers.utils.formatEther(vaultData.ethDepositedWei));

  // 5) Vault growth % calculation
  const vaultGrowth = ethDeposited > 0
    ? ((nav - ethDeposited) / ethDeposited) * 100
    : 0;

  // 6) Update DOM
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


async function startVaultAssets() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    // MetaMask is installed and connected to an account
    await initVaultAssetsWallet();
  } else {
    // Fallback to Infura (read-only)
    await initVaultAssets();
  }
}