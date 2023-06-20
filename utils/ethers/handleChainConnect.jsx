//@ts-check

/** @typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** @typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** @typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** @typedef {Object} SPoolId @property {string} totalWeight */
/** @typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens */
/** @typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** @typedef {Object} TokenWeights @property {string} address @property {string} weight */
/** @typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights[]} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens */
/** @typedef {Object} TransformedData @property {SBalancer[]} balancers @property {TransformedPool[]} pools */
/** @typedef {Object} StatePool @property {string} id @property {boolean} approved @property {boolean} depositing @property {boolean} withdrawing @property {boolean} approving @property {boolean} loading */
/** @typedef {Object} ChainInfo @property {string} name @property {string} chainId @property {string} shortName @property {string} chain @property {string} network @property {string} networkId @property {{ name: string, symbol: string, decimals: number }} nativeCurrency @property {string[]} rpc @property {string[]} faucets @property {string[]} explorers */
/** @typedef {Object.<string, ChainInfo>} ChainInfoObject */

State.init({
  // {poolAddress,balance}
  checkedChainInfo: false,
  userBalances: [],
  // chainInfo: {},
  chainId: "",
  chainName: "",
  errorWrongNetwork: false,
});

/** @type {ChainInfoObject} */
const chainInfoObject = {
  "0x1": {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    shortName: "eth",
    chain: "ETH",
    network: "mainnet",
    networkId: "1",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpc: ["https://main-light.eth.linkpool.io"],
    faucets: [],
    explorers: [
      "https://etherscan.io",
      // {
      //   name: "etherscan",
      //   url: "https://etherscan.io",
      //   standard: "EIP3091",
      // },
    ],
  },
  // goerli
  "0x5": {
    name: "Goerli",
    chainId: "0x5",
    shortName: "gor",
    chain: "ETH",
    network: "goerli",
    networkId: "5",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpc: ["https://rpc.goerli.mudit.blog/"],
    faucets: [
      "https://goerli-faucet.slock.it/?address=${ADDRESS}",
      "https://faucet.goerli.mudit.blog",
    ],
    explorers: ["https://goerli.etherscan.io"],
  },
  // zkEVM
  "0x44d": {
    name: "zkEVM Mainnet",
    chainId: "0x44d",
    shortName: "zkEVM",
    chain: "ETH",
    network: "mainnet",
    networkId: "44",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpc: ["https://rpc.ankr.com/polygon_zkevm"],
    faucets: [],
    explorers: [
      "https://zkevm.polygonscan.com",
      // {
      //   name: "polygonscan",
      //   url: "https://zkevm.polygonscan.com",
      //   standard: "EIP3091",
      // },
    ],
  },
};

function removeLeadingZero(hexString) {
  // Remove '0x' prefix if present
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  // Remove leading zero if present
  if (hexString.startsWith("0")) {
    hexString = hexString.slice(1);
  }

  // Add '0x' prefix and return the modified string
  return "0x" + hexString;
}

/**
 * @param {string} chainId
 */
function switchToChainId(chainId) {
  // return window.ethereum.request({
  //   method: "wallet_switchEthereumChain",
  //   params: [{ chainId: chainId }],
  // });
  try {
    let send;
    try {
      send = Ethers.send("wallet_switchEthereumChain", [
        { chainId: removeLeadingZero(chainId) },
      ]);
    } catch (error) {
      console.log(
        "Half-outside, in the catcher for `send = Ethers.send`",
        error
      );
      try {
        send.catch((/** @type {{ code: number; }} */ error) => {
          console.log("(INSIDE) Error while switching to chain", error);
        });
      } catch (error) {
        console.log("Half-outside, in the catcher for `send.catch`", error);
      }
    }
  } catch (error) {
    console.log("(OUTSIDE) Error while switching to chain", error);
    try {
      const chainInfo = chainInfoObject[chainId];
      const params = {
        chainId: removeLeadingZero(chainId),
        chainName: chainInfo.name,
        nativeCurrency: chainInfo.nativeCurrency,
        rpcUrls: chainInfo.rpc,
        blockExplorerUrls: chainInfo.explorers,
      };
      return Ethers.send("wallet_addEthereumChain", [params]).catch(
        (/** @type {{ code: number; }} */ error) => {
          console.log("(INSIDE) Error while adding chain", error);
        }
      );
    } catch (error) {
      console.log("(OUTSIDE) Error while adding to chain", error);
    }
  }
}

// listen for rpc error
function listenForRpcError() {
  return Ethers.on("rpcError", (/** @type {{ code: number; }} */ error) => {
    console.log("RPC ERROR NOTED", error);
  });
}

//// Changing the chain refreshes the whole page, so we don't need to listen for chain changes.
//// in fact, change events are not even fired when the chain is changed.
// function listenForChainChange() {
//   return Ethers.on("chainChanged", (/** @type {string} */ chainId) => {
//     if (chainId !== state.chainInfo.chainId) {
//       const hexId = removeLeadingZero(ethers.utils.hexlify(chainId));
//       State.update({
//         chainId: hexId,
//         chainName: chainInfoObject[hexId].name,
//       });
//       // if chain id is not in chainInfoObject, switch state to errorWrongNetwork
//       if (!chainInfoObject[chainId]) {
//         console.log("we don't have this id", chainId);
//         State.update({ errorWrongNetwork: true });
//       } else {
//         console.log("we have this id", chainId);
//         State.update({ errorWrongNetwork: false });
//       }
//     }
//   });
// }

// try {
//   listenForChainChange();
// } catch (error) {
//   console.log("Error while listening for chain change", error);
// }

// get ethers chain id and update state
function getNetwork() {
  return Ethers.provider()
    .getNetwork()
    .then((/** @type {{ chainId: string | number; }} */ network) => {
      const hexId = removeLeadingZero(ethers.utils.hexlify(network.chainId));
      State.update({
        // convert from number to hex
        chainId: hexId,
        chainName: chainInfoObject[hexId].name,
        checkedChainInfo: true,
      });
      if (!chainInfoObject[hexId]) {
        // console.log("we don't have this id", hexId);
        State.update({ errorWrongNetwork: true });
      } else {
        // console.log("we have this id", hexId);
        State.update({ errorWrongNetwork: false });
      }
    })
    .catch((error) => {
      console.log("Error while getting network", error);
    });
}

try {
  getNetwork();
} catch (error) {
  console.log("2nd TryCatch (promise?): Error while getting network", error);
}
// Ethers.send("eth_chainId").then((chainId) => {
//   State.update({ chainId });
// });

function MainComponent() {
  // id and name
  /** @type {string} */
  const chainId = state.chainId;
  /** @type {string} */
  const chainName = state.chainName;
  /** @type {boolean} */
  const errorWrongNetwork = state.errorWrongNetwork;
  /** @type {boolean} */
  const checkedChainInfo = state.checkedChainInfo;
  return (
    <div className="container">
      <h1>Chain Switcher:</h1>
      <table className="table" style={{ maxWidth: "300px" }}>
        <tbody>
          <tr>
            <td>Current chain id:</td>
            <td>{chainId}</td>
          </tr>
          <tr>
            <td>Initial chain check:</td>
            <td>{JSON.stringify(checkedChainInfo)}</td>
          </tr>
          <tr>
            <td>Current chain:</td>
            <td className={!chainName ? "text-warning" : ""}>
              {chainName || "Unknown"}
            </td>
          </tr>
          <tr>
            <td>Wrong Network Error:</td>
            <td>{JSON.stringify(errorWrongNetwork)}</td>
          </tr>
        </tbody>
      </table>
      {errorWrongNetwork && (
        <h5
          className="text-warning mb-2"
          style={{ paddingBottom: "8px", paddingLeft: "6px" }}
        >
          Wrong Network, please switch
        </h5>
      )}
      {/* <button
        onClick={() => {
          switchToChainId("0x1");
        }}
      >
        Switch to Mainnet
      </button>
      <button
        onClick={() => {
          switchToChainId("0x2a");
        }}
      > */}
      {/* add a small gap */}
      <div
        className="d-flex flex-column gap-2"
        style={{ maxWidth: "300px", marginLeft: "0" }}
      >
        {Object.keys(chainInfoObject).map((chainId) => {
          return (
            <button
              onClick={() => {
                switchToChainId(chainId);
              }}
              key={chainId}
            >
              Switch to {chainInfoObject[chainId].name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// @ts-ignore
return <MainComponent />;
