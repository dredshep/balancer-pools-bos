//@ts-check

/** typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** typedef {Object} SPoolId @property {string} totalWeight */
/** typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens */
/** typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** typedef {Object} TokenWeights @property {string} address @property {string} weight */
/** typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights[]} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens */
/** typedef {Object} TransformedData @property {SBalancer[]} balancers @property {TransformedPool[]} pools */
/** typedef {Object} StatePool @property {string} id @property {boolean} approved @property {boolean} depositing @property {boolean} withdrawing @property {boolean} approving @property {boolean} loading */
/** typedef {Object} ChainInfo @property {string} name @property {string} chainId @property {string} shortName @property {string} chain @property {string} network @property {string} networkId @property {{ name: string, symbol: string, decimals: number }} nativeCurrency @property {string[]} rpc @property {string[]} faucets @property {{ name: string, url: string, standard: string }[]} explorers */
/** typedef {Object.<string, ChainInfo>} ChainInfoObject */

/**
 * @description Get the user's balance in a pool
 * @param {string} poolAddress
 * @param {string} userAddress
 * @returns {string} The user's balance in the pool
 */

/** @type {any[]} */
const abi =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 */
function getUserBalance(poolAddress, userAddress) {
  const erc20 = new ethers.Contract(
    poolAddress, // address
    abi, // erc20 abi
    Ethers.provider().getSigner()
  );

  const balance = erc20.balanceOf(userAddress).then((balance) => {
    // undo big number into a string
    return ethers.utils.formatUnits(balance, 18);
  });
  return balance;
}

// vault:                0xBA12222222228d8Ba445958a75a0704d566BF2C8
// polygon weth token:   0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9
// user address:         0xe25c0e141b98a5a449fbd70cfda45f6088486c74

State.init({
  myUserBalance: {
    poolId: null,
    balance: null,
    userAddress: null,
  },
});

try {
  /*
  
trying to find users' balance
problem is where
it's in pool
need to find a pool then that has balances
then i'd use the pool's address to find users that has users addresses
then i'd grab one that has a balance and read the balance

here's a query idea, this gives me info:

{
  pools {
    shares {
      userAddress {
        id
      }
      balance
      poolId {
        id
      }
    }
  }
}

{
  "userAddress": {
    "id": "0xe25c0e141b98a5a449fbd70cfda45f6088486c74"
  },
  "balance": "2.012257997453438001",
  "poolId": {
    "id": "0x16c9a4d841e88e52b51936106010f27085a529ec00000000000000000000000c"
  }
}

  */
  getUserBalance(
    "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
    "0xe25c0e141b98a5a449fbd70cfda45f6088486c74"
  ).then((balance) => {
    State.update({
      myUserBalance: {
        poolId: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
        balance: balance,
        userAddress: "0xe25c0e141b98a5a449fbd70cfda45f6088486c74",
      },
    });
  });

  //@ts-ignore
  return (
    <>
      <h1>User Balance: {state.balance}</h1>
    </>
  );

  // const vault = new ethers.Contract(
  //   "0xBA12222222228d8Ba445958a75a0704d566BF2C8", // address
  //   abi, // erc20 abi
  //   Ethers.provider().getSigner()
  // );
  // vault
  //   .balanceOf("0xe25c0e141b98a5a449fbd70cfda45f6088486c74")
  //   .then((/** @type {any} */ balance) => {
  //     // undo big number into a string
  //     return ethers.utils.formatUnits(balance, 18);
  //   })
  //   .then((balance) => {
  //     State.update({
  //       userBalances: [
  //         {
  //           poolAddress: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
  //           balance: balance,
  //         },
  //       ],
  //     });
  //   });
} catch (e) {
  // @ts-ignore
  return (
    <>
      <h1>Error while trying to fetch balances</h1>
      <pre>{JSON.stringify(e, null, 2)}</pre>
    </>
  );
}

const userBalances = state.userBalances;

// @ts-ignore
return <pre>JSON.stringify(userBalances, null, 2)</pre>;
