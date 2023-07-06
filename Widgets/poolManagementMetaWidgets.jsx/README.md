Solidity stuff:

```sol
function joinPool(
    bytes32 poolId,
    address sender,
    address recipient,
    JoinPoolRequest memory request
) external payable;

struct JoinPoolRequest {
    // [ASSET_A, ASSET_B] - MUST BE SORTED ALPHABETICALLY
    address[] assets;
    // [ASSET_A_AMOUNT, ASSET_B_AMOUNT]
    uint256[] maxAmountsIn;
    bytes userData;
    // false
    bool fromInternalBalance;
}
```

Javascript tentative ideas:

```js
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
  const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);
  // vault takes 4 args: poolId, sender, recipient, JoinPoolRequest
  // joinPoolRequest is an array with 4 args: assets, maxAmountsIn, userData, fromInternalBalance
  const txPromise = vault.joinPool(poolId, sender, recipient, [
    sortedTokenAddresses,
    maxAmountsIn,
    userDataEncoded,
    fromInternalBalance,
  ]);
  tx.then((tx) => {
    console.log(tx);
  });
}
```

Some process:

```js
// Create the Vault contract:
const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);

const types = ["uint256", "uint256[]", "uint256"];
// [EXACT_TOKENS_IN_FOR_BPT_OUT, amountsIn, minimumBPT];
const data = [ARRAY_OF_TOKENS_IN, ARRAY_OF_TOKENS_IN_AMOUNT, 0];
const userDataEncoded = ethers.utils.defaultAbiCoder.encode(types, data);
```

Some Balancer docs:

```
Exact Tokens Join
userData ABI
['uint256', 'uint256[]', 'uint256']
userData
```

Balancer docs link: https://docs.balancer.fi/reference/joins-and-exits/pool-joins.html#userdata

Exit solidity stuff:

```sol
function exitPool(
  bytes32 poolId,
  address sender,
  address payable recipient,
  ExitPoolRequest memory request
) external;

struct ExitPoolRequest {
    address[] assets;
    uint256[] minAmountsOut;
    bytes userData;
    bool toInternalBalance;
}

enum ExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, // 0
    EXACT_BPT_IN_FOR_TOKENS_OUT, // 1
    BPT_IN_FOR_EXACT_TOKENS_OUT, // 2
    MANAGEMENT_FEE_TOKENS_OUT // for InvestmentPool
}
```

Some exit ideas:

```js
// BPT = Balancer Pool Token
const types = ["uint256", "uint256", "uint256"];
// [EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, bptAmountIn, exitTokenIndex];
const data = [0, BPT_AMOUNT_IN, 0];
const userDataEncoded = ethers.utils.defaultAbiCoder.encode(types, data);
```
