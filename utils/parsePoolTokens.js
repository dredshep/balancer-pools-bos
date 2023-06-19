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

// To import it, as far as I know, you have to copy and paste the function (lines 7 to 28) into your code.

// obj we're parsing:
/* [
    {
        "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006",
        "tokens": [
            {
                "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0x02c9dcb975262719a61f9b40bdf0987ead9add3a",
                "balance": "5192296858534827.628530496329220095"
            },
            {
                "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            },
            {
                "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0xdbf7b9f1d2bfba14e42709f84dda3187ee410e38",
                "balance": "0"
            }
        ]
    },
    {
        "id": "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
        "tokens": [
            {
                "id": "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "6.317619362716334168"
            },
            {
                "id": "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0x1e4a5963abfd975d8c9021ce480b42188849d41d",
                "balance": "14.807211"
            },
            {
                "id": "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                "balance": "16"
            }
        ]
    },
    {
        "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005",
        "tokens": [
            {
                "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x32f03464fdf909fdf3798f87ff3712b10c59bd86",
                "balance": "5192296858534827.628530496329220095"
            },
            {
                "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            },
            {
                "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x698caed853be9cea96c268f565e2b61d3b2bcda4",
                "balance": "0"
            }
        ]
    },
    {
        "id": "0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000",
        "tokens": [
            {
                "id": "0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000-0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0"
            },
            {
                "id": "0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            }
        ]
    },
    {
        "id": "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008",
        "tokens": [
            {
                "id": "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008-0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "5.519882301934390094"
            },
            {
                "id": "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008-0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4",
                "balance": "15.881457045241895678"
            }
        ]
    },
    {
        "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002",
        "tokens": [
            {
                "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0"
            },
            {
                "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            },
            {
                "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x6f5f794a3cef904b8517c4c311de2fa837ff24a0",
                "balance": "0"
            }
        ]
    },
    {
        "id": "0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001",
        "tokens": [
            {
                "id": "0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001-0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0"
            },
            {
                "id": "0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            }
        ]
    },
    {
        "id": "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009",
        "tokens": [
            {
                "id": "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0.009071580559576606"
            },
            {
                "id": "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009-0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4",
                "balance": "19.658457268622512151"
            }
        ]
    },
    {
        "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003",
        "tokens": [
            {
                "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0x0c6052254551eae3ecac77b01dfcf1025418828f",
                "balance": "0"
            },
            {
                "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            },
            {
                "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0xac4b72c01072a52b73ca71105504f1372efcce0d",
                "balance": "5192296858534827.628530496329220095"
            }
        ]
    },
    {
        "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004",
        "tokens": [
            {
                "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0x4638ab64022927c9bd5947607459d13f57f1551c",
                "balance": "0"
            },
            {
                "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0"
            },
            {
                "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0xbfd65c6160cfd638a85c645e6e6d8acac5dac935",
                "balance": "5192296858534827.628530496329220095"
            }
        ]
    }
]
*/

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

// To import it, as far as I know, you have to copy and paste the function (lines 20 to 51) into your code.

// test the whole code:

const test = () => {
  const pools = getPoolData();
  const parsed = parsePools(pools);
  console.log(parsed);
};

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
 * @returns {ParsedPool[]}
 * @example parsePools(poolResponse).then(console.log)
 */
// function parsePools(pools) {
// 	// constraints, we cannot use `Promise`, we cannot use `async` functions, we cannot use `await` keyword
// 	// find a way to parse all the tokens and to return a full object despite the fact that we have to use `Promise.all` to get the balances
// 	// but Promise is not allowed, and thus Promise.all is not allowed

function parseTokens(tokens, index, result, callback) {
  if (index >= tokens.length) {
    callback(null, result);
  } else {
    var address = tokenIdToAddress(tokens[index].id);
    getTokenInfo(address)
      .then((info) => {
        result.push({
          ...info,
          balance: tokens[index].balance,
        });
        parseTokens(tokens, index + 1, result, callback);
      })
      .catch((err) => callback(err));
  }
}

/**
 *
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
          getTokenInfo(address).then((info) => {
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

const pools = getPoolData();

parsePools(pools, (err, result) => {
  if (err) {
    console.log("parsePools callback error", err);
  } else {
    console.log("parsePools callback success", result);
  }
});
/*
export interface Pool {
    id:     string;
    tokens: Token[];
}

export interface Token {
    id:       string;
    balance:  string;
    decimals: number;
    symbol:   string;
    name:     string;
}
*/

/*
Result: 

[
    {
        "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006",
        "tokens": [
            {
                "id": "0x02c9dcb975262719a61f9b40bdf0987ead9add3a",
                "balance": "5192296858534827.628530496329220095",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Linear Pool"
            },
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0xdbf7b9f1d2bfba14e42709f84dda3187ee410e38",
                "balance": "0",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Yearn Token"
            }
        ]
    },
    {
        "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x698caed853be9cea96c268f565e2b61d3b2bcda4",
                "balance": "0",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Diesel Token"
            },
            {
                "id": "0x32f03464fdf909fdf3798f87ff3712b10c59bd86",
                "balance": "5192296858534827.628530496329220095",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Linear Pool"
            }
        ]
    },
    {
        "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x0c6052254551eae3ecac77b01dfcf1025418828f",
                "balance": "0",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock ERC4626 Token"
            },
            {
                "id": "0xac4b72c01072a52b73ca71105504f1372efcce0d",
                "balance": "5192296858534827.628530496329220095",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Linear Pool"
            }
        ]
    },
    {
        "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x4638ab64022927c9bd5947607459d13f57f1551c",
                "balance": "0",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Static AToken"
            },
            {
                "id": "0xbfd65c6160cfd638a85c645e6e6d8acac5dac935",
                "balance": "5192296858534827.628530496329220095",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Linear Pool"
            }
        ]
    },
    {
        "id": "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0.009071580559576606",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4",
                "balance": "19.658457268622512151",
                "decimals": 18,
                "symbol": "DAI",
                "name": "Dai Stablecoin"
            }
        ]
    },
    {
        "id": "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
        "tokens": [
            {
                "id": "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
                "balance": "16",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
            },
            {
                "id": "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
                "balance": "14.807211",
                "decimals": 6,
                "symbol": "USDT",
                "name": "Tether USD"
            },
            {
                "id": "0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "6.317619362716334168",
                "decimals": 18,
                "symbol": "BAL",
                "name": "Balancer"
            }
        ]
    },
    {
        "id": "0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0",
                "decimals": 18,
                "symbol": "BAL",
                "name": "Balancer"
            }
        ]
    },
    {
        "id": "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008",
        "tokens": [
            {
                "id": "0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4",
                "balance": "15.881457045241895678",
                "decimals": 18,
                "symbol": "DAI",
                "name": "Dai Stablecoin"
            },
            {
                "id": "0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "5.519882301934390094",
                "decimals": 18,
                "symbol": "BAL",
                "name": "Balancer"
            }
        ]
    },
    {
        "id": "0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0",
                "decimals": 18,
                "symbol": "BAL",
                "name": "Balancer"
            }
        ]
    },
    {
        "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002",
        "tokens": [
            {
                "id": "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
                "balance": "0",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            {
                "id": "0x120ef59b80774f02211563834d8e3b72cb1649d6",
                "balance": "0",
                "decimals": 18,
                "symbol": "BAL",
                "name": "Balancer"
            },
            {
                "id": "0x6f5f794a3cef904b8517c4c311de2fa837ff24a0",
                "balance": "0",
                "decimals": 18,
                "symbol": "TEST",
                "name": "DO NOT USE - Mock Composable Stable Pool"
            }
        ]
    }
]
*/
