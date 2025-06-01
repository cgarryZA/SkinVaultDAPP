// contract.js (core config + contract objects)
const VAULT_ADDRESS   = '0xb730CFc309AD720E9184C9F8BDb0A10874587d1e';
const SKINDEX_ADDRESS = '0x2E22a92eF5562688B97df46d8AAa01Ad86597F66';

// SkinVault ABI - all view + mutator functions, no events
window.VAULT_ABI = [
  // --- Views
  'function owner() view returns (address)',
  'function vaultManager() view returns (address)',
  'function getBalETH() view returns (uint256)',
  'function getNAV() view returns (uint256)',
  'function getNavPerToken() view returns (uint256)',
  'function skinsVal() view returns (uint256)',
  'function btcVal() view returns (uint256)',
  'function ethDeposited() view returns (uint256)',
  // --- Mutators
  'function recieveEth() payable',
  'function mint() payable',
  'function mintTo(address,uint256)',
  'function burn(uint256)',
  'function pause()',
  'function unpause()',
  'function setVaultManager(address)',
  'function setDeveloper(address)',
  'function setValSkins(uint256)',
  'function setValBtc(uint256)',
  'function setValEthDeposited(uint256)',
  'function setPools(uint256,uint256)',
  'function setFees(uint256,uint256,uint256)',
  'function sendEthToWallet(uint256)',
  'function EthToBtc(uint256)',
  'function BtcToEth(uint256)',
  'function EthToSkins(uint256)',
  'function SkinsToEth(uint256)',
  'function devFeeBP() view returns (uint256)', 
  'function mintFeeBP() view returns (uint256)',
  'function burnFeeBP() view returns (uint256)',
  'function btcPoolBP() view returns (uint256)',
  'function skinPoolBP() view returns (uint256)',
  'function ethPoolBP() view returns (uint256)'
];

// ERC20 ABI for SKINDEX token
window.ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)'
];

let provider, signer, user, vault, skindex;

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

window.connectWallet = connectWallet;
// Utility for write actions
window.action = async function(fn, ...args) {
  const tx = await vault[fn](...args);
  await tx.wait();
  return tx;
};
window.vault    = () => vault;
window.skindex  = () => skindex;
window.userAddress = () => user;

// Expose ABIs & addresses for import elsewhere if needed
window.CONTRACTS = {
  VAULT_ADDRESS,
  SKINDEX_ADDRESS,
  VAULT_ABI,
  ERC20_ABI
};

// Attach to window for use in other modules:
window.VAULT_ADDRESS = VAULT_ADDRESS;
window.SKINDEX_ADDRESS = SKINDEX_ADDRESS;
