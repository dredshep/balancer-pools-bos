/*
sample request:

  token (id:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
    symbol
    decimals
    name
    latestPrice {
      id
    }
    latestUSDPrice
    address    
  }

sample response:
    {"token": {
      "symbol": "WETH",
      "decimals": 18,
      "name": "Wrapped Ether",
      "latestPrice": {
        "id": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-0x60d604890feaa0b5460b28a424407c24fe89374a"
      },
      "latestUSDPrice": "1716.845937559854960122183778713954",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    }
  }
*/

const url =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";

/**
 * @typedef {Object} Token
 * @property {string} symbol
 * @property {string} decimals
 * @property {string} name
 * @property {string} latestUSDPrice
 * @property {string} address
 * @property {string} id
 * @property {string} latestPrice
 */

/**
 * @description Get the token data from the Balancer subgraph
 * @param {string} id
 * @returns {Token[]}
 * @example const tokens = await getTokenInfoFromGraphQL();
 * console.log(tokens);
 **/
async function getTokenInfoFromGraphQL(id) {
  const query = `
    {
      token(id: "${id}") {
        symbol
        decimals
        name
        latestPrice {
          id
          pricingAsset
          price
        }
        latestUSDPrice
        address
      }
    }
  `;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };

  /** @type {Token[]} */
  const token = fetch(url, options).body.data;

  return token;
}

// Example usage:
const token = getTokenInfoFromGraphQL(
  // wbtc NOT ZKEVM
  // "0xf4eb217ba2454613b15dbdea6e5f22276410e89e"

  // tether ZKEVM
  // "0x1e4a5963abfd975d8c9021ce480b42188849d41d"
  // bb-o-USDT ZKEVM <-- main reference, priced by bb-o-USD
  // "0x4b718e0e2fea1da68b763cd50c446fba03ceb2ea"
  // bb-o-USD ZKEVM <-- reference for bb-o-USDT
  "0xe274c9deb6ed34cfe4130f8d0a8a948dea5bb286"
);
// console.log(token);
return <pre>{JSON.stringify(token, null, 2)}</pre>;
