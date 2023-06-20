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

const abi =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

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

// test:

// connect wallet automatically

// check if account connected
const sender = Ethers.send("eth_requestAccounts", [])[0];

function LoginRequestComponent() {
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Please login first</h2>
      <br />
      <Web3Connect connectLabel="Connect with Web3" />
    </div>
  );
}
if (!sender) {
  // @ts-ignore
  return <LoginRequestComponent />;
}

// function NetworkChangeRequest() {
//   return (
//     <Theme>
//       <div className="swap-main-container pt-5">
//         To proceed, kindly switch to {forceNetwork}.
//         {!sender && (
//           <div className="swap-button-container">
//             <Web3Connect
//               className="swap-button-enabled swap-button-text p-2"
//               connectLabel="Connect with Web3"
//             />
//           </div>
//         )}
//       </div>
//     </Theme>)
// }

// check correct network
// if (forceNetwork && network && forceNetwork !== network) {
// network check is ethereum

/**
 * @description Fetches a URL and returns the body string synchronously
 * @param {string} url - The URL to fetch
 * @returns {string} The body string
 * @example const body = fetchSync("https://example.com");
 */
function fetchGetSync(url) {
  // @ts-ignore
  return fetch(url).body;
}

// const abi = fetchGetSync(
//   "https://raw.githubusercontent.com/dredshep/dev/main/abi.json"
// );

// vault: 0xBA12222222228d8Ba445958a75a0704d566BF2C8
// weth pool: 0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9
// user address: 0xe25c0e141b98a5a449fbd70cfda45f6088486c74

const vault = new ethers.Contract(
  "0xBA12222222228d8Ba445958a75a0704d566BF2C8", // address
  abi, // erc20 abi
  Ethers.provider().getSigner()
);

State.init({
  // {poolAddress,balance}
  checkedChainInfo: false,
  userBalances: [],
  // chainInfo: {},
  chainId: "",
  chainName: "",
  errorWrongNetwork: false,
});

// const {
//   /** @type {{poolAddress:string,balance:string}[]} */
//   userBalances,
//   /** @type {ChainInfoObject} */
//   chainInfo,
//   /** @type {boolean} */
//   errorWrongNetwork,
// } = state;

const balance = vault
  .balanceOf("0xe25c0e141b98a5a449fbd70cfda45f6088486c74")
  .then((/** @type {any} */ balance) => {
    // undo big number into a string
    return ethers.utils.formatUnits(balance, 18);
  })
  .then((balance) => {
    State.update({
      userBalances: [
        {
          poolAddress: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
          balance: balance,
        },
      ],
    });
  });

// /** @type {ChainInfoObject} */
// const chainInfoObject = {
//   "0x1": {
//     name: "Ethereum Mainnet",
//     chainId: "0x1",
//     shortName: "eth",
//     chain: "ETH",
//     network: "mainnet",
//     networkId: "1",
//     nativeCurrency: {
//       name: "Ether",
//       symbol: "ETH",
//       decimals: 18,
//     },
//     rpc: ["https://main-light.eth.linkpool.io"],
//     faucets: [],
//     explorers: [
//       {
//         name: "etherscan",
//         url: "https://etherscan.io",
//         standard: "EIP3091",
//       },
//     ],
//   },
//   // goerli
//   "0x5": {
//     name: "Goerli",
//     chainId: "0x5",
//     shortName: "gor",
//     chain: "ETH",
//     network: "goerli",
//     networkId: "5",
//     nativeCurrency: {
//       name: "Ether",
//       symbol: "ETH",
//       decimals: 18,
//     },
//     rpc: ["https://rpc.goerli.mudit.blog/"],
//     faucets: [
//       "https://goerli-faucet.slock.it/?address=${ADDRESS}",
//       "https://faucet.goerli.mudit.blog",
//     ],
//     explorers: [],
//   },
//   // zkEVM
//   "0x44d": {
//     name: "zkEVM Mainnet",
//     chainId: "0x44d",
//     shortName: "zkEVM",
//     chain: "ETH",
//     network: "mainnet",
//     networkId: "44",
//     nativeCurrency: {
//       name: "Ether",
//       symbol: "ETH",
//       decimals: 18,
//     },
//     rpc: ["https://rpc.ankr.com/polygon_zkevm"],
//     faucets: [],
//     explorers: [
//       {
//         name: "polygonscan",
//         url: "https://zkevm.polygonscan.com",
//         standard: "EIP3091",
//       },
//     ],
//   },
// };

// /**
//  * @param {string} chainId
//  */
// function switchToChainId(chainId) {
//   // return window.ethereum.request({
//   //   method: "wallet_switchEthereumChain",
//   //   params: [{ chainId: chainId }],
//   // });
//   Ethers.send("wallet_switchEthereumChain", [{ chainId: chainId }]).catch(
//     (/** @type {{ code: number; }} */ error) => {
//       // This error code indicates that the chain has not been added to MetaMask.
//       // const hexId = ethers.utils.hexlify(chainId);
//       if (error.code === 4902) {
//         const chainInfo = chainInfoObject[chainId];
//         const params = {
//           chainId: chainId,
//           chainName: chainInfo.name,
//           nativeCurrency: chainInfo.nativeCurrency,
//           rpcUrls: chainInfo.rpc,
//           blockExplorerUrls: chainInfo.explorers,
//         };
//         return Ethers.send("wallet_addEthereumChain", [params]);
//       }
//       // handle other "switch" errors
//       // examples: 1. handleNoEthereumProviderError, 2. handleChainChanged, 3. handleAccountsChanged, 4. handleDisconnect
//     }
//   );
// }

// Ethers.on("chainChanged", (/** @type {string} */ chainId) => {
//   if (chainId !== state.chainInfo.chainId) {
//     const hexId = ethers.utils.hexlify(chainId);
//     State.update({
//       chainId: hexId,
//       chainName: chainInfoObject[hexId].name,
//     });
//   }
//   // if chain id is not in chainInfoObject, switch state to errorWrongNetwork
//   if (!chainInfoObject[chainId]) {
//     State.update({ errorWrongNetwork: true });
//   } else {
//     State.update({ errorWrongNetwork: false });
//   }
// });

// // get ethers chain id and update state
// Ethers.provider()
//   .getNetwork()
//   .then((/** @type {{ chainId: string | number; }} */ network) => {
//     const hexId = ethers.utils.hexlify(network.chainId);
//     State.update({
//       // convert from number to hex
//       chainId: hexId,
//       chainName: chainInfoObject[hexId].name,
//       checkedChainInfo: true,
//     });
//   })
//   .catch((/** @type {any} */ error) => {
//     console.log("ERROR GRABBING INITIAL NETWORK", error);
//   });
// // Ethers.send("eth_chainId").then((chainId) => {
// //   State.update({ chainId });
// // });

// function MainComponent() {
//   // id and name
//   /** @type {string} */
//   const chainId = state.chainId;
//   /** @type {string} */
//   const chainName = state.chainName;
//   /** @type {boolean} */
//   const errorWrongNetwork = state.errorWrongNetwork;
//   /** @type {boolean} */
//   const checkedChainInfo = state.checkedChainInfo;
//   return (
//     <div className="container">
//       <h1>Chain Switcher:</h1>
//       <table className="table" style={{ maxWidth: "300px" }}>
//         <tbody>
//           <tr>
//             <td>Current Chain:</td>
//             <td>
//               {chainName} {chainId}
//             </td>
//           </tr>
//           <tr>
//             <td>Checked Chain Info:</td>
//             <td>{checkedChainInfo.toString()}</td>
//           </tr>
//           <tr>
//             <td>Chain Name:</td>
//             <td>{chainName}</td>
//           </tr>
//           <tr>
//             <td>Wrong Network Error:</td>
//             <td>{errorWrongNetwork.toString()}</td>
//           </tr>
//         </tbody>
//       </table>
//       {errorWrongNetwork && (
//         <h2 className="text-danger">Wrong Network, please switch</h2>
//       )}
//       {/* <button
//         onClick={() => {
//           switchToChainId("0x1");
//         }}
//       >
//         Switch to Mainnet
//       </button>
//       <button
//         onClick={() => {
//           switchToChainId("0x2a");
//         }}
//       > */}
//       {/* add a small gap */}
//       <div
//         className="d-flex flex-column gap-2"
//         style={{ maxWidth: "300px", marginLeft: "0" }}
//       >
//         {Object.keys(chainInfoObject).map((chainId) => {
//           return (
//             <button
//               onClick={() => {
//                 switchToChainId(chainId);
//               }}
//               key={chainId}
//             >
//               Switch to {chainInfoObject[chainId].name}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // @ts-ignore
// return <MainComponent />;
