async function initVaultAssets(){
// 2) set up ethers provider & signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();

  // 3) compute net ETH deposited via mint/burn events
  //const { totalMintedWei, totalBurnedWei } = await vaultContractUtils.sumMintBurn(VAULT_ADDRESS, provider);
  //const ethDepositedWei = totalMintedWei.sub(totalBurnedWei);
  //const ethDeposited    = parseFloat(ethers.utils.formatEther(ethDepositedWei));

  const allVaultAddresses = [
    "0xa82832a77C06e148560470d6c2efBAb0B3B332Bb",
    "0x2E22a92eF5562688B97df46d8AAa01Ad86597F66"
    ];
  let totalMintedWei = ethers.BigNumber.from(0);
  let totalBurnedWei = ethers.BigNumber.from(0);

  for (const vaultAddr of allVaultAddresses) {
    const { totalMintedWei: m, totalBurnedWei: b } = await vaultContractUtils.sumMintBurn(vaultAddr, provider);
    totalMintedWei = totalMintedWei.add(m);
    totalBurnedWei = totalBurnedWei.add(b);
  }
  const ethDeposited = parseFloat(ethers.utils.formatEther(totalMintedWei.sub(totalBurnedWei)));

  // 4) fetch skins‐value and NAV (vaultValuation)
  const vaultData = await vaultContractUtils.getVaultData(VAULT_ADDRESS, signer);
  const skinsOwned = parseFloat(ethers.utils.formatEther(vaultData.skinsValueWei));
  const nav        = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));
  const ethHeld    = parseFloat(ethers.utils.formatEther(vaultData.ethBalanceWei));
  const btcHeld    = parseFloat(ethers.utils.formatEther(vaultData.btcReserveWei));
  const vaultVal   = parseFloat(ethers.utils.formatEther(vaultData.vaultValuationWei));

  // 5) compute vault growth % = NAV / ETH‐in * 100
  const vaultGrowth = ethDeposited > 0
  ? ((nav - ethDeposited) / ethDeposited) * 100
  : 0;
  console.log(nav);
  console.log(ethDeposited);

    // 6) write values into your banner cards
  document.getElementById('ethDepositedValue').textContent  =
    `${trimDecimals(ethDeposited, 6)} ETH`;
  document.getElementById('ethHeldValue').textContent       =
    `${trimDecimals(ethHeld,      6)} ETH`;
  document.getElementById('skinsOwnedValue').textContent    =
    `${trimDecimals(skinsOwned,   6)} ETH`;
  document.getElementById('btcHeldValue').textContent       =
    `${trimDecimals(btcHeld,      6)} BTC`;
  document.getElementById('VaultValue').textContent         =
    `${trimDecimals(vaultVal,     6)} ETH`;
  document.getElementById('vaultGrowthValue').textContent   =
    `${trimDecimals(vaultGrowth,  2)} %`;
}

function trimDecimals(num, maxDecimals) {
  return num
    .toFixed(maxDecimals)      // e.g. "1.230000"
    .replace(/\.?0+$/, '');    // => "1.23"  or "1" if it was "1.000000"
}