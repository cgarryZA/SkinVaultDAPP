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

window.addEventListener('DOMContentLoaded', async () => {
  // Only show if NOT already connected
  let accounts = [];
  if (window.ethereum) {
    accounts = await window.ethereum.request({ method: 'eth_accounts' });
  }
  if (!accounts.length) {
    document.getElementById('metamaskModal').style.display = 'flex';
  }

  document.getElementById('connectMetamaskBtn').onclick = async () => {
    if (!window.ethereum) {
      document.getElementById('metamaskError').textContent = 'MetaMask is not installed.';
      document.getElementById('metamaskError').style.display = 'block';
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      document.getElementById('metamaskModal').style.display = 'none';
      // Optionally, reload page or run your app init logic here
      window.location.reload();
    } catch (err) {
      document.getElementById('metamaskError').textContent = err.message;
      document.getElementById('metamaskError').style.display = 'block';
    }
  };
});

function showToast(message, timeout=4000) {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toastMessage');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, timeout);
}

function parseEthersError(err) {
  if (!err) return "Unknown error occurred";

  let msg = (
    (err.data && err.data.message) ||
    (err.error && err.error.message) ||
    err.message ||
    String(err)
  );

  // Remove "execution reverted:" and any trailing info
  msg = msg.replace(/^execution reverted:? ?/, '');

  // Clean up common errors
  if (msg.includes("user rejected transaction")) return "You cancelled the transaction.";
  if (msg.includes("insufficient funds")) return "Insufficient funds to complete the transaction.";
  if (msg.includes("Not authorized")) return "You are not authorized for this action.";
  if (msg.includes("denied transaction signature")) return "You denied the transaction signature.";
  if (msg.includes("replacement fee too low")) return "Replacement transaction fee too low. Please increase gas.";
  if (msg.includes("Invalid address")) return "Invalid address provided.";
  if (msg.includes("nonce too low")) return "Nonce too low, try resending the transaction.";

  // Shorten long technical output
  if (msg.length > 120) msg = msg.slice(0, 110) + "…";

  return msg;
}

function showSuccessToast(message, timeout = 4000) {
  const toast = document.getElementById('toastSuccess');
  const msg   = document.getElementById('toastSuccessMessage');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, timeout);
}