// @ts-check

// @ts-ignore
const fetchBody = (url) => fetch(url).body;
const vaultAbi = fetchBody(
  "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/21b0c88dd84ac06cc380472b88004ad43f8a688b/balancerVaultABI.json"
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
 * @property {boolean} fromInternalBalance - Whether we're dealing with internal tokens (ETH, MATIC, etc.)
 */

/**
 * Joins a Balancer pool using the provided arguments and the Balancer Vault contract.
 * @param {JoinPoolArgs} joinArgs - The arguments for joining the pool.
 * @returns {Promise<any>} - A promise that resolves to the transaction hash of the joinPool transaction.
 */
function joinPool(joinArgs) {
  const vault = new ethers.Contract(
    sepoliaVaultAddress,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  console.log("vault:", vault);
  return vault.joinPool(
    joinArgs.poolId,
    joinArgs.sender,
    joinArgs.recipient,
    [
      joinArgs.sortedTokenAddresses,
      joinArgs.maxAmountsIn,
      joinArgs.userData,
      joinArgs.fromInternalBalance,
    ],
    { gasLimit: 6000000 }
  );
}

/**
 * @typedef {Object} ExitPoolArgs
 * @property {string} poolId - The ID of the pool to exit.
 * @property {string} sender - The address of the sender.
 * @property {string} recipient - The address of the recipient.
 * @property {string[]} sortedTokenAddresses - An array of sorted token addresses.
 * @property {string[]} minAmountsOut - An array of minimum amounts to receive out for each token.
 * @property {string} userData - The user data.
 * @property {boolean} toInternalBalance - Whether we're dealing with internal tokens (ETH, MATIC, etc.)
 */

/**
 * Exits a Balancer pool using the provided arguments and the Balancer Vault contract.
 * @param {ExitPoolArgs} exitArgs - The arguments for exiting the pool.
 * @returns {Promise<any>} - A promise that resolves to the transaction hash of the exitPool transaction.
 */
function exitPool(exitArgs) {
  const vault = new ethers.Contract(
    sepoliaVaultAddress,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  return vault.exitPool(
    exitArgs.poolId,
    exitArgs.sender,
    exitArgs.recipient,
    [
      exitArgs.sortedTokenAddresses,
      exitArgs.minAmountsOut,
      exitArgs.userData,
      exitArgs.toInternalBalance,
    ],
    { gasLimit: 6000000 }
  );
}
/**
 * @param {{ exitArgs?: ExitPoolArgs, joinArgs?: JoinPoolArgs }} joinExitFunctionArgs */
function joinOrExitPool(joinExitFunctionArgs) {
  const { exitArgs, joinArgs } = joinExitFunctionArgs;
  let txPromise;
  if (exitArgs) {
    console.log("exitArgs:", exitArgs);
    txPromise = exitPool(exitArgs);
  } else if (joinArgs) {
    console.log("joinArgs:", joinArgs);
    txPromise = joinPool(joinArgs);
  } else {
    throw new Error("Must provide either exitArgs or joinArgs");
  }
  // vault takes 4 args: poolId, sender, recipient, JoinExitPoolRequest
  // joinPoolRequest is an array with 4 args: assets, maxAmountsIn, userData, fromInternalBalance
  // userData is a bytes array with 2 args: init, exactTokensIn
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

const ONEe18 = ethers.BigNumber.from(10).pow(18);
const ONE = ethers.BigNumber.from(1);
const ZERO = ethers.BigNumber.from(0);
const MAX = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
console.log("MAXi:", MAX);

/**
 * Encodes a value array into bytes according to the provided types using the defaultAbiCoder of ethers.
 * @param {string[]} types - An array of strings representing the types of the values to encode.
 * @param {any[]} values - An array of values to encode.
 * @returns {string} - The encoded values as a hexadecimal string.
 */
const encode = (types, values) =>
  ethers.utils.defaultAbiCoder.encode(types, values);

/** @type {JoinPoolArgs} */
const joinArgs = {
  poolId: "0x8D1ACC804CBCE52ADDB01F1076BB3723C516F27B000200000000000000000015",
  sender: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  recipient: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  sortedTokenAddresses: [
    "0x88267177EC1420648Ba7CBFef824f14B9F637985",
    "0x6A1Ab80d1B161844948CC75C965C0D0242dbc630",
  ].sort(),
  maxAmountsIn: [ethers.BigNumber.from(10).pow(5), ZERO],
  userData: encode(
    ["uint256", "uint256[]", "uint256"],
    // 0 is INIT (first ever join to a pool), 1 is EXACT_TOKENS_IN.
    [1, [ethers.BigNumber.from(10).pow(5), ZERO], ZERO]
  ),
  fromInternalBalance: false,
};

/**
 * Checks if the exit is for a single token.
 * @param {string[]} tokens - An array of token addresses.
 * @param {any[]} amounts - An array of token amounts.
 * @returns {boolean} - True if the exit is for a single token, false otherwise.
 */
const exitIsSingle = (tokens, amounts) =>
  tokens.length === 1 && amounts.length === 1;

/**
 * Gets the index of the single amount that is greater than 0.
 * @param {any[]} amounts - An array of token amounts.
 * @returns {number} - The index of the single token in the tokens array, or -1 if there is no single token.
 */
const singleExitIndex = (amounts) =>
  amounts.findIndex((amount) => amount.gt(0));

/*
before exit we call this

queryExit(
    bytes32 poolId,
    address sender,
    address recipient,
    ExitPoolRequest request)
returns (uint256 bptIn, uint256[] amountsOut)

on the BalancerQueries contract

*/

/** @typedef {{ bptIn: object, amountsOut: object[] }} QueryExitResult */
/**
 * Queries the BalancerQueries contract for the amount of pool tokens and token amounts that will be received upon exiting a pool.
 * @param {string} poolId - The ID of the pool to exit.
 * @param {string} sender - The address of the sender exiting the pool.
 * @param {string} recipient - The address of the recipient receiving the pool tokens and token amounts.
 * @param {ExitPoolArgs} rawRequest - The request object containing the minimum amounts of tokens to receive upon exiting the pool.
 * @returns {Promise<QueryExitResult>} - A promise that resolves to the amount of pool tokens and token amounts that will be received upon exiting the pool.
 */
function queryExit(poolId, sender, recipient, rawRequest) {
  const exitArgs = rawRequest;
  const request = [
    // exitArgs.poolId,
    // exitArgs.sender,
    // exitArgs.recipient,
    // [
    exitArgs.sortedTokenAddresses,
    exitArgs.minAmountsOut,
    exitArgs.userData,
    exitArgs.toInternalBalance,
    // ],
  ];

  const balancerQueriesContract = new ethers.Contract(
    "0x1802953277FD955f9a254B80Aa0582f193cF1d77", // BalancerQueries address on Sepolia
    fetchBody(
      "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/df57d6f23060805d02a533b0239d93d0ae807e97/balancerQueriesABI.json"
    ),
    Ethers.provider().getSigner()
  );
  const eth_calledPromise = balancerQueriesContract.provider.call({
    to: balancerQueriesContract.address,
    data: balancerQueriesContract.interface.encodeFunctionData("queryExit", [
      poolId,
      sender,
      recipient,
      request,
    ]),
  });
  /** @type {Promise<QueryExitResult>} */
  const queryResultPromise = eth_calledPromise.then(
    (/** @type {string} */ result) => {
      console.log("eth_calledPromise result:", result);
      /** @type {[object, object[]]} */
      const decoded = balancerQueriesContract.interface.decodeFunctionResult(
        "queryExit",
        result
      );
      console.log("eth_calledPromise decoded:", decoded);
      console.log("bptIn:", decoded[0]);
      // this is a bignumber, log it as a string
      console.log("bptInString:", decoded[0].toString());
      console.log("amountsOut:", decoded[1]); // arr of bignum
      console.log(
        "amountsOutString:",
        decoded[1]
          .map((/** @type {{ toString: () => string; }} */ x) => x.toString())
          .join(", ")
      ); // arr of strings
      // now that i think about it, let's return the processed amountsi in bignumber

      /**@type {{bptIn: object, amountsOut: object[]}} */
      const queryResult = {
        bptIn: decoded[0],
        amountsOut: decoded[1],
      };
      return queryResult;
    }
  );
  return queryResultPromise;
}

/** @type {ExitPoolArgs} */
const exitArgs = {
  poolId: "0x8D1ACC804CBCE52ADDB01F1076BB3723C516F27B000200000000000000000015",
  sender: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  recipient: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  sortedTokenAddresses: [
    "0x88267177EC1420648Ba7CBFef824f14B9F637985",
    "0x6A1Ab80d1B161844948CC75C965C0D0242dbc630",
  ].sort(),
  minAmountsOut: [ethers.BigNumber.from(5), ZERO],
  // https://docs.balancer.fi/reference/joins-and-exits/pool-exits.html#encoding
  // userdata is JoinKind (2), amountsOut (variable) and maxBPTAmountIn (MAX)
  // JoinKind: 2 = BPT_IN_FOR_EXACT_TOKENS_OUT, enter custom amount of USDC/USDT/etc. to receive a variable amount of BPT
  userData: encode(
    ["uint256", "uint256[]", "uint256"],
    [2, [ethers.BigNumber.from(5), ZERO], MAX]
  ),
  toInternalBalance: false,
};

queryExit(exitArgs.poolId, exitArgs.sender, exitArgs.recipient, exitArgs).then(
  (res) =>
    joinOrExitPool({
      exitArgs: {
        ...exitArgs,
        minAmountsOut: res.amountsOut,
        userData: encode(
          ["uint256", "uint256[]", "uint256"],
          [
            2,
            res.amountsOut,
            // multiply res.bptIn by 1.01 to account for slippage
            res.bptIn.mul(101).div(100),
          ]
        ),
      },
    })
);

// const joinPromise = joinOrExitPool({ exitArgs });

// @ts-ignore
// return <pre>{JSON.stringify(args, null, 2)}</pre>;
