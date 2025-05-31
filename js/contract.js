// common.js (updated to match SkinVault.sol)
const VAULT_ADDRESS   = '0xFEd23180494cADe2231f0470a2450BC9Ac7F25e9';
const SKINDEX_ADDRESS = '0x2E22a92eF5562688B97df46d8AAa01Ad86597F66';

// SkinVault ABI - names/signatures updated to match Solidity implementation
const VAULT_ABI = [
  'function owner() view returns (address)',
  'function vaultManager() view returns (address)',
  'function getBalETH() view returns (uint256)',
  'function getNAV() view returns (uint256)',
  'function getNavPerToken() view returns (uint256)',
  'function skinsVal() view returns (uint256)',
  'function btcVal() view returns (uint256)',
  'function recieveEth() payable',
  'function mint() payable',
  'function burn(uint256)',
  'function pause()',
  'function unpause()',
  'function setVaultManager(address)',
  'function setDeveloper(address)',
  'function setValSkins(uint256)',
  'function setValBtc(uint256)',
  'function setMintFeeBP(uint256)',
  'function setBurnFeeBP(uint256)',
  'function setDevFeeBP(uint256)',
  'function setSkinPoolBP(uint256)',
  'function setBtcPoolBP(uint256)',
  'function setPools(uint256,uint256)',
  'function sendEthToWallet(uint256)',
  'function EthToBtc(uint256)',
  'function BtcToEth(uint256)',
  'function EthToSkins(uint256)',
  'function SkinsToEth(uint256)',
  'function devFeeBP()             view returns (uint256)', 
  'function mintFeeBP()            view returns (uint256)',
  'function burnFeeBP()            view returns (uint256)'
];

// ERC20 ABI for SKINDEX token
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)'
];

let provider, signer, user, vault, skindex;

// Connect to MetaMask and instantiate contracts
async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask not detected');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer   = provider.getSigner();
  user     = await signer.getAddress();
  vault    = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
  skindex  = new ethers.Contract(SKINDEX_ADDRESS, ERC20_ABI, provider);
  const acctEl = document.getElementById('account');
  if (acctEl) acctEl.textContent = `Connected: ${user}`;
}

// Generic action helper for write calls
async function action(fn, ...args) {
  const tx = await vault[fn](...args);
  await tx.wait();
  return tx;
}

window.connectWallet = connectWallet;
window.action        = action;
window.vault         = () => vault;
window.skindex       = () => skindex;
window.userAddress  = () => user;
