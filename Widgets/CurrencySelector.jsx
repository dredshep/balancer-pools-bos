// @ts-check

/** @typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** @typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** @typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** @typedef {Object} SPoolId @property {string} totalWeight */
/** @typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens */
/** @typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** @typedef {Object} TokenWeights @property {string} address @property {string} weight */
/** @typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights[]} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens */
/** @typedef {Object} TransformedData @property {SBalancer[]} balancers @property {TransformedPool[]} pools */
/** @typedef {Object} StatePool @property {string} id @property {boolean} approved @property {boolean} depositing @property {boolean} withdrawing @property {boolean} approving @property {boolean} loading */
/** @typedef {Object} PoolAndBalance @property {string} poolAddress @property {string | undefined} balance */
/**
 * Form for a single token in the pool.
 * @typedef {Object} OneForm
 * @property {string} inputAmount - User input amount for the token in the pool.
 * @property {string} symbol - Self-explanatory.
 * @property {boolean} isSelected - Indicates whether the token is selected.
 * @property {string} address - Address of the token.
 */

/**
 * Form for the "all" token in the pool.
 * @typedef {Object} AllForm
 * @property {string} totalAmount - Total amount for the "all" token in the pool.
 */

/**
 * Forms object for the currency selector. There's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all".
 * @typedef {Object} CurrencySelectorGroup
 * @property {"all" | "one"} allOrOne - Indicates whether the form is for "all" or "one" tokens in the pool.
 * @property {AllForm} allForm - Form for the "all" token in the pool.
 * @property {Object.<string, OneForm>} oneForms - Forms for each token in the pool.
 * @property {boolean} tokenSelectorIsOpen - Indicates whether the token selector dropdown is open.
 * @property {string[]} tokenAddresses - Array containing all the addresses of the tokens it contains.
 * @property {string | undefined} poolBalance - User's balance of pool tokens.
 */
/**
 * Forms object for the currency selector. There's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all".
 * @typedef {Object.<string, CurrencySelectorGroup>} CurrencySelectorFormGroupsObject
 */
/**
 * @typedef {Object} StateAsVar
 * @property {CurrencySelectorFormGroupsObject} forms - Forms object for the currency selector.
 * @property {string | undefined} userAddress - User's address.
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 */

/**
 * @callback StakeUnstakeCallback
 * @param {string} poolAddress The pool address.
 * @param {string} userAddress The user address.
 * @param {SToken} sToken The SToken object.
 * @param {Object} abi The ABI object.
 * @returns {Promise<boolean>} Promise that resolves with true on success, false on failure.
 */

/**
 * @typedef {Object} Props
 * @property {"stake"|"unstake"} operation
 * @property {TransformedPool} pool
 * @property {string} erc20ABI
 * @property {boolean} test
 * @property {string} className
 */

/** @type {Props["operation"]} */
props.operation = "stake";
/** @type {Props["pool"]} */
props.pool = {
  id: "0x8d1acc804cbce52addb01f1076bb3723c516f27b000200000000000000000015",
  address: "0x8d1acc804cbce52addb01f1076bb3723c516f27b",
  tokensList: [
    "0x6a1ab80d1b161844948cc75c965c0d0242dbc630",
    "0x88267177ec1420648ba7cbfef824f14b9f637985",
  ],
  totalWeight: "1",
  totalShares: "1.999999999999989951",
  holdersCount: "2",
  poolType: "Weighted",
  poolTypeVersion: 4,
  tokenWeights: [
    {
      address: "0x6a1ab80d1b161844948cc75c965c0d0242dbc630",
      weight: "0.5",
    },
    {
      address: "0x88267177ec1420648ba7cbfef824f14b9f637985",
      weight: "0.5",
    },
  ],
  totalValueLocked: "0",
  tokens: [
    {
      name: "Dredshep Test Token 2",
      symbol: "DTT2",
      address: "0x6a1ab80d1b161844948cc75c965c0d0242dbc630",
      decimals: 18,
      totalBalanceUSD: "0",
      totalBalanceNotional: "1.00000000000019999",
      totalVolumeUSD: "0",
      totalVolumeNotional: "0",
      latestUSDPrice: null,
      latestPrice: null,
    },
    {
      name: "Test Dredso",
      symbol: "TDSO",
      address: "0x88267177ec1420648ba7cbfef824f14b9f637985",
      decimals: 18,
      totalBalanceUSD: "0",
      totalBalanceNotional: "1",
      totalVolumeUSD: "0",
      totalVolumeNotional: "0",
      latestUSDPrice: null,
      latestPrice: null,
    },
  ],
};
/** @type {Props["erc20ABI"]} */
props.erc20ABI =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;
/** @type {Props["test"]} */
props.test = true;
/** @type {Props["className"]} */
props.className = "";
/** @type {StakeUnstakeCallback} */
props.stake = async (poolAddress, userAddress, sToken, abi) => (
  console.log("stake", poolAddress, userAddress, sToken, abi), true
);
/** @type {StakeUnstakeCallback} */
props.unstake = async (poolAddress, userAddress, sToken, abi) => (
  console.log("unstake", poolAddress, userAddress, sToken, abi), true
);

/**
 * Joins a pool by sending a transaction to the Balancer contract.
 * @param {string} poolId - The ID of the pool to join.
 * @param {string} sender - The address of the sender.
 * @param {string} recipient - The address of the recipient.
 * @param {string} joinAmount - The amount of tokens to join the pool with.
 * @param {Object} contract - The Balancer contract instance.
 * @returns {Promise<Object>} - The transaction receipt.
 */
async function joinPool(poolId, sender, recipient, joinAmount, contract) {
  const request = {
    assets: [
      /* array of token addresses involved in the transaction */
    ],
    maxAmountsIn: [
      /* array of maximum amounts of tokens the sender is willing to send. In your case, it would be [joinAmount] */
    ],
    userData: ethers.utils.defaultAbiCoder.encode(
      [0],
      [joinAmount] // Join amount
    ),
    fromInternalBalance: false, // Or true, if you're using Balancer's internal balances
  };

  try {
    const tx = await contract.joinPool(poolId, sender, recipient, request);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Exits a pool by sending a transaction to the Balancer contract.
 * @param {string} poolId - The ID of the pool to exit.
 * @param {string} sender - The address of the sender.
 * @param {string} recipient - The address of the recipient.
 * @param {string} exitAmount - The amount of pool tokens to exit.
 * @param {Object} contract - The Balancer contract instance.
 * @returns {Promise<Object>} - The transaction receipt.
 */
async function exitPool(poolId, sender, recipient, exitAmount, contract) {
  const request = {
    assets: [
      /* array of token addresses involved in the transaction */
    ],
    minAmountsOut: [
      /* array of minimum amounts of tokens the sender is willing to receive. In your case, it would be [exitAmount] */
    ],
    userData: ethers.utils.defaultAbiCoder.encode(
      [0],
      [exitAmount] // Exit amount
    ),
    toInternalBalance: false, // Or true, if you're using Balancer's internal balances
  };

  try {
    const tx = await contract.exitPool(poolId, sender, recipient, request);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    console.log(err);
  }
}

// /** @type {string} */
// props.poolBalance = "0";

const missingProps = [];
// @ts-ignore
if (!props.operation) missingProps.push('operation ("stake"|"unstake")');
// @ts-ignore
if (!props.pool) missingProps.push("pool (TransformedPool)");
// @ts-ignore
if (!props.erc20ABI) missingProps.push("erc20ABI (string)");
// // @ts-ignore
// if (!props.stake) missingProps.push("stake (StakeUnstakeCallback)");
// // @ts-ignore
// if (!props.unstake) missingProps.push("unstake (StakeUnstakeCallback)");
// @ts-ignore
// if (!props.poolBalance) missingProps.push("poolBalance (string)");

function MissingPropsWarning({ missingProps }) {
  return (
    <div className="alert alert-danger">
      <div className="fw-bold">Missing props:</div>
      <pre>{missingProps.join("\n")}</pre>
    </div>
  );
}
if (missingProps.length) {
  // @ts-ignore
  return <MissingPropsWarning missingProps={missingProps} />;
}

/** @type {"stake"|"unstake"} */
const operation =
  // @ts-ignore
  props.operation;

/** @type {TransformedPool} */
const pool =
  // @ts-ignore
  props.pool;

/** @type {string} */
const className =
  // @ts-ignore
  props.className;

/** @type {string} */
const erc20ABI =
  // @ts-ignore
  props.erc20ABI;

/** @type {boolean} */
const test =
  // @ts-ignore
  props.test;

// /** @type {StakeUnstakeCallback} */
// const unstake =
//   // @ts-ignore
//   props.unstake;

// /** @type {StakeUnstakeCallback} */
// const stake =
//   // @ts-ignore
//   props.stake;

/**********************************************************************
 * Stake & Unstake Functions
 **********************************************************************/

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
 * @property {string} userData - String output of `encode(types, values). See more: https://docs.balancer.fi/reference/joins-and-exits/pool-joins.html#encoding. init join: [0, amountsIn], exactTokensJoin: [1, amountsIn, minimumBPTOut]
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
 * @property {string} userData - String output of `encode(types, values). See more: https://docs.balancer.fi/reference/joins-and-exits/pool-exits.html#encoding. customExit: [2, amountsOut, maxBPTAmountIn]. (QUERY EXIT IS MANDATORY FOR EXIT)
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
      console.log("joinOrExitPool() transaction emitted TX.then: tx:", tx);
      tx?.wait?.()
        ?.then?.((receipt) => {
          console.log(
            "joinOrExitPool() transaction mined TX.wait.then: receipt:",
            receipt
          );
          // refresh balances

          fetchAndUpdateBalance(state, getUserBalance, pool, userAddress, true);
          initializeTokenBalances(state, getUserBalance, true);
        })
        ?.catch?.((e) => {
          console.log(
            "joinOrExitPool() transaction mined TX.wait.catch: e:",
            e
          );
        });
    })
    ?.catch?.((e) => {
      console.log("joinOrExitPool() inner error on TX.catch: e:", e);
    });
}

const ONEe18 = ethers.BigNumber.from(10).pow(18);
const ONE = ethers.BigNumber.from(1);
const ZERO = ethers.BigNumber.from(0);
const MAX = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

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
      // console.log("eth_calledPromise result:", result);
      /** @type {[object, object[]]} */
      const decoded = balancerQueriesContract.interface.decodeFunctionResult(
        "queryExit",
        result
      );
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

/**
 * Queries the BalancerQueries contract for the amount of pool tokens and token amounts that will be received upon exiting a pool, then executes the exit.
 * @param {string} poolId - The ID of the pool to exit.
 * @param {string} sender - The address of the sender exiting the pool.
 * @param {string} recipient - The address of the recipient receiving the pool tokens and token amounts.
 * @param {ExitPoolArgs} rawRequest - The request object containing the minimum amounts of tokens to receive upon exiting the pool.
 */
function queryThenExit(poolId, sender, recipient, rawRequest) {
  queryExit(poolId, sender, recipient, rawRequest).then((res) => {
    const stringifiedAmountsOut = res.amountsOut.map((x) =>
      ethers.utils.formatUnits(x, 18)
    );
    const stringifiedBptIn = ethers.utils.formatUnits(res.bptIn, 18);
    console.log("queryThenExit res:", {
      bptIn: stringifiedBptIn,
      amountsOut: stringifiedAmountsOut,
    });
    const stringifiedInputAmountsOut = rawRequest.minAmountsOut.map((x) =>
      ethers.utils.formatUnits(x, 18)
    );
    const rawInputBptIn = new ethers.utils.AbiCoder().decode(
      ["uint256", "uint256"],
      ethers.utils.arrayify(rawRequest.userData)
    )[1];
    console.log("rawInputBptIn:", rawInputBptIn);
    const stringifiedInputBptIn = ethers.utils.formatUnits(rawInputBptIn, 18);
    console.log("queryThenExit input:", {
      bptIn: stringifiedInputBptIn,
      amountsOut: stringifiedInputAmountsOut,
    });
    // make a markdown table with the input and output amounts in parsed mode
    const table = `
| Name | Input | Output |
| ---- | ----- | ------ |
| maxBptIn | ${stringifiedInputBptIn} | ${stringifiedBptIn} |
| Max Amount 1 | ${stringifiedInputAmountsOut?.[0]} | ${stringifiedAmountsOut?.[0]} |
| Max Amount 2 | ${stringifiedInputAmountsOut?.[1]} | ${stringifiedAmountsOut?.[1]} |
`;
    console.log(table);
    return joinOrExitPool({
      exitArgs: {
        ...rawRequest,
        minAmountsOut: res.amountsOut.map((x) => x.mul(99).div(100)),
        userData: encode(["uint256", "uint256"], [1, res.bptIn]),
      },
    });
  });
}

/******************************************************
 * END of Stake & Unstake Functions
 ******************************************************/

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
State.update({ userAddress });

/**
 * Checks if how many tokens the user has approved the pool to spend.
 * @param {string} poolAddress - The address of the pool.
 * @param {string} userAddress - The address of the user.
 * @param {SToken} sToken - The sToken object.
 * @param {string} abi - The ABI of the sToken.
 * @returns {Promise<number>|string|undefined} - Promise<allowance:number>, error:string, or undefined if no signer.
 */
function checkAllowanceAmount(poolAddress, userAddress, sToken, abi) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting isApproved()");
    return;
  }
  try {
    if (!userAddress || !poolAddress || !sToken || !abi) {
      console.log("isApproved() missing args");
      return;
    }
    let checkedPoolAddress, checkedUserAddress, checkedTokenAddress;
    try {
      // checkedPoolAddress = ethers.utils.getAddress(poolAddress);
      checkedPoolAddress = ethers.utils.getAddress(
        "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
      );
      checkedUserAddress = ethers.utils.getAddress(userAddress);
      checkedTokenAddress = ethers.utils.getAddress(sToken.address);
    } catch (error) {
      console.log("isApproved() error while checking addresses", error);
      console.log("poolAddress", poolAddress);
      console.log("userAddress", userAddress);
      console.log("sToken.address", sToken.address);
      console.log("checkedPoolAddress", checkedPoolAddress);
      console.log("checkedUserAddress", checkedUserAddress);
      console.log("checkedTokenAddress", checkedTokenAddress);
      return;
    }
    if (!userAddress) return;
    const tokenContract = new ethers.Contract(
      checkedTokenAddress,
      abi,
      Ethers.provider()?.getSigner?.()
    );
    const allowance = tokenContract
      // .allowance(userAddress, poolAddress)
      .allowance(userAddress, "0xBA12222222228d8Ba445958a75a0704d566BF2C8")
      .then((/** @type {{ gt: (bignum: any) => boolean; }} */ allowance) => {
        // log the parsed allowance
        // console.log(
        //   "allowance",
        //   ethers.utils.formatUnits(allowance, sToken.decimals)
        // );
        // console.log(typeof allowance);
        return parseFloat(ethers.utils.formatUnits(allowance, sToken.decimals));
      });
    return allowance;
  } catch (error) {
    console.log("isApproved() error", error);
    return;
  }
}

const indexedTokens = Object.values(pool.tokens).reduce(
  (
    /** @type {Object<string, SToken>} */
    acc,
    /** @type {SToken} */
    token
  ) => {
    acc[token.address] = token;
    return acc;
  },
  {}
);

const tokenEntries = Object.entries(indexedTokens);
const tokenEntriesLength = tokenEntries.length;
const checkedTokens = [];

// check only if checkedTokens.length < tokenEntriesLength
if (tokenEntriesLength > 0 && checkedTokens.length < tokenEntriesLength) {
  tokenEntries.forEach(
    (/** @type {[string, SToken]} */ [tokenAddress, token]) => {
      const allowanceAmountPromise = checkAllowanceAmount(
        pool.address,
        userAddress,
        token,
        erc20ABI
      );
      const itsAString = typeof allowanceAmountPromise === "string";
      if (itsAString) {
        console.log("Error getting approval status:", allowanceAmountPromise);
      } else if (allowanceAmountPromise) {
        return allowanceAmountPromise.then(
          (/** @type {number} */ allowanceAmount) => {
            State.update({
              indexedApprovalAmountPerToken: {
                ...state.indexedApprovalAmountPerToken,
                [tokenAddress]: allowanceAmount,
              },
            });
          }
        );
      }
    }
  );
  // console.log(JSON.stringify(state.indexedApprovedTokens, null, 2));
}

/**
 * Checks if the user has approved the pool to spend their tokens.
 * @param {string} poolAddress - The address of the pool.
 * @param {string} userAddress - The address of the user.
 * @param {SToken} sToken - The sToken object.
 * @param {string} amount - The amount to approve.
 * @param {string} erc20ABI - The ABI of the sToken.
 * @returns {Promise<string>|string|undefined} - The allowance of the user for the pool, or undefined if there's an error.
 */
function approve(poolAddress, userAddress, sToken, amount, erc20ABI) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting approve()");
    return;
  }
  try {
    const tokenContract = new ethers.Contract(
      sToken.address, // address
      erc20ABI,
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const preFilledAmount = ethers.utils.parseUnits(amount, sToken.decimals);
    const allowance = tokenContract
      // .approve(poolAddress, preFilledAmount)
      .approve("0xBA12222222228d8Ba445958a75a0704d566BF2C8", preFilledAmount, {
        gasLimit: 6000000,
      })
      .then((/** @type {{ toString: () => string; }} */ allowance) => {
        // console.log(
        //   "json stringified allowance",
        //   JSON.stringify(allowance, null, 2)
        // );
        const allowancePromise = checkAllowanceAmount(
          poolAddress,
          userAddress,
          sToken,
          erc20ABI
        );
        if (
          typeof allowancePromise !== "string" &&
          allowancePromise &&
          allowancePromise.then
        ) {
          allowancePromise.then((/** @type {number} */ allowanceAmount) => {
            State.update({
              indexedApprovalAmountPerToken: {
                ...state.indexedApprovalAmountPerToken,
                [sToken.address]: allowanceAmount,
              },
            });
          });
        }
        return allowance.toString();
      });
    return allowance;
  } catch (error) {
    console.log("approve() error", error);
    return;
  }
}

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 * @returns {Promise<string>|string|undefined}
 */

function getUserBalance(poolAddress, userAddress) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
      errorGettingBalance: "No signer, user disconnected",
    });
    console.log("No signer, user disconnected, exiting getUserBalance()");
    return;
  }
  try {
    const erc20 = new ethers.Contract(
      poolAddress, // address
      erc20ABI,
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const balance = erc20
      .balanceOf(userAddress)
      .then((/** @type {{ toString: () => string; }} */ balance) => {
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        return formattedBalance;
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

/********************************
 * END BALANCE FETCHING THINGY
 *******************************/

/**
 * @typedef {Object} State
 * @property {string} inputAmount - The input amount (that user attempts to type in).
 * @property {string } lastValidInput - The last valid input amount.
 * @property {string | undefined} selectedToken - The selected token's address.
 * @property {boolean} tokenSelectorIsOpen - Whether the token selector is open or not.
 * @property {CurrencySelectorGroup} form - Forms object for the currency selector.
 * @property {string | undefined} poolBalance - The nominal balance the user has staked in the pool.
 * @property {Object<string, string>} tokenBalances - The nominal balance the user has available in their wallet per token.
 * @property {object[] | undefined} customWithdrawableAmounts - The BigNumber nominal token balance the user has available for the selected token in the unstake form.
 * @property {object} maxWithdrawableAmounts - The BigNumber nominal token balance the user has available for the selected token in the unstake form.
 * @property {string | undefined} userAddress - User's address.
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 * @property {Object<string, number>} indexedApprovalAmountPerToken - The amount the user has approved the pool to spend their tokens.
 */
// * @property {Object<string, boolean>} indexedApprovedTokens - Whether the user has approved the pool to spend their tokens.

State.init({
  inputAmount: "",
  lastValidInput: "",
  selectedToken: undefined,
  tokenSelectorIsOpen: false,
  // @ts-ignore
  form: {},
  poolBalance: undefined,
  tokenBalances: {},
  customWithdrawableAmounts: undefined,
  maxWithdrawableAmounts: undefined,
  // disconnected: true,
  userAddress: undefined,
  errorGettingBalance: undefined,
  // indexedApprovedTokens: {},
  indexedApprovalAmountPerToken: {},
});

// State.update({
//   poolBalance:
//     // @ts-ignore
//     props.poolBalance,
// });

// for each token in the pool, find its balance and update state.tokenBalances["tokenAddress"] = balance
let isTokenBalanceInitialized = false;

/**
 * Initializes the token balances for the current user.
 * @param {Object} state - The current state object.
 * @param {Function} getUserBalance - The function to get the user balance.
 * @param {Boolean} force - Whether to force the initialization process regardless of the initialized state.
 * @returns {Promise<void>} - A promise that resolves when the token balances have been initialized.
 */
async function initializeTokenBalances(state, getUserBalance, force) {
  if (isTokenBalanceInitialized && !force) {
    return;
  }
  isTokenBalanceInitialized = true;

  const tokenCount = state.form.tokenAddresses.length;
  let tokenCountDone = 0;

  for (let i = 0; i < tokenCount; i++) {
    const tokenAddress = state.form.tokenAddresses[i];
    const userAddress = state.userAddress;
    if (!userAddress) continue;
    const balance = getUserBalance(tokenAddress, userAddress);
    if (!balance || typeof balance === "string") {
      State.update({
        errorGettingBalance: balance,
      });
      continue;
    }
    balance.then((/** @type {string} */ balance) => {
      State.update({
        tokenBalances: {
          ...state.tokenBalances,
          [tokenAddress]: balance,
        },
      });
      tokenCountDone++;
      if (tokenCountDone === tokenCount) {
        State.update({
          errorGettingBalance: undefined,
        });
      }
    });
  }
}

// Call the function to initialize the token balances by default
initializeTokenBalances(state, getUserBalance, false);

/**
 * @param {string} inputAmount
 */
function validateInputAmount(inputAmount) {
  if (inputAmount === "") return true;
  const num = parseFloat(inputAmount);
  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (num > parseFloat(state.poolBalance ?? "0")) return false;
  return true;
}

/**
 * @param {string} inputAmount
 * @returns {string}
 */
function processInputAmount(inputAmount) {
  // Check for empty string
  if (inputAmount === "") {
    State.update({
      lastValidInput: "",
    });
    return "";
  }

  // Check for invalid characters and multiple dots
  if (!/^\d*\.?\d*$/.test(inputAmount)) return state.lastValidInput;

  // Parse float value
  const num = parseFloat(inputAmount);

  // Check for valid float value
  if (isNaN(num)) return state.lastValidInput;

  // Check for negative or exceeding pool balance value
  if (num < 0)
    //|| num > parseFloat(state.poolBalance ?? "0"))
    return state.lastValidInput;

  // If everything is fine, update the last valid input and return it
  State.update({
    lastValidInput: inputAmount,
  });
  return inputAmount ?? "";
}

let updated;
if (!updated) {
  State.update({
    form:
      /**
       * Form for the currency selector.
       * @type {CurrencySelectorGroup}
       */
      {
        allOrOne: "one",
        allForm: {
          totalAmount: "",
        },
        oneForms: {
          ...pool.tokens.reduce(
            (
              /** @type {Object<string, OneForm>} */
              acc,
              token,
              i
            ) => {
              acc[token.address] = {
                inputAmount: "",
                symbol: token.symbol,
                isSelected: i === 0,
                address: token.address,
              };
              return acc;
            },
            {}
          ),
        },
        tokenSelectorIsOpen: false,
        tokenAddresses: pool.tokens.map(
          (
            /** @type {SToken} */
            token
          ) => token.address
        ),
        poolBalance: undefined, //getUserBalance(pool.address, userAddress),
      },
  });
}
updated = true;

/**
 * @returns {OneForm | null} - The selected OneForm if found, null otherwise.
 */
function getSelectedOneFormInPool() {
  for (let key in state.form.oneForms) {
    if (state.form.oneForms[key].isSelected) {
      return state.form.oneForms[key];
    }
  }
  return null;
}

function updateForm(
  /** @type {string} */ poolAddress,
  /** @type {CurrencySelectorGroup} */ newForm
) {
  State.update({
    form: {
      ...state.form,
      [poolAddress]: newForm,
    },
  });
}

function handleRadioChange(
  /** @type {string} */ poolAddress,
  /** @type {"all" | "one"} */ newAllOrOne
) {
  /** @type {CurrencySelectorGroup} */
  const changedForm = state.form;
  if (changedForm.allOrOne === newAllOrOne) {
    return;
  }
  const formToChange = state.form;
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    allOrOne: newAllOrOne,
  };
  updateForm(poolAddress, newForm);
}

function handleTokenSelect(
  /** @type {string} */ poolAddress,
  /** @type {string} */ tokenAddress
) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.form;

  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,

    oneForms: {
      ...Object.keys(formToChange.oneForms).reduce(
        (
          /** @type {Object<string, OneForm>} */
          acc,
          /** @type {string} */
          tokenAddress
        ) => {
          acc[tokenAddress] = {
            ...formToChange.oneForms[tokenAddress],
            isSelected: false,
          };
          return acc;
        },
        {}
      ),
      [tokenAddress]: {
        ...formToChange.oneForms[tokenAddress],
        isSelected: true,
      },
    },
  };
  updateForm(poolAddress, newForm);
}
const myItemStyles = `
    border-radius: 3px;
    margin-bottom: 5px;
    background: #4A4F51;
    padding: 8px;
    cursor: pointer;
    /* deep shadow */
    
    &:hover {
        /*darken*/
        background: #3A3F41;
    }
`;
const MyCheckboxItem = styled("DropdownMenu.CheckboxItem")`
  ${myItemStyles}
`;

/**
 * @param {{ poolBalance: string | undefined; errorGettingBalance: string | undefined; operation: "stake" | "unstake", FormWidget: CurrencySelector}} innerProps
 */
function StakeUnstakeWidget(innerProps) {
  const poolBalance = innerProps.poolBalance;
  const operation = innerProps.operation;
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={
          (operation === "stake" ? "btn-primary" : "btn-secondary") +
          " btn btn-lg fw-bold border-0"
        }
        style={{
          letterSpacing: "0.033em",
          // desaturate completely and lighten by 50%
          filter:
            operation === "stake"
              ? "hue-rotate(40deg) saturate(80%) brightness(115%)"
              : "saturate(0%) brightness(100%)",
        }}
      >
        <div>{operation === "stake" ? "Stake" : "Unstake"}</div>
      </Dialog.Trigger>
      <Dialog.Content
        className="rounded-4"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      >
        <div className="card bg-dark text-light rounded-4 shadow border-0 p-3">
          <div className="card-header">
            <h5 className="card-title  d-flex align-items-center justify-content-between">
              <div>{operation === "stake" ? "Stake" : "Unstake"}</div>
              <Dialog.Close className="btn btn-sm bg-secondary border-0 pt-2 ps-2 pe-2">
                {/* <button className="btn btn-sm btn-secondary border-0 rounded-circle d-flex justify-content-center"> */}
                <div className="">
                  <i className="bi bi-x-lg"></i>
                </div>
                {/* </button> */}
              </Dialog.Close>
            </h5>
          </div>
          <div className="card-body">
            <innerProps.FormWidget className="" operation={operation} />
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function checkSelectedTokenIsApproved() {
  const selectedToken = state.selectedToken; // this is a string (address) | undefined
  const inputAmount = state.inputAmount; // this is a number | undefined
  const indexedApprovalAmountPerToken = state.indexedApprovalAmountPerToken;
  const parsedInputAmount = inputAmount ? parseFloat(inputAmount) : undefined;
  const selectedTokenIsApproved =
    selectedToken && parsedInputAmount
      ? parsedInputAmount <= indexedApprovalAmountPerToken[selectedToken]
      : false;
  return selectedTokenIsApproved;
}

/**
 * Fetches and updates the user balance.
 * @param {Object} state - The current state object.
 * @param {Function} getUserBalance - The function to get the user balance.
 * @param {Object} pool - The pool object.
 * @param {string} userAddress - The user's address.
 * @param {Boolean} force - Whether to force the fetching of balance regardless of the current balance state.
 * @returns {Promise<void>} - A promise that resolves when the balance has been fetched and updated.
 */
async function fetchAndUpdateBalance(
  state,
  getUserBalance,
  pool,
  userAddress,
  force
) {
  if (typeof state.poolBalance !== "undefined" && !force) {
    return;
  }

  const promise = getUserBalance(pool.address, userAddress);
  if (promise !== undefined && typeof promise !== "string") {
    promise.then((_balance) => {
      // balance is a float string, parse it with tokenDecimals=18
      const balance = ethers.utils.parseUnits(_balance, 18);
      State.update({ poolBalance: ethers.utils.formatUnits(balance, 18) });
    });
  }
}

// Call the function to fetch and update the balance by default
fetchAndUpdateBalance(state, getUserBalance, pool, userAddress, false);

if (typeof state.poolBalance === "undefined") {
  // @ts-ignore
  return <div>Loading...</div>;
}
/**
 * @param {boolean} init
 */
function updateWithdrawableAmounts(init) {
  try {
    if (
      !state.poolBalance ||
      !state.form ||
      !state.userAddress ||
      !pool ||
      !pool.tokens?.length
    ) {
      console.log("updateWithdrawableAmounts: missing state");
      return;
    }
    // to get bptAmount, parse inputAmount, which is a string like "0.0", with tokenDecimals=18
    const bptAmount =
      state.inputAmount &&
      state.inputAmount !== "" &&
      state.inputAmount !== "0" &&
      (state.inputAmount.split(".")[1]?.length ?? 0) <= 18
        ? ethers.utils.parseUnits(state.inputAmount, 18)
        : undefined;
    if (bptAmount === undefined)
      State.update({ customWithdrawableAmounts: undefined });
    const maxBptAmount = ethers.utils.parseUnits(state.poolBalance, 18);
    [bptAmount, maxBptAmount].forEach((amount, i) => {
      if (amount && pool.id && userAddress) {
        queryExit(pool.id, userAddress, userAddress, {
          // the idea here is to check the maximum allowed tokensOut by querying the pool with however many bpt tokens the user has
          minAmountsOut: pool.tokens.map(() => ethers.BigNumber.from(0)),
          poolId: pool.id,
          recipient: userAddress,
          sender: userAddress,
          sortedTokenAddresses: pool.tokens
            .map((token) => token.address)
            .sort(),
          toInternalBalance: false,
          userData: encode(["uint256", "uint256"], [1, amount]),
        })
          .then((exitAmounts) => {
            console.log("exitAmounts", exitAmounts);
            i === 0 // bptAmount, it is custom
              ? !init &&
                State.update({
                  customWithdrawableAmounts: exitAmounts.amountsOut,
                })
              : State.update({
                  maxWithdrawableAmounts: exitAmounts.amountsOut,
                });
          })
          .catch((e) => {
            console.log(
              "Error while running queryExit() in updateWithdrawableAmounts():",
              e
            );
            i === 0 // bptAmount, it is custom
              ? State.update({ customWithdrawableAmounts: undefined })
              : State.update({ maxWithdrawableAmounts: undefined });
          });
      }
    });
  } catch (e) {
    console.log("Error in updateWithdrawableAmounts()", e);
  }
}

/**
 * Renders a currency selector component.
 *
 * @callback CurrencySelector
 * @param {{ className: string, operation: "stake" | "unstake" }} props - The props for the currency selector component.
 * @returns {React.JSX.Element} - The currency selector component.
 */

/**
 * Renders a currency selector component.
 * @type {CurrencySelector}
 */
function CurrencySelector({ className, operation }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.form;

  const { oneForms, tokenAddresses } = currencySelectorGroup;
  /** @type {number[]} */
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];
  const displayInput =
    (operation === "stake" && state.selectedToken) || operation === "unstake";

  return (
    <div className={className}>
      <div className="d-flex flex-column container py-2 pb-3">
        {!state.userAddress ? (
          <h6>No user address available, connect wallet.</h6>
        ) : (
          <div className="d-flex flex-column">
            {/* here goes the title: "Input Amount" */}
            {operation === "stake" && (
              <>
                <div className="d-flex flex-row my-2">
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Select a token to{" "}
                    {operation === "stake" ? "stake" : "unstake"}.
                  </div>
                </div>
                {/* Token dropdown for the One form*/}
                {/* make a div same color as input here, rounded right, straight left, and it'll have the selected token inside */}

                <div
                  style={{
                    backgroundColor: "#585858",
                    color: "white",
                    // round right corners
                    borderRadius: "4px",
                    // horizontal padding is 16px and vertical padding is 4px
                    padding: "4px 4px",
                    height: "40px",
                    // make it a flexbox
                    display: "flex",
                    // center the text
                    alignItems: "center",
                    // justify the text to the right
                    justifyContent: "center",
                    userSelect: "none",
                  }}
                >
                  <DropdownMenu.Root
                    open={state.tokenSelectorIsOpen}
                    style={{ position: "relative" }}
                    onOpenChange={(
                      /** @type {boolean} */
                      isOpen
                    ) => {
                      State.update({ tokenSelectorIsOpen: isOpen });
                    }}
                  >
                    <DropdownMenu.Trigger
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontWeight: "bold",
                        color: "white",
                        letterSpacing: "0.033em",
                        display: "flex",
                      }}
                    >
                      {tokenAddresses.length === 0 ? (
                        <></>
                      ) : (
                        // if one is selected, show the selected token
                        <span
                          style={{
                            // make it a flexbox
                            display: "flex",
                            // center the text
                            alignItems: "center",
                            // justify the text to the right
                            justifyContent: "flex-end",
                            outline: "none",
                          }}
                        >
                          {/* find selected token address and use its symbol, if none are there, put "Select a token" */}
                          {
                            // use this length to iterate through the array of oneForms without actually using Object.keys(oneForm) which is disallowed
                            arrayOfSameLengthAsTokenAddresses.reduce(
                              (acc, _, index) => {
                                const tokenAddress = tokenAddresses[index];
                                const oneForm = oneForms[tokenAddress];
                                if (state.selectedToken === tokenAddress) {
                                  return oneForm.symbol;
                                }
                                return acc;
                              },
                              "Select a token"
                            )
                          }
                        </span>
                      )}
                      <span className="ms-1">
                        <i className="bi bi-caret-down-fill"></i>
                      </span>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                      sideOffset={5}
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        backgroundColor: "#161616",
                        padding: "5px",
                        borderRadius: "4px",
                        paddingBottom: "0px",
                        width: "max-content",
                        maxWidth: "170px",
                      }}
                    >
                      {arrayOfSameLengthAsTokenAddresses.map((_, index) => {
                        const tokenAddress = tokenAddresses[index];
                        const oneForm = oneForms[tokenAddress];
                        return (
                          <MyCheckboxItem
                            key={tokenAddress}
                            checked={state.selectedToken === tokenAddress}
                            onCheckedChange={(
                              /** @type {boolean} */
                              isSelected
                            ) => {
                              if (isSelected) {
                                State.update({ selectedToken: tokenAddress });
                                // if (operation === "unstake") {
                                //   queryExit(pool.id, userAddress, userAddress, {
                                //     minAmountsOut
                                //   })
                                // }
                              }
                            }}
                          >
                            <DropdownMenu.ItemIndicator
                              style={{ marginRight: "5px" }}
                            >
                              <i className="bi bi-check-circle-fill"></i>
                            </DropdownMenu.ItemIndicator>
                            {oneForm.symbol}
                          </MyCheckboxItem>
                        );
                      })}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </>
            )}
            {operation === "unstake" && (
              <>
                {/* show a list of tokens with : at the end and show the Y amount of tokens to be withdrawn if the inputAmount is X when pressing Unstake */}
                <div className="d-flex flex-row my-2">
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    By unstaking, you will receive:
                  </div>
                </div>
                {/* OL of tokens in this format: "19.0 USDC" */}
                <div>
                  <ol
                    style={{
                      listStyleType: "none",
                      paddingLeft: "0px",
                    }}
                  >
                    {Object.keys(state.tokenBalances).map((tokenAddress) => {
                      const oneForm = oneForms[tokenAddress];
                      const tokenBalance = state.tokenBalances[tokenAddress];
                      return (
                        <li
                          key={tokenAddress}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 0px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{oneForm.symbol}:</span>

                            <span
                              style={{
                                marginLeft: "5px",
                                color: "#585858",
                              }}
                            >
                              {state.customWithdrawableAmounts &&
                              state.customWithdrawableAmounts.length > 0 &&
                              state.customWithdrawableAmounts[
                                tokenAddresses.indexOf(tokenAddress)
                              ]
                                ? ethers.utils.formatUnits(
                                    state.customWithdrawableAmounts[
                                      tokenAddresses.indexOf(tokenAddress)
                                    ],
                                    indexedTokens[tokenAddress].decimals
                                  )
                                : "0"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </>
            )}
            {/* here goes the title: "Input Amount" */}
            {displayInput && (
              <div className="d-flex flex-row my-2">
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Input Amount{" "}
                  <span
                    className="text-primary"
                    style={{
                      filter:
                        "hue-rotate(40deg) saturate(80%) brightness(115%)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!state.selectedToken && operation === "stake") {
                        return;
                      } else if (state.selectedToken && operation === "stake") {
                        const maxStakeAmount =
                          state.tokenBalances[state.selectedToken];
                        State.update({
                          inputAmount: processInputAmount(maxStakeAmount),
                        });
                        return;
                      }

                      const maxAmount = state.poolBalance;
                      State.update({
                        inputAmount: processInputAmount(maxAmount || "0"),
                      });
                      updateWithdrawableAmounts(false);
                    }}
                  >
                    {operation === "unstake"
                      ? "(Max: " + state.poolBalance + ")"
                      : state.selectedToken &&
                        state.tokenBalances[state.selectedToken]
                      ? "(Max: " +
                        state.tokenBalances[state.selectedToken] +
                        ")"
                      : undefined}
                  </span>
                </div>
              </div>
            )}
            {displayInput && (
              <div className="d-flex flex-row mb-2">
                <input
                  type="text"
                  className="form-control"
                  style={{
                    backgroundColor: "#585858",
                    color: "white",
                    border: "0px",
                    padding: "4px 16px",
                    height: "40px",
                  }}
                  value={state.inputAmount}
                  onChange={(e) => {
                    const processed = processInputAmount(e.target.value) || "";
                    State.update({ inputAmount: processed });
                    updateWithdrawableAmounts(false);
                  }}
                />
              </div>
            )}
            {operation === "stake" &&
              state.selectedToken &&
              parseFloat(state.inputAmount) >
                parseFloat(state.tokenBalances[state.selectedToken] ?? "0") && (
                <div className="d-flex flex-row mb-2">
                  <div
                    className="alert alert-warning mt-1"
                    style={{
                      fontSize: "14px",
                      maxWidth: "220px",
                    }}
                  >
                    Warning: If you stake/unstake more than your balance, the
                    transaction will consume gas but will be cancelled.
                  </div>
                </div>
              )}
            {/* submit buttons */}
            {(state.selectedToken || operation === "unstake") && (
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <button
                  className={
                    "btn btn-sm" +
                    ((state.selectedToken || operation === "unstake") &&
                    userAddress
                      ? " btn-primary"
                      : " btn-secondary")
                  }
                  disabled={
                    (operation === "stake" &&
                      (!state.selectedToken || !userAddress)) ||
                    !state.inputAmount ||
                    0 === parseFloat(state.inputAmount)
                  }
                  style={{
                    filter:
                      (state.selectedToken || operation === "unstake") &&
                      userAddress
                        ? "hue-rotate(40deg) saturate(80%) brightness(115%)"
                        : "saturate(0%) brightness(100%)",
                    width: "100%",
                    height: "40px",
                  }}
                  onClick={() => {
                    // handle stake or unstake
                    if (operation === "stake") {
                      if (!state.selectedToken) {
                        console.log("no token selected, cannot stake");
                        return;
                      }
                      // stake(
                      //   pool.address,
                      //   state.selectedToken,
                      //   indexedTokens[state.selectedToken],
                      //   state.inputAmount
                      // );
                      // check if approved first if not use the approve function
                      if (checkSelectedTokenIsApproved()) {
                        const sortedTokenAddresses = [...tokenAddresses].sort();
                        // get sorted token amounts by mapping token amounts to tokenAddresses indexes
                        const amountsIn = sortedTokenAddresses.map(
                          (tokenAddress) => {
                            const tokenAmount = state.inputAmount;
                            const tokenDecimals =
                              indexedTokens[tokenAddress].decimals;
                            if (tokenAddress === state.selectedToken) {
                              return ethers.utils.parseEther(
                                tokenAmount,
                                tokenDecimals
                              );
                            } else {
                              return ethers.utils.parseEther(
                                "0",
                                tokenDecimals
                              );
                            }
                          }
                        );
                        /** @type {JoinPoolArgs} */
                        const joinArgs = {
                          fromInternalBalance: false,
                          maxAmountsIn: amountsIn,
                          poolId: pool.id,
                          recipient: userAddress,
                          sender: userAddress,
                          sortedTokenAddresses: sortedTokenAddresses,
                          userData: encode(
                            ["uint256", "uint256[]", "uint256"],
                            // 0 is INIT (first ever join to a pool), 1 is EXACT_TOKENS_IN.
                            // exactTokensJoin: [1, amountsIn, minimumBPTOut]
                            [1, amountsIn, 0]
                          ),
                        };
                        joinOrExitPool({ joinArgs });
                      } else {
                        if (state.userAddress) {
                          approve(
                            pool.address,
                            state.userAddress,
                            indexedTokens[state.selectedToken],
                            state.inputAmount,
                            erc20ABI
                          );
                        }
                      }
                    }
                    if (operation === "unstake") {
                      const sortedTokenAddresses = [...tokenAddresses].sort();
                      // get sorted token amounts by mapping token amounts to tokenAddresses indexes
                      const amountsOut = sortedTokenAddresses.map(
                        (tokenAddress, i) => {
                          return state.customWithdrawableAmounts?.[i];
                        }
                      );
                      amountsOut.forEach((amount, i) => {
                        if (amount === undefined) {
                          throw new Error(
                            "amountsOut[" +
                              i +
                              "] is undefined, this should not happen"
                          );
                        }
                      });
                      const bigNumberInputAmount = ethers.utils.parseUnits(
                        state.inputAmount,
                        18
                      );
                      /** @type {ExitPoolArgs} */
                      const exitArgs = {
                        minAmountsOut: [],
                        toInternalBalance: false,
                        poolId: pool.id,
                        recipient: userAddress,
                        sender: userAddress,
                        sortedTokenAddresses: sortedTokenAddresses,
                        // customExit: [2, amountsOut, maxBPTAmountIn].
                        // 2 is EXACT_TOKENS_OUT.
                        userData: encode(
                          ["uint256", "uint256"],
                          [1, bigNumberInputAmount]
                        ),
                      };
                      // console.log("exitArgs", {
                      //   ...exitArgs,
                      //   minAmountsOut: exitArgs.minAmountsOut.map((amount) =>
                      //     // decode big nums
                      //     ethers.utils.formatEther(amount)
                      //   ),
                      //   userData: ethers.utils.defaultAbiCoder.decode(
                      //     ["uint256", "uint256[]", "uint256"],
                      //     exitArgs.userData
                      //   ),
                      // });
                      queryThenExit(
                        pool.id,
                        userAddress,
                        userAddress,
                        exitArgs
                      );
                    }
                  }}
                >
                  {typeof checkSelectedTokenIsApproved() === "boolean"
                    ? checkSelectedTokenIsApproved() || operation === "unstake"
                      ? operation === "stake"
                        ? "Stake"
                        : "Unstake"
                      : !state.inputAmount ||
                        0 === parseFloat(state.inputAmount)
                      ? "Input an amount"
                      : "Approve"
                    : "Select a token"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function logAndReturnBalance() {
  console.log("logged balance while rendering", state.form.poolBalance);
  return state.form.poolBalance;
}

function TestComponent() {
  return (
    <div className="container flex">
      <div
        className="bg-dark rounded-2"
        style={{
          width: "250px",
        }}
      >
        <CurrencySelector className="my-2" operation="stake" />
      </div>
      <Web3Connect connectLabel="Connect wallet with Web3" className="mb-3" />
      <h2>User Balance:</h2>
      <pre>{JSON.stringify(state.poolBalance, null, 2)}</pre>
      <h2>state.form Information:</h2>
      <pre>{JSON.stringify(state.form, null, 2)}</pre>
      <h2>Pool Information:</h2>
      <pre>{JSON.stringify(pool, null, 2)}</pre>
    </div>
  );
}

function MainReturn() {
  return test ? (
    <TestComponent />
  ) : (
    <CurrencySelector operation={operation} className={className || ""} />
  );
}

// @ts-ignore
// return <MainReturn />;
return (
  <div className="d-flex gap-3">
    <StakeUnstakeWidget
      poolBalance={poolBalance}
      errorGettingBalance={errorGettingBalance}
      operation={operation === "stake" ? "unstake" : "stake"}
      FormWidget={CurrencySelector}
    />
    <StakeUnstakeWidget
      poolBalance={poolBalance}
      errorGettingBalance={errorGettingBalance}
      operation={operation}
      FormWidget={CurrencySelector}
    />
  </div>
);
