/* request: 
{
  balancers(first: 1) {
    totalLiquidity
  }
  pools(first: 5) {
    id
    address
    poolType
    poolTypeVersion
    tokens {
      id
      balance
      oldPriceRate
      priceRate
      symbol
      name
      decimals
      address
      weight
    }
  }
}
*/
/**
 * @typedef {Object} ComplexToken
 * @property {string} id
 * @property {string} balance
 * @property {string} oldPriceRate
 * @property {string} priceRate
 * @property {string} symbol
 * @property {string} name
 * @property {string} decimals
 * @property {string} address
 * @property {string} weight
 **/

/**
 * @typedef {Object} ComplexPool
 * @property {string} id
 * @property {string} address
 * @property {string} poolType
 * @property {string} poolTypeVersion
 * @property {ComplexToken[]} tokens
 */

/**
 * @typedef {Object} Balancer
 * @property {string} totalLiquidity
 */

/**
 * @typedef {Object} ComplexBalancerResponse
 * @property {Balancer[]} balancers
 * @property {ComplexPool[]} pools
 */

/**
 * @name getPoolsWithTokenDataFromGQL
 * @description Get the pool data from the Balancer subgraph
 * @returns {ComplexBalancerResponse}
 * @example const pools = await getPoolsWithTokenDataFromGQL();
 * console.log(pools);
 */

async function getPoolsWithTokenDataFromGQL() {
  const query = `{
    balancers(first: 1) {
      totalLiquidity
    }
    pools(first: 100) {
      id
      address
      poolType
      poolTypeVersion
      tokens {
        id
        balance
        oldPriceRate
        priceRate
        symbol
        name
        decimals
        address
        weight
      }
    }
  }`;
  const url =
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zkevm-v2/v0.0.2";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  const { body } = fetch(url, options);
  return body.data;
}

// Example usage:
const balRes = getPoolsWithTokenDataFromGQL();
console.log("balres:", balRes);

/**
 * @name processToken
 * @description Process the token data from the Balancer subgraph
 * @param {ComplexToken} token
 * @returns {Token}
 * @example const token = processToken(balRes.pools[0].tokens[0]);
 * console.log(token);
 **/
function processToken(token) {
  return {
    id: token.id.substring(0, 5),
    balance: token.balance,
    oldPriceRate: token.oldPriceRate,
    priceRate: token.priceRate,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    address: token.address.substring(0, 5),
    weight: token.weight,
  };
}

// Example usage:
const token = processToken(balRes.pools[0].tokens[0]);
console.log(token);

// to each pool, we want to append: user stake (later), pool value in USD, 24h volume and apr
