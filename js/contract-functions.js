// contract-functions.js
;(function(window){
  const { ethers, CONTRACTS } = window;

  // Factory helpers: don't need to define ABIs here, just import them from window.CONTRACTS
  function createVaultContract(address, signerOrProvider) {
    return new ethers.Contract(address, CONTRACTS.VAULT_ABI, signerOrProvider);
  }
  function createErc20Contract(address, signerOrProvider) {
    return new ethers.Contract(address, CONTRACTS.ERC20_ABI, signerOrProvider);
  }

  // --- sum all Minted / Burned events to get total ETH in/out ---
  async function sumMintBurn(vaultAddress, provider) {
    const iface = new ethers.utils.Interface([
      'event Minted(address indexed user, uint256 ethIn, uint256 tokensToUser)',
      'event Burned(address indexed user, uint256 tokensBurned, uint256 ethOut)'
    ]);
    const mintTopic = iface.getEventTopic('Minted');
    const burnTopic = iface.getEventTopic('Burned');

    const [mintLogs, burnLogs] = await Promise.all([
      provider.getLogs({ address: vaultAddress, fromBlock: 0, toBlock: 'latest', topics: [mintTopic] }),
      provider.getLogs({ address: vaultAddress, fromBlock: 0, toBlock: 'latest', topics: [burnTopic] })
    ]);

    const ZERO = ethers.BigNumber.from(0);
    const totalMintedWei = mintLogs.reduce((sum, log) => {
      const { args } = iface.parseLog(log);
      return sum.add(args.ethIn);
    }, ZERO);
    const totalBurnedWei = burnLogs.reduce((sum, log) => {
      const { args } = iface.parseLog(log);
      return sum.add(args.ethOut);
    }, ZERO);

    return { totalMintedWei, totalBurnedWei };
  }

  // --- Get all Vault view data in one go ---
  async function getVaultData(vaultAddress, providerOrSigner) {
    const vault = createVaultContract(vaultAddress, providerOrSigner);
    const [
      owner,
      vaultManager,
      ethBalanceWei,
      vaultValuationWei,
      navPerTokenWei,
      skinsValueWei,
      btcReserveWei,
      ethDepositedWei
    ] = await Promise.all([
      vault.owner(),
      vault.vaultManager(),
      vault.getBalETH(),
      vault.getNAV(),
      vault.getNavPerToken(),
      vault.skinsVal(),
      vault.btcVal(),
      vault.ethDeposited()
    ]);
    return {
      owner,
      vaultManager,
      ethBalanceWei,
      vaultValuationWei,
      navPerTokenWei,
      skinsValueWei,
      btcReserveWei,
      ethDepositedWei
    };
  }

  // --- Get SKINDEX token stats
  async function getSkindexData(tokenAddress, account, providerOrSigner) {
    const token = createErc20Contract(tokenAddress, providerOrSigner);
    const [ totalSupply, balance ] = await Promise.all([
      token.totalSupply(),
      token.balanceOf(account)
    ]);
    return { totalSupply, balance };
  }

  window.vaultContractUtils = {
    sumMintBurn,
    getVaultData,
    getSkindexData
  };
})(window);
