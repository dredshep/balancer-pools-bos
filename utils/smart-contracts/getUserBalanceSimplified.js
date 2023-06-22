//@ts-check

State.init({ balance: null, errorGettingBalance: null, isConnected: false });
const userAddress = Ethers.send("eth_requestAccounts", [])[0];

// @ts-ignore
if (!userAddress) return <Web3Connect connectLabel="Connect with Web3" />;
State.update({ isConnected: true });
/** @type {any[]} */
const erc20ABI =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 */
function getUserBalance(poolAddress, userAddress) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      isConnected: false,
      errorGettingBalance: "No signer, user disconnected",
    });
    return;
  }
  try {
    const erc20 = new ethers.Contract(
      poolAddress, // address
      erc20ABI, // erc20 abi
      Ethers.provider().getSigner()
    );
    const balance = erc20
      .balanceOf(userAddress)
      .then((balance) => {
        // undo big number into a string
        return ethers.utils.formatUnits(balance, 18);
      })
      .catch((e) => {
        throw e;
      });
    return balance;
  } catch (e) {
    // return dummy balance 666s
    return `Error in getUserBalance(). params:
- poolAddress: ${poolAddress}
- userAddress: ${userAddress}
- error: ${e}`;
  }
}

try {
  try {
    // this errors out and reverts tx if wrong chain cuz wrong params, prolly nonexistent pool error
    // error looks like this: Uncaught (in promise) Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x450e501C21dF2E72B4aE98343746b0654430dC16","to":"0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9","data":"0x70a08231000000000000000000000000e25c0e141b98a5a449fbd70cfda45f6088486c74","accessList":null}, error={"code":-32000,"message":"execution reverted"}, code=CALL_EXCEPTION, version=providers/5.7.2)
    getUserBalance(
      "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a9",
      "0x512fce9b07ce64590849115ee6b32fd40ec0f5f3"
    )
      .then((bal) => {
        State.update({ balance: JSON.stringify(bal) });
      })
      .catch((e) => {
        State.update({ errorGettingBalance: JSON.stringify(e) });
      });
  } catch (e) {
    // @ts-ignore
    return <pre>error while trying to get user balance w function calls</pre>;
  }

  if (!state.errorGettingBalance) {
    //@ts-ignore
    return (
      <>
        <pre>User Balance: {state.balance}</pre>
      </>
    );
  } else {
    //@ts-ignore
    return (
      <>
        <h1>Error while trying to fetch balance</h1>
        <pre>{state.errorGettingBalance}</pre>
      </>
    );
  }
} catch (e) {
  // @ts-ignore
  return (
    <>
      <h1>Error while trying to fetch balance</h1>
      <pre>{JSON.stringify(e, null, 2)}</pre>
    </>
  );
}
