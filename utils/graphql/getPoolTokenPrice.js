/**
 * @description Get the price of a pool token
 * @returns {string}
 * @example const price = getTokenPrice("0x..."); //=> "1"
 */
function getTokenPrice(poolTokenId) {
  const query = `{
    poolToken(id: "${poolTokenId}") {
      priceRate
    }
  }`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  const url =
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zkevm-v2/v0.0.2";
  const { body } = fetch(url, options);
  return body.data.poolToken.priceRate;
}

// Example usage:
const price = getTokenPrice("0x..."); //=> "1"
console.log(price);
