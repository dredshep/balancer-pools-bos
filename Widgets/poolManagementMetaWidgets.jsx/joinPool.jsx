// @ts-check

// @ts-ignore
const fetchBody = (url) => fetch(url).body;
const vaultAbi = fetchBody(
  "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/19f0870f18af90930f172cb18ed1572343736993/balancerVaultABI.json"
);
const sepoliaVaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

/**
 * @typedef {Object} JoinPoolArgs
 * @property {string} poolId - The ID of the pool to join.
 * @property {string} sender - The address of the sender.
 * @property {string} recipient - The address of the recipient.
 * @property {string[]} sortedTokenAddresses - An array of sorted token addresses.
 * @property {string[]} maxAmountsIn - An array of maximum amounts to send in for each token.
 * @property {string} userData - The user data.
 * @property {boolean} fromInternalBalance - Whether the tokens are already in the vault.
 */

/** @type {JoinPoolArgs} */
const args = {
  poolId: "0x1002b479766d0f7977ab06473e03f0cd5ee3c54b000200000000000000000014",
  sender: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  recipient: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  sortedTokenAddresses: [
    "0x88267177EC1420648Ba7CBFef824f14B9F637985",
    "0x6A1Ab80d1B161844948CC75C965C0D0242dbc630",
  ].sort(),
  //              1e18
  // maxAmountsIn: ["1", "1"].map((x) => ethers.utils.parseEther(x)),
  maxAmountsIn: ["10000000000000000000000000", "10000000000000000000000000"],
  // userdata is joinkind, amountsIn (same as max) and minimumBPT (0). joinkind is second in the list (init, exact_tokens_join, token_in_for_exact_bpt_out, all_tokens_in_for_exact_bpt_out)
  userData: ethers.utils.defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    [1, ["10000000000000000000000000", "10000000000000000000000000"], 0]
  ),
  // fromInternalBalance means that the tokens are already in the vault, which they are not
  fromInternalBalance: false,
};
// javascript example
function joinPool(
  /** @type {string} */ poolId,
  /** @type {string} */ sender,
  /** @type {string} */ recipient,
  /** @type {string[]} */ sortedTokenAddresses,
  /** @type {string[]} */ maxAmountsIn, // this is the max amount of each token you want to send in, we can use the inputted amount for this
  /** @type {string} */ userData,
  /** @type {boolean} */ fromInternalBalance
) {
  const types = [
    "bytes32",
    "address",
    "address",
    "address[]",
    "uint256[]",
    "bytes",
    "bool",
  ];
  const data = [
    poolId,
    sender,
    recipient,
    sortedTokenAddresses,
    maxAmountsIn,
    userData,
    fromInternalBalance,
  ];
  const userDataEncoded = ethers.utils.defaultAbiCoder.encode(types, data);
  // execute the transaction
  const vault = new ethers.Contract(
    sepoliaVaultAddress,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  // vault takes 4 args: poolId, sender, recipient, JoinPoolRequest
  // joinPoolRequest is an array with 4 args: assets, maxAmountsIn, userData, fromInternalBalance
  const txPromise = vault.joinPool(
    poolId,
    sender,
    recipient,
    [sortedTokenAddresses, maxAmountsIn, userDataEncoded, fromInternalBalance],
    { gasLimit: 1000000 }
  );
  txPromise
    ?.then?.((tx) => {
      console.log("joinPool() transaction emitted TX.then: tx:", tx);
      tx?.wait?.()
        ?.then?.((receipt) => {
          console.log(
            "joinPool() transaction mined TX.wait.then: receipt:",
            receipt
          );
        })
        ?.catch?.((e) => {
          console.log("joinPool() transaction mined TX.wait.catch: e:", e);
        });
    })
    ?.catch?.((e) => {
      console.log("joinPool() inner error on TX.catch: e:", e);
    });
}

const joinPromise = joinPool(
  args.poolId,
  args.sender,
  args.recipient,
  args.sortedTokenAddresses,
  args.maxAmountsIn,
  args.userData,
  args.fromInternalBalance
);

function ReturnComponent() {
  return (
    <div>
      <h1>Data being used:</h1>
      <p>poolId: {JSON.stringify(args.poolId, null, 2)}</p>
      <p>sender: {JSON.stringify(args.sender, null, 2)}</p>
      <p>recipient: {JSON.stringify(args.recipient, null, 2)}</p>
      <p>
        sortedTokenAddresses:{" "}
        {JSON.stringify(args.sortedTokenAddresses, null, 2)}
      </p>
      <p>maxAmountsIn: {JSON.stringify(args.maxAmountsIn, null, 2)}</p>
      <p>userData: {JSON.stringify(args.userData, null, 2)}</p>
      <p>
        fromInternalBalance: {JSON.stringify(args.fromInternalBalance, null, 2)}
      </p>
      <h1>Result will be in console :)</h1>
    </div>
  );
}

// @ts-ignore
return <ReturnComponent />;
