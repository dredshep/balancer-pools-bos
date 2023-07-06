// create pool thing
// const createPool = async () => {
//   console.log("Create pool");
//   try {
//     const proxyAddress = "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57";

//     const tokens = [
//       // testdso
//       "0x88267177EC1420648Ba7CBFef824f14B9F637985",
//       // jeff tt1
//       "0x756DE3FF9517CA64E9059BA3Dc9a5a24cB5A19FC",
//     ];
//     const balances = [
//       ethers.utils.parseEther("1"),
//       ethers.utils.parseUnits("62607572233557", "wei"),
//     ]; // 1 DAI, ~0.0000626 WETH
//     const weights = [
//       ethers.utils.parseUnits("45", 18),
//       ethers.utils.parseUnits("5", 18),
//     ]; // 45:5 i.e. 90:10
//     const swapFee = ethers.utils.parseEther("0.1");

//     const bActionsInterface = new ethers.utils.Interface(balancerPoolAbi);
//     const data = bActionsInterface.encodeFunctionData("create", [
//       "0x7920BFa1b2041911b354747CA7A6cDD2dfC50Cfd",
//       tokens,
//       balances,
//       weights,
//       swapFee,
//       true,
//     ]);

//     console.log("Create pool encoded data:", { data });
//     // const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const provider = Ethers.provider();
//     const signer = provider.getSigner();
//     const dsProxyContract = new ethers.Contract(
//       proxyAddress,
//       DSProxyAbi.abi,
//       signer
//     );

//     console.log("Executing DS proxy contract");
//     const result = await dsProxyContract.execute(B_ACTIONS_ADDRESS, data);

//     console.log("DS proxy result: ", { result });
//   } catch (e) {
//     console.log("DS proxy error:", e);
//   }
// };

// create pool second attempt
// const createPool2 = async () => {
//   console.log("Create pool");
//   try {
//     const tokens = [
//       // testdso
//       "0x88267177EC1420648Ba7CBFef824f14B9F637985",
//       // jeff tt1
//       "0x756DE3FF9517CA64E9059BA3Dc9a5a24cB5A19FC",
//     ];
//     const balances = [
//       ethers.utils.parseEther("1"),
//       ethers.utils.parseUnits("62607572233557", "wei"),
//     ]; // 1 DAI, ~0.0000626 WETH
//     const weights = [
//       ethers.utils.parseUnits("45", 18),
//       ethers.utils.parseUnits("5", 18),
//     ]; // 45:5 i.e. 90:10
//     const swapFee = ethers.utils.parseEther("0.1");

//     // const bActionsInterface = new ethers.utils.Interface(balancerPoolAbi);
//     const provider = Ethers.provider();
//     const signer = provider.getSigner();
//     const bActionsContract = new ethers.Contract(
//       "0xBA12222222228d8Ba445958a75a0704d566BF2C8", // B_ACTIONS_ADDRESS, -- vault??
//       balancerPoolAbi,
//       signer
//     );

//     let poolCreationPromise;
//     try {
//       console.log("POOL CREATION TRY - Creating pool via direct transaction");
//       poolCreationPromise = bActionsContract.create(
//         "0x7920BFa1b2041911b354747CA7A6cDD2dfC50Cfd", // B_FACTORY_ADDRESS, - WeightedPoolFactory??
//         tokens,
//         balances,
//         weights,
//         swapFee,
//         true
//       );
//     } catch (e) {
//       console.log(
//         "POOL CREATION tryCATCH - Creating pool via direct transaction, trying to .catch, error:",
//         e
//       );
//       poolCreationPromise.catch((e) => {
//         console.log(
//           "POOL CREATION promiseCATCH - Creating pool via direct transaction, .catch, error:",
//           e
//         );
//       });
//     }
//     console.log(
//       "Console log after promise, if nothing is logged, promise is running in background, if nothing logs after, promise failed without catch, or it finished successfully without then."
//     );
//   } catch (e) {
//     console.log("createPool2 outer tryCatch error:", e);
//   }
// };
// createPool2();

const balancerPoolAbiFetch = fetch(
  "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/f693fa47f70791362b0a824350b35241e271ee06/balancerVaultABI.json"
);
// @ts-ignore
const balancerPoolAbi = balancerPoolAbiFetch.body;

/**
 * Fetches the body of a URL
 * @param {string} str The URL to fetch
 * @returns {string} The body of the URL
 */
function fetchBody(str) {
  // @ts-ignore
  return fetch(str).body;
}
const createPool = async () => {
  console.log("Create pool");
  try {
    const tokens = [
      "0x88267177EC1420648Ba7CBFef824f14B9F637985", // TestDSO
      "0x756DE3FF9517CA64E9059BA3Dc9a5a24cB5A19FC", // Jeff TT1
    ];
    const weights = [
      ethers.utils.parseEther("45"),
      ethers.utils.parseEther("5"),
    ]; // 45:5 i.e. 90:10
    const swapFee = ethers.utils.parseEther("0.1");
    const owner = "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57"; // The owner address
    const name = "Dred Test Pool, Thanks ChatGPT!"; // The name of the pool
    const symbol = "Weighted-Dred"; // The symbol of the pool
    const salt = ethers.utils.hexZeroPad("0x1", 32); // Adjust accordingly

    const provider = Ethers.provider();
    const signer = provider.getSigner();
    const poolFactory = new ethers.Contract(
      "0x7920BFa1b2041911b354747CA7A6cDD2dfC50Cfd", // WeightedPoolFactory address
      fetchBody(
        "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/19f0870f18af90930f172cb18ed1572343736993/balancerWeightedPoolFactoryABI.json"
      ), // The ABI of the WeightedPoolFactory
      signer
    );

    const gasLimit = 6000000; // Adjust accordingly
    // Create the pool
    const promise = poolFactory
      .create(
        // const createTx = await
        name,
        symbol,
        tokens,
        weights,
        [],
        swapFee,
        owner,
        salt,
        { gasLimit }
      )
      .then?.((createTx) => {
        // Wait for the tx to be mined
        const createReceipt = createTx.wait();

        console.log("Pool created:", { createReceipt });
        return createReceipt;
      })
      ?.catch?.((e) => {
        console.log("INNER CATCH, Error creating pool:", e);
      });
  } catch (e) {
    console.log("Error:", e);
  }
};
createPool();
