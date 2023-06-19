/**
 * @typedef {Object} TokenInfo
 * @property {number} decimals
 * @property {string} symbol
 * @property {string} name
 */

/**
 * @description Get the decimals, symbol, and name of a token through an ERC20 address
 * @param {string} address ERC20 address
 * @returns {Promise<TokenInfo>}
 * @example const {decimals, symbol, name} = getTokenInfo("0x1e4a5963abfd975d8c9021ce480b42188849d41d");
 */
function getTokenInfo(address) {
  /** @type {string} */
  const abi = fetch(
    "https://raw.githubusercontent.com/dredshep/dev/main/abi.json"
  ).body;
  // ERC20 contract, all methods can be found here: https://zkevm.polygonscan.com/address/0x1e4a5963abfd975d8c9021ce480b42188849d41d#readContract
  // more on ethers.js contract handling: https://docs.ethers.io/v5/api/contract/contract/#Contract--instances
  // do note that what's in the "properties" section is stored in Ethers (such as Ethers.provider(); signer is Ethers.provider().getSigner())
  const contract = new ethers.Contract(address, abi, Ethers.provider());
  // decimals
  return contract.decimals().then((decimals) =>
    // symbol
    contract.symbol().then((symbol) =>
      // name
      contract.name().then(
        (name) =>
          /** @type {TokenInfo} */
          ({
            decimals,
            symbol,
            name,
          })
      )
    )
  );
}

function tokenIdToAddress(tokenId) {
  return tokenId.split("-")[1];
}

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

/**
 * @typedef {Object} ParsedPool
 * @property {string} id
 * @property {Token[] & {balance: string}} tokens
 * @property {string} totalBalance
 */

/**
 * @typedef {Object} Token
 * @property {string} id
 * @property {string} balance
 */

/**
 * @description Parse the pools from the response of the API
 * @param {Pool[]} pools
 * @param {function} callback
 */
function parsePools(pools, callback) {
  const processedPools = []; // Our final result will be pushed into this array
  let completedPoolsCount = 0; // Total number of pools we've finished processing

  // Now, iterate over the pools
  try {
    // console.log("pools", pools);
    pools.forEach((pool) => {
      // For each pool, we'll create a new object with the pool id and an empty array of tokens
      const processedPool = {
        id: pool.id,
        /** @type {(Token & TokenInfo)[]} */ tokens: [],
      };
      //   console.log("processedPool", processedPool);

      let completedTokensCount = 0; // Total number of tokens we've finished processing for this pool

      try {
        // Iterate over the tokens in each pool
        pool.tokens.forEach((token) => {
          const address = tokenIdToAddress(token.id);

          // getTokenInfo is thenable
          getTokenInfo(address)
            .then((info) => {
              try {
                /** @type {Token & TokenInfo} */
                const token = {
                  id: address,
                  balance: token.balance,
                  ...info,
                };
                // Add the processed token info to the pool
                processedPool.tokens.push(token);
              } catch (err) {
                callback("error pushing token info to pool " + err);
              }

              // We've processed one more token
              completedTokensCount++;

              // If we've processed all tokens for this pool, add the processedPool to the array
              if (completedTokensCount === pool.tokens.length) {
                processedPools.push(processedPool);

                // We've processed one more pool
                completedPoolsCount++;

                // If we've processed all pools, call the callback with the result
                if (completedPoolsCount === pools.length) {
                  callback(null, processedPools);
                }
              }
            })
            .catch((err) => {
              callback("error at getTokenInfo " + JSON.stringify(err));
            });
        });
      } catch (err) {
        callback("error at second loop level " + err);
      }
    });
  } catch (err) {
    callback("error at first loop level " + err);
  }
}

// const pools = getPoolData();

State.init({
  pools: [],
});
const { pools } = state;
parsePools(getPoolData(), (err, result) => {
  if (err) {
    console.log("parsePools callback error", err);
  } else {
    console.log("parsePools callback success", result);
    State.update({ pools: result });
  }
});

return (
  <table
    className="table table-striped"
    style={{ backgroundColor: "#f8f9fa", color: "#333" }}
  >
    <thead>
      <tr>
        <th
          style={{
            backgroundColor: "#343a40",
            color: "#fff",
            textAlign: "right",
          }}
        >
          Pool ID
        </th>
        <th
          style={{
            backgroundColor: "#343a40",
            color: "#fff",
            textAlign: "right",
          }}
        >
          Symbol
        </th>
        <th
          style={{
            backgroundColor: "#343a40",
            color: "#fff",
            textAlign: "right",
          }}
        >
          Balance
        </th>
      </tr>
    </thead>
    <tbody>
      {pools.map((pool) =>
        pool.tokens.map((token, i) => (
          <tr key={pool.id + token.id}>
            {i === 0 ? (
              <td style={{ textAlign: "right" }}>{pool.id.substring(2, 6)}</td>
            ) : (
              <td>&nbsp;</td>
            )}
            <td style={{ textAlign: "right", fontWeight: 700 }}>
              {token.symbol}
            </td>
            <td style={{ textAlign: "right" }}>{token.balance || "error"}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
