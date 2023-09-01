import React from 'react';

const MetaMaskLogout = () => {

  const disconnectMetaMask = () => {
    if (window.ethereum) {
      window.ethereum.request({ 
        method: 'wallet_requestPermissions', 
        params: [{ eth_accounts: {} }] 
      })
      .then((permissions) => {
        const accountsPermission = permissions.find(
          (permission) => permission.parentCapability === 'eth_accounts'
        );
        if (accountsPermission) {
          window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }],
          })
          .then(() => {
            console.log('Permissions were revoked');
            // Clear local application state here
            localStorage.clear();
          })
          .catch((error) => {
            console.error(error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  const promptManualLogout = () => {
    alert('Please open the MetaMask extension and log out manually.');
  };

  return (
    <div>
      <button onClick={disconnectMetaMask}>Disconnect MetaMask</button>
    </div>
  );
};

export default MetaMaskLogout;
