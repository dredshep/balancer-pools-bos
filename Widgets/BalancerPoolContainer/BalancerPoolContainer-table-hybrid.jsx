//@ts-check

/** @typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** @typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** @typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** @typedef {Object} SPoolId @property {string} totalWeight */
/** @typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} totalLiquidity @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens @property {string} owner @property {number} createTime*/
/** @typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** @typedef {Object} _TokenWeights @property {string} address @property {number | null} weight */
/** @typedef {_TokenWeights[] | undefined} TokenWeights */
/** @typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights | undefined} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens @property {string} owner @property {number} createTime @property {ResultToken[] | undefined} balancerTokens */
/** @typedef {Object} TransformedData @property {SBalancer[]} balancers @property {TransformedPool[]} pools */
/** @typedef {Object} StatePool @property {string} id @property {boolean} approved @property {boolean} depositing @property {boolean} withdrawing @property {boolean} approving @property {boolean} loading */
/** @typedef {Object} PoolAndBalance @property {string} poolAddress @property {string | undefined} balance */

/**
 * @name formatAndAbbreviateNumber
 * @description Formats a number with commas as thousands separators and abbreviates it with a letter suffix
 * @param {number} num - The number to format and abbreviate
 * @returns {string} The formatted and abbreviated number as a string
 * @example const formattedNumber = formatAndAbbreviateNumber(1234567.89);
 * console.log(formattedNumber); // "1.23M"
 */
function formatAndAbbreviateNumber(num) {
  let counter = 0;
  const abbreviations = ["", "K", "M", "B", "T", "Quadrillion", "Quintillion"];

  while (num >= 1000) {
    num /= 1000;
    counter++;
  }

  const stringNum = num.toFixed(2);

  // Split number into integer and decimal parts
  let parts = Number(stringNum).toString().split(".");
  // Add commas every three digits to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".") + abbreviations[counter];
}

/**
 * @name calculateTotalValueLocked
 * @description Calculate the total value locked in a pool
 * @param {SToken[]} tokens
 * @returns {{ num: number, str: string }} The total value locked as a number and a string
 * @example const totalValueLocked = calculateTotalValueLocked(pool);
 * console.log(totalValueLocked);
 */
function calculateTotalValueLocked(tokens) {
  const totalLiquidity = tokens.reduce((acc, token) => {
    const usdBalance =
      parseFloat(token.totalBalanceUSD) / Number("1e" + token.decimals);
    if (usdBalance) {
      return acc + usdBalance;
    }
    return acc;
  }, 0);
  return {
    num: totalLiquidity,
    str: formatAndAbbreviateNumber(totalLiquidity),
  };
}

/**
 * @name calculateTokenWeights
 * @description Calculate the token weights in a pool
 * @param {SToken[]} tokens
 * @returns {{
 * address: string,
 * weight: number
 * }[]}
 * @example const tokenWeights = calculateTokenWeights(pool, tokens);
 * console.log(tokenWeights);
 */
function calculateTokenWeights(tokens) {
  const totalValueLocked = calculateTotalValueLocked(tokens);
  const getWeight = (
    /** @type {number} */ value,
    /** @type {number} */ decimals
  ) => value / (Number(totalValueLocked.num) * Number("1e" + decimals));
  const weights = tokens.map((token) => {
    const floated = parseFloat(token.totalBalanceUSD);
    const weight = floated === 0 ? 0 : getWeight(floated, token.decimals);
    return {
      address: token.address,
      weight: parseFloat(weight.toFixed(1)),
      token,
    };
  });
  return weights;
}

// const zkEVMGraphQLUri =
//   // "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";
//   "https://api.studio.thegraph.com/proxy/24660/balancer-sepolia-v2/version/latest";

/**
 * @name getGraphQlQuerySync
 * @description Synchronously sends a GraphQL query to the specified URI and returns the response data
 * @param {string} query - The GraphQL query to send
 * @returns {SBalancerGQLResponse} The response data from the GraphQL query
 * @example const data = getGraphQlQuerySync(query);
 */
function getGraphQlQuerySync(query) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  const chainId = state.chainId || "0x1";
  // @ts-ignore
  const { body } = fetch(chainInfoObject[chainId].balancerSubgraphUrl, options);
  return body.data;
}

/**
 * @name getOnlyPoolIds
 * @description Get only the pool IDs from the Balancer subgraph
 * @returns {{ pools: { id: string }[] }}
 * @example const poolIds = getOnlyPoolIds();
 * console.log(poolIds);
 */
function getOnlyPoolIds() {
  const query = `{
    pools( where: { totalLiquidity_gt: 0 } ) {
      id
    }
  }`;
  const data = getGraphQlQuerySync(query);
  return data;
}

/**
 * @name runAllInOneQuery
 * @description Get the pool data from the Balancer subgraph
 * @returns {SBalancerGQLResponse}
 * @example const data = runAllInOneQuery();
 */
function runAllInOneQuery(hideZeroBalances) {
  const page = state.page || 0;
  const query = `{
    balancers(first: 5) {
      id
      poolCount
      totalLiquidity
    }
    pools(
      first: 10,
      skip: ${page * 10},
      orderBy: totalLiquidity,
      orderDirection: desc,
      # hide zero balance here optionally, only if hideZeroBalances is true
      ${hideZeroBalances ? "where: { totalLiquidity_gt: 0 }" : ""}
    ) {
      id
      address
      tokensList
      totalWeight
      totalShares
      holdersCount
      poolType
      poolTypeVersion
      totalLiquidity
      owner
      createTime
      tokens {
        token {
          name
          symbol
          address
          decimals
          totalBalanceUSD
          totalBalanceNotional
          totalVolumeUSD
          totalVolumeNotional
          latestUSDPrice
          latestPrice {
            pricingAsset
            price
            poolId {
              totalWeight
            }
          }
        }
      }
    }
  }`;

  /** @type {SBalancerGQLResponse} */
  const data = getGraphQlQuerySync(query);
  return data;
}

/**
 * @name hexToNumString
 * @description Convert a hex string to a number string
 * @param {string} hex - The hex string to convert
 * @returns {string} The number string
 * @example const numString = hexToNumString(hex);
 * console.log(numString);
 */
function hexToNumString(hex) {
  return ethers.BigNumber.from(hex).toString();
}

/**
 * @param {string} chainId
 * @param {string} poolId
 * @returns {APRApiResponse | undefined}
 */
const getAPIData = (chainId, poolId) => {
  const url = `https://api.balancer.fi/pools/${hexToNumString(
    chainId
  )}/${poolId}`;
  // @ts-ignore
  const res = fetch(url).body;
  return res;
};

/**
 * @name getTransformedData
 * @description Get the transformed data from the Balancer subgraph data and the calculations
 * @returns {TransformedData}
 * @example const data = getTransformedData();
 * console.log(data);
 */

function getTransformedData() {
  const data = runAllInOneQuery(!state.showZeroLiquidity);
  /** @type {TransformedPool[]} */
  if (!data?.pools?.map) return { balancers: [], pools: [] };
  const transformedPools = data.pools.map((pool) => {
    const poolId = pool?.id;
    const chainId = state?.chainId || "0x1";
    const balancerApiRes = getAPIData(chainId, poolId);
    const _balancerTokens = balancerApiRes?.tokens;

    const graphLiquidity = pool.totalLiquidity;
    const apiLiquidity = balancerApiRes?.totalLiquidity;
    const totalValueLocked = formatAndAbbreviateNumber(
      apiLiquidity
        ? parseFloat(apiLiquidity)
        : graphLiquidity
        ? parseFloat(graphLiquidity)
        : 0
    );
    const flattenTokens = ({ token }) => token;
    /** @type {SToken[]} */
    const flattenedTokens = pool.tokens.map(flattenTokens);
    const sortedTokens = flattenedTokens.sort((a, b) => {
      const aBalance = parseFloat(a.totalBalanceUSD);
      const bBalance = parseFloat(b.totalBalanceUSD);
      return bBalance - aBalance;
    });
    const tokens = sortedTokens;
    // const filteredTokens = sortedTokens.filter(
    //   (token) => token.address !== pool.address
    // );
    const tokensList = pool.tokensList.filter(
      (token) => token !== pool.address
    );
    // const tokens = filteredTokens;
    // console.log({
    //   flattenedTokens,
    //   sortedTokens,
    //   filteredTokens,
    //   tokens,
    // });
    const tokenWeights = _balancerTokens?.map(({ address, weight }, i) =>
      weight !== null
        ? {
            address,
            weight: parseFloat(weight),
          }
        : calculateTokenWeights(tokens)[i]
    );
    const balancerTokens = _balancerTokens?.map((t) =>
      t.weight !== null
        ? t
        : {
            ...t,
            weight:
              tokenWeights
                ?.find(({ address }) => address === t.address)
                ?.weight?.toString?.() ?? "0",
          }
    );

    const owner = pool.owner ?? "0x0000000000000000000000000000000000000000";

    // fill in the rest of the data
    return {
      ...pool,
      tokens,
      totalValueLocked,
      tokenWeights,
      tokensList,
      owner,
      balancerTokens,
    };
  });
  /** @type {TransformedData} */
  const transformedData = {
    balancers: data.balancers,
    pools: transformedPools,
  };
  return transformedData;
}

/**
 * @typedef {Object} State
 * @property {string | undefined} userAddress - The user's address
 * @property {string | undefined} chainId - The chain ID
 * @property {number} page - The current page
 * @property {boolean} forceMaxPage - Whether to force the max page
 * @property {number} forcedMaxPage - The forced max page
 * @property {boolean} showZeroLiquidity - Whether to hide pools with zero liquidity
 */
State.init({
  userAddress: undefined,
  chainId: undefined,
  page: 0,
  forceMaxPage: false,
  forcedMaxPage: 0,
  showZeroLiquidity: false,
});

/**@type {string | undefined} */
const userAddress = Ethers?.send?.("eth_requestAccounts", [])?.[0];
if (userAddress) State.update({ userAddress });

/** @type {ChainInfoObject} */
const chainInfoObject = {
  "0x1": {
    name: "Ethereum Mainnet",
    chainId: "0x1", // 1
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
    explorers: ["https://etherscan.io"],
    balancerQueriesAddress: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    balancerSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
  },
  // goerli
  "0x5": {
    name: "Goerli Testnet",
    chainId: "0x5", // 5
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
    balancerQueriesAddress: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    balancerSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2",
  },
  // zkEVM
  "0x44d": {
    name: "zkEVM Mainnet",
    chainId: "0x44d", // 1101
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
    explorers: ["https://zkevm.polygonscan.com"],
    balancerQueriesAddress: "0x809B79b53F18E9bc08A961ED4678B901aC93213a",
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    balancerSubgraphUrl:
      "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest",
  },
  "0xaa36a7": {
    name: "Sepolia Testnet",
    chainId: "0xaa36a7", // 11155111
    shortName: "sep",
    chain: "ETH",
    network: "testnet",
    // networkId: "31337",
    networkId: "11155111",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpc: ["https://rpc.sepolia.dev"],
    faucets: ["https://faucet.sepolia.dev"],
    explorers: ["https://sepolia.etherscan.io"],
    balancerQueriesAddress: "0x1802953277FD955f9a254B80Aa0582f193cF1d77",
    vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    balancerSubgraphUrl:
      "https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest",
  },
};
/**
 * @param {string} hexString
 */
function removeLeadingZero(hexString) {
  if (hexString.startsWith("0x")) {
    return "0x" + parseInt(hexString, 16).toString(16);
  }
}

// get ethers chain id and update state
function getNetwork() {
  const getNetworkReq = Ethers?.provider?.()?.getNetwork?.();
  getNetworkReq
    ?.then((/** @type {{ chainId: string | number; }} */ network) => {
      const hexId = removeLeadingZero(ethers.utils.hexlify(network.chainId));
      State.update({
        chainId: hexId,
      });
    })
    ?.catch((error) => {
      console.log("Error while getting network", error);
    });
}

try {
  getNetwork();
} catch (error) {
  console.log("2nd TryCatch (promise?): Error while getting network", error);
}

// if we don't have a chain id yet, try to get it before calling getTransformedData
if (!state.chainId) {
  setTimeout(() => {
    try {
      if (!state.chainId) {
        getNetwork();
      }
    } catch (error) {
      console.log(
        "3rd TryCatch (timeout?): Error while getting network",
        error
      );
    }
  }, 2500);
}

function ConnectButton() {
  return (
    <Popover.Root>
      <Popover.Trigger
        className="btn btn-primary btn-md mb-3"
        style={{
          filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
        }}
        // style={{ height: "40px" }}
      >
        {userAddress
          ? "Disconnect | Switch Network"
          : "Connect wallet with Web3"}
      </Popover.Trigger>
      <Popover.Content
        className="container py-4 text-dark"
        style={{
          width: "max-content",
          zIndex: 1000,
          // backgroundColor: "#1e1e1e",
          backgroundColor: "#f1f1f1",
          borderRadius: "8px",
          // apply some deep shadow
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.75)",
        }}
      >
        <Popover.Arrow style={{ fill: "#1e1e1e" }} />
        <Widget
          src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/NetworkSwitcherWithInfoTest"
          props={{ chainInfoObject }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}

if (!state.chainId) {
  // @ts-ignore
  return (
    <div className="bg-dark d-flex flex-column align-items-center text-light">
      <h1>Web3 not connected</h1>
      <ConnectButton />
    </div>
  );
}

if (state.chainId && !chainInfoObject[state.chainId]) {
  // @ts-ignore
  return (
    <div className="bg-dark d-flex flex-column align-items-center text-light">
      <h1>Unsupported network, please switch:</h1>
      <ConnectButton />
    </div>
  );
}

const transformedData = getTransformedData();

if (
  !transformedData ||
  !state.chainId ||
  !state.userAddress ||
  typeof state.page !== "number"
) {
  // @ts-ignore
  return (
    <div className="bg-dark d-flex flex-column align-items-center text-light">
      <h1>Loading...</h1>
      <ConnectButton />
    </div>
  );
}

// loading component with rotating icon and a big loading text
function LoadingComponent() {
  return (
    <div className="d-flex flex-column align-items-center text-light">
      <h1>Loading...</h1>
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
function PaginationComponent({ forceMaxPage, forcedMaxPage }) {
  if (typeof transformedData?.balancers?.length !== "number")
    return <LoadingComponent />;
  forceMaxPage = forceMaxPage || false;
  forcedMaxPage = forcedMaxPage || 0;
  const page = state.page;
  if (typeof page !== "number") return undefined;
  const setPage = (newPage) => {
    State.update({ page: newPage });
  };
  const bPoolCountDividedBy10 = Math.ceil(
    transformedData.balancers[0].poolCount / 10
  );
  const maxPage = forceMaxPage ? forcedMaxPage : bPoolCountDividedBy10;
  return (
    <div className="d-flex justify-content-center mb-3 align-items-center gap-2">
      {/* first page with double quote left */}
      <button
        className="btn btn-primary btn-md"
        style={{
          filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
        }}
        onClick={() => setPage(0)}
        disabled={page === 0}
      >
        {"«"}
      </button>
      <button
        className="btn btn-primary btn-md"
        style={{
          filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
        }}
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <span className="mx-1">
        Page {page + 1} of {maxPage}
      </span>
      <button
        className="btn btn-primary btn-md"
        style={{
          filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
        }}
        onClick={() => setPage(page + 1)}
        disabled={page === maxPage - 1}
      >
        Next
      </button>
      {/* last page with double quote right */}
      <button
        className="btn btn-primary btn-md"
        style={{
          filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
        }}
        onClick={() => setPage(maxPage - 1)}
        disabled={page === maxPage - 1}
      >
        {"»"}
      </button>
    </div>
  );
}

let forceMaxPage = false;
let forcedMaxPage = 0;

const breakpoint = 500;

const DesktopOnly = styled.div`
  @media (max-width: ${breakpoint}px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`;

const PrettyTable = styled.div`
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border-radius: 20px; /* rounded corners */
    overflow: hidden; /* for rounded corners */
    background: #333; /* dark mode */
    color: #fff; /* text color */

    th,
    td {
      padding: 16px;
    }
    thead tr {
      background-color: #222; /* dark grey */
      text-align: left;
      /*&:hover {
        background: #1f1f1f; /* hover effect */
      }*/
    }
    tbody 
    tbody tr:nth-child(odd) {
      background-color: #333; /* alternate row color */
      /*&:hover {
        background: #2f2f2f; /* hover effect */
      }*/
    }
    tbody tr:nth-child(even) {
      background-color: #222; /* alternate row color */
      /*&:hover {
        background: #1f1f1f; /* hover effect */
      }*/
    }
  }
`;

function MainExport() {
  if (!state.chainId) {
    return (
      <div className="bg-dark d-flex flex-column align-items-center text-light">
        <h1>Web3 not connected</h1>
        <ConnectButton />
      </div>
    );
  }
  const chainId = state.chainId || "0x1";
  // if transformedData?.pools is an empty array, set the page to previous page until we get a non-empty array
  if (
    transformedData?.pools?.length === 0 &&
    transformedData?.balancers?.length !== 0
  ) {
    const page = state.page;
    if (typeof page !== "number") return <LoadingComponent />;
    if (page > 0) {
      State.update({ page: page - 1 });
    }
  }
  if (
    transformedData?.pools?.length < 10 &&
    transformedData?.balancers?.length > 0
  ) {
    State.update({ forceMaxPage: true });
    // we've reached the end of the list, so this is the max page
    State.update({ forcedMaxPage: state.page + 1 });
  }
  // if (transformedData?.pools?.length === 10) {
  //   State.update({ forceMaxPage: false });
  //   State.update({ forcedMaxPage: 0 });
  // }
  return (
    <div className="bg-dark d-flex flex-column align-items-center text-light pt-3">
      <ConnectButton />
      {transformedData.balancers[0].poolCount > 10 ? (
        <PaginationComponent
          forceMaxPage={state.forceMaxPage}
          forcedMaxPage={state.forcedMaxPage}
        />
      ) : (
        <div className="mb-3 mt-1 text-center text-light fs-5 fw-bold">
          <LoadingComponent />
        </div>
      )}
      {/* toggle to see if user wants to hide pools that have zero liquidity, light switch type right left */}
      <div className="form-check form-switch mb-3">
        <input
          className={
            "form-check-input fs-4" +
            (state.showZeroLiquidity ? "" : " bg-secondary")
          }
          style={{
            filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
            cursor: "pointer",
          }}
          type="checkbox"
          id="flexSwitchCheckDefault"
          checked={state.showZeroLiquidity}
          onChange={() => {
            State.update({ showZeroLiquidity: !state.showZeroLiquidity });
            State.update({ page: 0 });
            State.update({ forceMaxPage: false });
            State.update({ forcedMaxPage: 0 });
          }}
        />
        <label
          className="form-check-label fs-5 mt-1 ms-1"
          htmlFor="flexSwitchCheckDefault"
        >
          Show pools with zero liquidity
        </label>
      </div>

      <h1 className="mt-3">Balancer Pools</h1>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        <MobileOnly>
          {transformedData?.pools?.map((pool) => {
            return (
              <Widget
                src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/BalancerPool"
                props={{
                  pool,
                  // this is an error in the widget, as both stake and unstake are supported in one widget
                  operation: "stake",
                  vaultAddress: chainInfoObject[chainId].vaultAddress,
                  balancerQueriesAddress:
                    chainInfoObject[chainId].balancerQueriesAddress,
                  chainId: chainId,
                }}
              />
            );
          })}
        </MobileOnly>
        <DesktopOnly>
          <PrettyTable>
            <table
              className="table table-sm table-transparent text-light"
              style={{
                marginTop: "-0.25rem",
              }}
            >
              <thead>
                <tr>
                  <th className="fw-bold">
                    <div className="d-flex">
                      <i className="bi bi-circle-fill text-secondary"></i>
                      <i
                        className="bi bi-circle-fill text-secondary"
                        style={{ marginLeft: "-7px" }}
                      ></i>
                      <i
                        className="bi bi-circle-fill text-secondary"
                        style={{ marginLeft: "-7px" }}
                      ></i>
                    </div>
                  </th>
                  <th className="fw-bold">Tokens</th>
                  <th className="fw-bold">APR</th>
                  <th className="fw-bold">Pool&nbsp;value</th>
                  <th className="fw-bold">Your&nbsp;balance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transformedData?.pools?.map((pool) => {
                  return (
                    <Widget
                      src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/BalancerPoolTableRow"
                      props={{
                        pool,
                        // this is an error in the widget, as both stake and unstake are supported in one widget
                        operation: "stake",
                        vaultAddress: chainInfoObject[chainId].vaultAddress,
                        balancerQueriesAddress:
                          chainInfoObject[chainId].balancerQueriesAddress,
                        chainId: chainId,
                        balancerTokens: pool.balancerTokens,
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          </PrettyTable>
        </DesktopOnly>
      </div>
      {transformedData.balancers[0].poolCount > 10 && (
        <PaginationComponent
          forceMaxPage={state.forceMaxPage}
          forcedMaxPage={state.forcedMaxPage}
        />
      )}
    </div>
  );
}

//@ts-ignore
return <MainExport />;
