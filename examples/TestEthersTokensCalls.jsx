State.init({
  provider: "unfetched",
});

/**
 * @description Get the decimals, symbol, and name of a token through an ERC20 address
 * @param {string} address ERC20 address
 * @returns {Promise<{decimals, symbol, name}>}
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
      contract.name().then((name) => ({
        decimals,
        symbol,
        name,
      }))
    )
  );
}

getTokenInfo("0x1e4a5963abfd975d8c9021ce480b42188849d41d").then((tokenInfo) => {
  console.log({ tokenInfo });
});

return <>a</>;
