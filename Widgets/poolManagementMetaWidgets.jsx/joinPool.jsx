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

/**@param {JoinPoolArgs} props */
function joinPool(props) {
  // prettier-ignore
  const types = ["bytes32", "address", "address", "address[]", "uint256[]", "bytes", "bool"];

  const data = [...Object.values(props)];
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
    props.poolId,
    props.sender,
    props.recipient,
    [
      props.sortedTokenAddresses,
      props.maxAmountsIn,
      userDataEncoded,
      props.fromInternalBalance,
    ],
    { gasLimit: 6000000 }
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

const ONE = ethers.BigNumber.from(10).pow(18);
const ZERO = ethers.BigNumber.from(0);

const initJoinUserData = () =>
  ethers.utils.defaultAbiCoder.encode(
    ["uint256", "uint256[]"],
    [
      ZERO, // init
      [ONE, ONE], // exactTokensIn
    ]
  );

/** @type {JoinPoolArgs} */
const args = {
  poolId: "0x1002b479766d0f7977ab06473e03f0cd5ee3c54b000200000000000000000014",
  sender: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  recipient: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  sortedTokenAddresses: [
    "0x88267177EC1420648Ba7CBFef824f14B9F637985",
    "0x6A1Ab80d1B161844948CC75C965C0D0242dbc630",
  ].sort(),
  maxAmountsIn: [ONE, ONE],
  userData: initJoinUserData(),
  // fromInternalBalance means that the tokens are already in the vault, which they are not
  fromInternalBalance: false,
};

const joinPromise = joinPool(args);

// @ts-ignore
return <pre>{JSON.stringify(args, null, 2)}</pre>;
