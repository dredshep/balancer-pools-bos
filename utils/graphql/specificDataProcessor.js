/* goal:
- token pair (symbol, decimals, name, latestPrice, latestUSDPrice, address)
- pool (id, address, poolType, poolTypeVersion, tokens, totalLiquidity)
- pool tokens (id, balance, symbol, name, decimals, address, weight)
- balancer (totalLiquidity)
*/

// zkEVM addresses
const knownAddresses = {
  /** main reference, priced by bb-o-USD */ "bb-o-USDT":
    "0x4b718e0e2fea1da68b763cd50c446fba03ceb2ea",
  /** reference for bb-o-USDT*/ "bb-o-USD":
    "0xe274c9deb6ed34cfe4130f8d0a8a948dea5bb286",
  /** NOT a reference, priced by bb-o-USD */ USDT: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
  /** reference for USDC */ "bb-o-USDC":
    "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
  /** priced by bb-o-USDC*/ USDC: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
  /** reference for WETH, circular pricing */ "B-wstETH-STABLE":
    "0xe1f2c039a68a216de6dd427be6c60decf405762a",
  /** priced by B-wstETH-STABLE, circular pricing*/ WETH: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
};

const url =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";

/**
 * @typedef {Object} SBalancer
 * @property {string} id
 * @property {number} poolCount
 * @property {string} totalLiquidity
 */

/**
 * @typedef {Object} SToken
 * @property {string} name
 * @property {string} symbol
 * @property {string} address
 * @property {number} decimals
 * @property {string} totalBalanceUSD
 * @property {string} totalBalanceNotional
 * @property {string} totalVolumeUSD
 * @property {string} totalVolumeNotional
 * @property {string|null} latestUSDPrice
 * @property {SLatestPrice|null} latestPrice
 */

/**
 * @typedef {Object} SLatestPrice
 * @property {string} pricingAsset
 * @property {string} price
 * @property {SPoolId} poolId
 */

/**
 * @typedef {Object} SPoolId
 * @property {string} totalWeight
 */

/**
 * @typedef {Object} SPool
 * @property {string} id
 * @property {string} address
 * @property {string[]} tokensList
 * @property {string} totalWeight
 * @property {string} totalShares
 * @property {string} holdersCount
 * @property {string} poolType
 * @property {number} poolTypeVersion
 * @property {Token[]} tokens
 */

/**
 * @typedef {Object} SBalancerGQLResponse
 * @property {Balancer[]} balancers
 * @property {SPool[]} pools
 */

function getGraphQlQuerySync(query) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  const { body } = fetch(url, options);
  return body.data;
}

/**
 * @typedef {Object} SBalancerGQLResponse2
 * we redefine the raw type by mentioning everything again
 * @property {{
 * id: string,
 * poolCount: number,
 * totalLiquidity: string
 * }[]} balancers
 * @property {{
 * id: string,
 * address: string,
 * tokensList: string[],
 * totalWeight: string,
 * totalShares: string,
 * holdersCount: string,
 * poolType: string,
 * poolTypeVersion: number,
 * tokens: {
 * token: {
 * name: string,
 * symbol: string,
 * address: string,
 * decimals: number,
 * totalBalanceUSD: string,
 * totalBalanceNotional: string,
 * totalVolumeUSD: string,
 * totalVolumeNotional: string,
 * latestUSDPrice: string,
 * latestPrice: {
 * pricingAsset: string,
 * price: string,
 * poolId: {
 * totalWeight: string
 * }}}}[]}[]} pools
 * @example const data = runAllInOneQuery();
 * console.log(data);
 */

/**
 * @name runAllInOneQuery
 * @description Get the pool data from the Balancer subgraph
 * @returns {SBalancerGQLResponse}
 * @example const data = runAllInOneQuery();
 */
function runAllInOneQuery() {
  const query = `{
    balancers(first: 5) {
      id
      poolCount
      totalLiquidity
    }
    pools(first: 5) {
      id
      address
      tokensList
      totalWeight
      totalShares
      holdersCount
      poolType
      poolTypeVersion
      tokens {
        token {
          name
          symbol
          address
          decimals
          totalBalanceUSD
          totalBalanceNotional
          totalVolumeUSD
          totalVolumeNotional
          latestUSDPrice
          latestPrice {
            pricingAsset
            price
            poolId {
              totalWeight
            }
          }
        }
      }
    }
  }`;

  /** @type {SBalancerGQLResponse2} */
  const data = getGraphQlQuerySync(query);
  return data;
}

/**
 * @name calculateTotalValueLocked
 * @description Calculate the total value locked in a pool
 * @param {SBalancerGQLResponse2["pools"][0]} pool
 * @returns {string}
 * @example const totalValueLocked = calculateTotalValueLocked(pool);
 * console.log(totalValueLocked);
 */
function calculateTotalValueLocked(pool) {
  const totalLiquidity = pool.tokens.reduce((acc, _token) => {
    const { token } = _token;
    const usdBalance = token.totalBalanceUSD;
    if (usdBalance) {
      return acc + parseFloat(usdBalance);
    }
    return acc;
  }, 0);
  return totalLiquidity;
}

/**
 * @name calculateTokenWeights
 * @description Calculate the token weights in a pool
 * @param {SBalancerGQLResponse2["pools"][0]} pool
 * @returns {{
 * address: string,
 * weight: string
 * }[]}
 * @example const tokenWeights = calculateTokenWeights(pool);
 * console.log(tokenWeights);
 */
function calculateTokenWeights(pool) {
  const totalValueLocked = calculateTotalValueLocked(pool);
  const getWeight = (value) =>
    ((value / totalValueLocked) * 100).toFixed(2) + "%";
  const weights = pool.tokens.map((_token) => {
    const { token } = _token;
    const weight = getWeight(parseFloat(token.totalBalanceUSD));
    return {
      address: token.address,
      weight,
      token,
    };
  });
  return weights;
}

/*make typedef for

const transformedPools: {
    totalValueLocked: string;
    tokenWeights: {
        address: string;
        weight: string;
    }[];
    id: string;
    address: string;
    tokensList: string[];
    totalWeight: string;
    totalShares: string;
    holdersCount: string;
    poolType: string;
    poolTypeVersion: number;
    tokens: Token[];
}[]
*/

/**
 * @typedef {Object} TokenWeights
 * @property {string} address
 * @property {string} weight
 */

/**
 * @typedef {Object} TransformedPool
 * @property {string} totalValueLocked
 * @property {TokenWeights[]} tokenWeights
 * @property {string} tokenWeights.address
 * @property {string} tokenWeights.weight
 * @property {string} id
 * @property {string} address
 * @property {string[]} tokensList
 * @property {string} totalWeight
 * @property {string} totalShares
 * @property {string} holdersCount
 * @property {string} poolType
 * @property {number} poolTypeVersion
 * @property {Token[]} tokens
 */

/**
 * @typedef {Object} TransformedData
 * @property {SBalancerGQLResponse2["balancers"]} balancers
 * @property {TransformedPool[]} pools
 * @example const data = getTransformedData();
 * console.log(data);
 */

/**
 * @name getTransformedData
 * @description Get the transformed data from the Balancer subgraph data and the calculations
 * @returns {TransformedData}
 * @example const data = getTransformedData();
 * console.log(data);
 */

function getTransformedData() {
  const data = runAllInOneQuery();
  const transformedPools = data.pools.map((pool) => {
    const totalValueLocked = calculateTotalValueLocked(pool);
    const tokenWeights = calculateTokenWeights(pool);
    return {
      ...pool,
      totalValueLocked,
      tokenWeights,
    };
  });
  const transformedData = {
    balancers: data.balancers,
    pools: transformedPools,
  };
  return transformedData;
}

try {
  const data = getTransformedData();
  const processedData = JSON.stringify(
    {
      data: data,
      TVLPerPool: data.pools.map((pool) => calculateTotalValueLocked(pool)),
      tokenWeightsPerPool: data.pools.map((pool) =>
        calculateTokenWeights(pool)
      ),
    },
    null,
    2
  );

  return (
    <>
      <h1>Data for all pools</h1>
      <pre>{processedData}</pre>
    </>
  );
} catch (e) {
  return (
    <>
      <h1>Total Value Locked & Token Weights of 1st pool</h1>
      <p>Something went wrong</p>
    </>
  );
}
