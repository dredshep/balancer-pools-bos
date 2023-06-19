/**
 * @typedef {Object} Token
 * @property {string} id
 * @property {string} balance
 */

/**
 * @typedef {Object} Pool
 * @property {string} id
 * @property {Token[]} tokens
 */

/**
 * @description Get the pool data from the Balancer subgraph
 * @returns {Pool[]}
 * @example const pools = await getPoolData();
 * console.log(pools);
 * //=> [ { id: '0x...', tokens: [ { id: '0x...', balance: '63' } ] } ]
 */
function getPoolData() {
  const query = `
		{
			balancers(first: 3) {
				id
				poolCount
				totalLiquidity
			}
			pools(first: 25) {
				id
				tokens {
					id
					balance
				}
			}
		}
	`;
  const url =
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  /** @type {Pool[]} */
  const pools = fetch(url, options).body.data.pools;

  return pools;
}

// Example usage:
const pools = getPoolData();
return <pre>{JSON.stringify(pools, null, 2)}</pre>;
