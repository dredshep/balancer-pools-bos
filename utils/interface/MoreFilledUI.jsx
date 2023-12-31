// @ts-check

// zkEVM addresses
// const knownAddresses = {
//   /** main reference, priced by bb-o-USD */ "bb-o-USDT":
//     "0x4b718e0e2fea1da68b763cd50c446fba03ceb2ea",
//   /** reference for bb-o-USDT*/ "bb-o-USD":
//     "0xe274c9deb6ed34cfe4130f8d0a8a948dea5bb286",
//   /** NOT a reference, priced by bb-o-USD */ USDT: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
//   /** reference for USDC */ "bb-o-USDC":
//     "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
//   /** priced by bb-o-USDC*/ USDC: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
//   /** reference for WETH, circular pricing */ "B-wstETH-STABLE":
//     "0xe1f2c039a68a216de6dd427be6c60decf405762a",
//   /** priced by B-wstETH-STABLE, circular pricing*/ WETH: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
// };

// for each pool, check if the user has approved the pool to spend their tokens
// if not, show a button to approve the pool, and then show the 2 buttons for depositing and withdrawing
// while it checks whether it's approved or not, show a rotating loading button made with styled components

/**
 * @typedef {{
 * poolAddress: string,
 * hasError: number,
 * errorMessage: string,
 * inputAmount: string,
 * }} StakeForm
 */

// make CurrencySelectee with only token address and enabled, no pool address
/**
 * @typedef {{
 * selectedTokenAddress: string,
 * enabled: boolean,
 * }} CurrencySelectee
 */

/**
 * @typedef {{ [address: string]: CurrencySelectee }} CurrencySelector
 */

/**
 * @typedef {{
 * checkedChainInfo: boolean,
 * userBalances: [],
 * chainId: string,
 * chainName: string,
 * errorWrongNetwork: boolean,
 * currencySelectors: CurrencySelector,
 * }} StateType
 */

const url =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";

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

const abi = fetchGetSync(
  "https://raw.githubusercontent.com/dredshep/dev/main/abi.json"
);

function getGraphQlQuerySync(query) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  // @ts-ignore
  const { body } = fetch(url, options);
  return body.data;
}

/**
 * @name runAllInOneQuery
 * @description Get the pool data from the Balancer subgraph
 * @returns {SBalancerGQLResponse}
 * @example const data = runAllInOneQuery();
 */
function runAllInOneQuery() {
  const query = `{
    balancers(first: 5) {
      id
      poolCount
      totalLiquidity
    }
    pools(first: 5) {
      id
      address
      tokensList
      totalWeight
      totalShares
      holdersCount
      poolType
      poolTypeVersion
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
 * @name formatNumberWithCommas
 * @description Formats a number with commas as thousands separators
 * @param {number} number - The number to format
 * @returns {string} The formatted number as a string
 * @example const formattedNumber = formatNumberWithCommas(1234567.89);
 * console.log(formattedNumber); // "1,234,567.89"
 */
function formatNumberWithCommas(number) {
  let parts = number.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**
 * @name calculateTotalValueLocked
 * @description Calculate the total value locked in a pool
 * @param {SBalancerGQLResponse["pools"][0]} pool
 * @returns {{ num: number, str: string }} The total value locked as a number and a string
 * @example const totalValueLocked = calculateTotalValueLocked(pool);
 * console.log(totalValueLocked);
 */
function calculateTotalValueLocked(pool) {
  const totalLiquidity = pool.tokens.reduce((acc, _token) => {
    const { token } = _token;
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
 * @param {SBalancerGQLResponse["pools"][0]} pool
 * @returns {{
 * address: string,
 * weight: string
 * }[]}
 * @example const tokenWeights = calculateTokenWeights(pool);
 * console.log(tokenWeights);
 */
function calculateTokenWeights(pool) {
  const totalValueLocked = calculateTotalValueLocked(pool);
  const getWeight = (
    /** @type {number} */ value,
    /** @type {number} */ decimals
  ) =>
    (
      (value / (Number(totalValueLocked.num) * Number("1e" + decimals))) *
      100
    ).toFixed(2) + "%";
  const weights = pool.tokens.map((_token) => {
    const { token } = _token;
    const weight = getWeight(parseFloat(token.totalBalanceUSD), token.decimals);
    return {
      address: token.address,
      weight,
      token,
    };
  });
  return weights;
}

/**
 * @name getTransformedData
 * @description Get the transformed data from the Balancer subgraph data and the calculations
 * @returns {TransformedData}
 * @example const data = getTransformedData();
 * console.log(data);
 */

function getTransformedData() {
  const data = runAllInOneQuery();
  /** @type {TransformedPool[]} */
  const transformedPools = data.pools.map((pool) => {
    const totalValueLocked = calculateTotalValueLocked(pool).str;
    const tokenWeights = calculateTokenWeights(pool);
    const flattenedTokens = pool.tokens.map((_token) => {
      const { token } = _token;
      return token;
    });
    const tokens = flattenedTokens.sort((a, b) => {
      const aBalance = parseFloat(a.totalBalanceUSD);
      const bBalance = parseFloat(b.totalBalanceUSD);
      return bBalance - aBalance;
    });

    // fill in the rest of the data
    return {
      ...pool,
      tokens,
      totalValueLocked,
      tokenWeights,
    };
  });
  /** @type {TransformedData} */
  const transformedData = {
    balancers: data.balancers,
    pools: transformedPools,
  };
  return transformedData;
}

const VerticalPair2 = ({ title, value, end }) => {
  const isEnd = !!end;
  return (
    <div className="d-flex flex-column">
      {/* size small */}
      <p
        className={
          "text-secondary text-uppercase fw-bold mb-0 text-nowrap " +
          (isEnd ? " text-end" : "")
        }
        style={{
          fontSize: "0.9rem",
          letterSpacing: "0.033rem",
        }}
      >
        {title}
      </p>
      <p className={"fw-bold" + (isEnd ? " text-end" : "") + " fs-5"}>
        {value}
      </p>
    </div>
  );
};

/**
 * @description Handle the approve press button
 * @param {string} tokenAddress
 * @param {number} amount
 * @param {number} decimals
 */
const handleApprove = (tokenAddress, amount, decimals) => {
  // if (!tokenAddress || !amount || hasError) return;
  if (!tokenAddress || !amount || !decimals) return;

  const erc20 = new ethers.Contract(
    tokenAddress, // address
    abi, // erc20 abi
    Ethers.provider().getSigner()
  );

  // amount is string float, make it a big number
  const toBigNumber = ethers.utils.parseUnits(amount, decimals);

  erc20
    .approve(tokenAddress, toBigNumber)
    .then((transaction) => {
      console.log("Transaction sent:", transaction.hash);
      State.update({ hasError: -1 });
      return transaction.wait();
    })
    .then((receipt) => {
      State.update({ hasError: 0 });
      State.update({ success: true });
      console.log("Transaction mined, receipt:", receipt);
    })
    .catch((error) => {
      State.update({ hasError: 5, errorMessage: error });
      console.log("Error in mint function:", error);
    });
};

/**
 * @description Handle the balancer pool deposit operation
 * @param {string} poolAddress
 * @param {string} tokenAddress
 * @param {number} tokenDecimals
 * @param {string} amount
 */
function handleDeposit(poolAddress, tokenAddress, tokenDecimals, amount) {
  /*    
  function joinPool(
        bytes32 poolId,
        address sender,
        address recipient,
        JoinPoolRequest memory request
    ) external payable;

    struct JoinPoolRequest {
        // [ASSET_A, ASSET_B] - MUST BE SORTED ALPHABETICALLY
        address[] assets;
        // [ASSET_A_AMOUNT, ASSET_B_AMOUNT]
        uint256[] maxAmountsIn;
        bytes userData;
        // false
        bool fromInternalBalance;
    }

    // Create the Vault contract
    // const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider)


    const types = ['uint256', 'uint256[]', 'uint256'];
    // [EXACT_TOKENS_IN_FOR_BPT_OUT, amountsIn, minimumBPT];
    const data = [ARRAY_OF_TOKENS_IN, ARRAY_OF_TOKENS_IN_AMOUNT, 0];
    const userDataEncoded = ethers.utils.defaultAbiCoder.encode(types, data);

    // Exact Tokens Join
    // userData ABI
    // ['uint256', 'uint256[]', 'uint256']
    // userData
    
    https://docs.balancer.fi/reference/joins-and-exits/pool-joins.html#userdata
    
        function exitPool(
        bytes32 poolId,
        address sender,
        address payable recipient,
        ExitPoolRequest memory request
    ) external;

    struct ExitPoolRequest {
        address[] assets;
        uint256[] minAmountsOut;
        bytes userData;
        bool toInternalBalance;
    }

    enum ExitKind {
        EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, // 0
        EXACT_BPT_IN_FOR_TOKENS_OUT, // 1
        BPT_IN_FOR_EXACT_TOKENS_OUT, // 2
        MANAGEMENT_FEE_TOKENS_OUT // for InvestmentPool
    }

    // BPT = Balancer Pool Token
    const types = ['uint256', 'uint256', 'uint256'];
    // [EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, bptAmountIn, exitTokenIndex];
    const data = [0, BPT_AMOUNT_IN, 0];
    const userDataEncoded = ethers.utils.defaultAbiCoder.encode(types, data);
  */
}

/**
 * @description Handle the deposit press button
 * @param {string} poolId
 * @param {string} tokenAddress
 * @param {number} tokenDecimals
 */
function handleInitDeposit(poolId, tokenAddress, tokenDecimals) {
  // deposit logic
  // set state to loading
  // call deposit function
  // .then set state to not loading
  // .catch show error message
  // if success, show success message
}

/**
 * @description Handle the withdraw press button
 * @param {string} poolId
 * @param {string} tokenAddress
 * @param {number} tokenDecimals
 */
function handleInitWithdraw(poolId, tokenAddress, tokenDecimals) {
  // withdraw logic
  // set state to loading
  // call withdraw function
  // .then set state to not loading
  // .catch show error message
  // if success, show success message
}

function handleStakeClick(poolAddress) {
  console.log("clicked stake");
  // enable in state
  State.update({
    stakeForms: {
      ...state.stakeForms,
      [poolAddress]: {
        ...state.stakeForms[poolAddress],
        enabled: true,
      },
    },
  });
}

/**
 * @param {string | number} poolAddress
 * @param {string} value
 */
function handleStakeFormChange(poolAddress, value) {
  console.log("stake form change", poolAddress, value);
  // update in state
  State.update({
    stakeForms: {
      ...state.stakeForms,
      [poolAddress]: {
        ...state.stakeForms[poolAddress],
        inputAmount: value,
      },
    },
  });
}

// function StakeForm({ poolAddress, tokenAddress, tokenDecimals }) {
//   /** @type {StakeForm} */
//   const formState = state.stakeForms[poolAddress];
//   const setFormState = (/** @type {string} */ value) =>
//     handleStakeFormChange(poolAddress, value);

//   return (
//     <div className="d-flex flex-row justify-content-center align-items-center">
//       {/* form to select a token */}
//       <select
//         className="form-control form-control-sm"
//       <input
//         type="number"
//         className="form-control form-control-sm"
//         placeholder="0"
//         value={formState.inputAmount}
//         onChange={(e) => setFormState(e.target.value)}
//       />
//       <button
//         className="btn btn-primary btn-sm ml-2"
//         onClick={() => handleStakeClick(poolAddress)}
//       >
//         Stake
//       </button>
//     </div>
//   );
// }

// function handleCurrencySelectorChange(poolAddress, tokenAddress) {
//   console.log("currency selector change", poolAddress, tokenAddress);
//   // update in state
//   State.update({
//     currencySelectors: {
//       ...state.currencySelectors,
//       [poolAddress]: {
//         ...state.currencySelectors[poolAddress],
//         selectedTokenAddress: tokenAddress,
//       },
//     },
//   });
// }

// /**
//  * @param {TransformedData} data
//  * @param {string | number} poolAddress
//  */
// function getTokenListFromPoolAddress(data, poolAddress) {
//   return data.pools.find((pool) => pool.address === poolAddress)?.tokens;
// }

/**
 * @param {TransformedData} data
 * @returns {{ [tokenAddress: string]: TransformedPool }}
 */
const getIndexedPoolAddresses = (/** @type {TransformedData} */ data) =>
  data.pools.reduce((acc, pool) => {
    acc[pool.address] = pool;
    return acc;
  }, {});

const getIndexedTokenAddresses = (/** @type {TransformedData} */ data) => {
  /** @type {{ [tokenAddress: string]: {pools: TransformedPool[], token: SToken} }} */
  const indexedTokenAddresses = {};
  data.pools.forEach((pool) => {
    pool.tokens.forEach((token) => {
      if (!indexedTokenAddresses[token.address]) {
        indexedTokenAddresses[token.address] = {
          pools: [],
          token,
        };
      }
      indexedTokenAddresses[token.address].pools.push(pool);
    });
  });
  return indexedTokenAddresses;
};

let data;
/** @type {StatePool[]} */
const statePools = state.statePools;
try {
  data = getTransformedData();
} catch (error) {
  // @ts-ignore
  return <div>Error getting data, please refresh this tab or component</div>;
}

/** @type {{ [poolAddress: string]: CurrencySelector }} */
const currencySelectors = state.currencySelectors;

/**
 * @param {{ poolAddress: string, data: TransformedData }} props
 */
function CurrencySelector({ data, poolAddress }) {
  const pools = getIndexedPoolAddresses(data);
  const pool = pools[poolAddress];
  const tokenList = getIndexedTokenAddresses(data);
  // each pool can have like this: All or One in pool.allOrOne === either "all" or "one"
  const allOrOne = pool.allOrOne;
  function handleRadioChange(
    /** @type {"all" | "one"} */ newAllOrOne) {
    State.update({
      currencySelectors: {
        ...state.currencySelectors,
        [poolAddress]: {
          ...state.currencySelectors[poolAddress],
          allOrOne: newAllOrOne,
        },
      },
    });

  return (
    <div>
      <div className="d-flex align-items-center">
        <div
          className="bg-secondary p-2"
          style={{
            // rounded left corners
            borderTopLeftRadius: "0.5rem",
            borderBottomLeftRadius: "0.5rem",
            // make height 40px
            height: "40px",
          }}
          onClick={() => handleClickCurrencySelector(poolAddress)}
        >
          {/* <span className="fw-bold">USDT</span> */}
          {/* Radix radial with All or One */}
          {/* <div>
            <RadioGroup.Root defautValue="all">
              <RadioGroup.Item value="all">
                <RadioGroup.Label>All</RadioGroup.Label>
              </RadioGroup.Item>
              <RadioGroup.Item value="one">
                <RadioGroup.Label>One</RadioGroup.Label>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </div> */}
          
          <RadioGroup defaultValue={"all"} onValueChange={handleRadioChange}>
            <RadioGroup.Item value="all">
              <RadioGroup.Label>All</RadioGroup.Label>
            </RadioGroup.Item>
            <RadioGroup.Item value="one">
              <RadioGroup.Label>One</RadioGroup.Label>
            </RadioGroup.Item>
          </RadioGroup>
          {/* Radix dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontWeight: "bold",
              }}
            >
              USDT
              <span className="ms-1">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={5}>
              {/* <DropdownMenu.CheckboxItem
                checked={state.currencySelectors[poolAddress].tokens}
                onCheckedChange={setBookmarksChecked}
              >
                <DropdownMenu.ItemIndicator>
                  <i className="bi bi-check-circle-fill"></i>
                </DropdownMenu.ItemIndicator>
                Show Bookmarks
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                checked={state.urlsChecked}
                onCheckedChange={setUrlsChecked}
              >
                <DropdownMenu.ItemIndicator>
                  <i className="bi bi-check-circle-fill"></i>
                </DropdownMenu.ItemIndicator>
                Show Full URLs
              </DropdownMenu.CheckboxItem> */}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        {/* input form to put how many tokens to stake */}
        <div className="">
          <input
            type="text"
            className="form-control form-control bg-secondary text-light border-secondary"
            style={{
              // max size is like 150px
              maxWidth: "110px",
              // rounded right corners
              borderTopRightRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem",
              // unrounded left corners
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              // make height 40px
              height: "40px",
            }}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {string} poolAddress
 */
function handleClickCurrencySelector(poolAddress) {
  /** @type {CurrencySelector} */
  const currencySelector = state.currencySelectors[poolAddress];
  console.log("clicked open currency selector");
  // check if open
  // if open, close
  if (currencySelector[poolAddress].enabled) {
    // disable in state
    State.update({
      currencySelectors: {
        ...currencySelector,
        [poolAddress]: {
          ...currencySelector[poolAddress],
          enabled: false,
        },
      },
    });
    return;
  }
  // enable in state
  State.update({
    currencySelectors: {
      ...currencySelector,
      [poolAddress]: {
        ...currencySelector[poolAddress],
        enabled: true,
      },
    },
  });
}

try {
  // @ts-ignore
  return (
    <div
      // className="bg-secondary"
      style={{
        paddingTop: "1rem",
        paddingBottom: "1rem",
        // Gradient from 0F1023 to 3A215E
        background:
          "linear-gradient(90deg, rgba(15,16,35,1) 0%, rgba(58,33,94,1) 100%)",
      }}
    >
      <div
        className="container d-flex flex-column align-items-center"
        // style={{
        //   // Gradient from 0F1023 to 3A215E
        //   background:
        //     "linear-gradient(90deg, rgba(15,16,35,1) 0%, rgba(58,33,94,1) 100%)",
        // }}
      >
        <div
          className="d-flex flex-column gap-3"
          style={{
            maxWidth: "650px",
          }}
        >
          {data.pools.map((pool) => (
            // increase inner margins
            <div
              key={pool.id}
              className="card bg-dark text-light rounded-4 shadow border-0 p-3"
              style={{
                // brightness up by 10%
                filter: "brightness(110%)",
              }}
            >
              <div className="card-header">
                <h5 className="card-title">
                  {pool.tokens
                    .map((t) => <span title={t.name}>{t.symbol || "a"}a</span>)
                    // .join(" / ")
                    // @ts-ignore
                    .reduce((prev, curr) => [prev, " / ", curr])}
                </h5>
              </div>
              <div className="card-body d-flex flex-column">
                {/* 2x2 grid*/}
                <div className="">
                  <div className="row">
                    <div className="col-md-6">
                      {/* <VerticalPair2>
                      Pool Type: {pool.poolType} {pool.poolTypeVersion}
                    </VerticalPair2>
                    <VerticalPair2>
                      Total Value Locked: {pool.totalValueLockedETH} ETH / $
                      {pool.totalValueLockedUSD}
                    </VerticalPair2> */}
                      <VerticalPair2
                        end={false}
                        title="Pool Type"
                        value={
                          // nonbreaking
                          <span className="text-nowrap">
                            {pool.poolType} v{pool.poolTypeVersion}
                          </span>
                        }
                      />
                      <VerticalPair2
                        end={false}
                        title="Total Value Locked"
                        value={`$${pool.totalValueLocked}`}
                      />
                    </div>
                    <div className="col-md-6">
                      <VerticalPair2
                        end={false}
                        title="Amount of Holders"
                        value={`${pool.holdersCount}`}
                      />
                      <table
                        className="table table-sm table-transparent text-light border-secondary"
                        style={{
                          // max size is like 150px
                          maxWidth: "200px",
                          marginTop: "-0.25rem",
                        }}
                      >
                        <thead>
                          <tr>
                            {/* uppercase font secondary */}
                            <th className="fw-bold">Token</th>
                            {/* uppercase font secondary */}
                            <th className="fw-bold">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pool.tokens.map((t) => (
                            <tr key={t.symbol}>
                              <td
                                title={
                                  "1 " +
                                  t.name +
                                  " is worth $" +
                                  parseFloat(t.latestUSDPrice || "0").toFixed(2)
                                }
                              >
                                {t.symbol}
                              </td>
                              <td
                                title={
                                  (
                                    parseFloat(t.totalBalanceNotional) /
                                    Number("1e" + t.decimals)
                                  ).toFixed(2) +
                                  " " +
                                  t.symbol
                                }
                              >
                                {pool.tokenWeights.find(
                                  (w) => w.address === t.address
                                )?.weight || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* align to the right */}
                  <div className="row mt-3">
                    <div className="col-md-12">
                      {/* <p className="text-end fs-3">
                      Your Balance: {pool.userBalance}
                    </p> */}
                      <div className="d-flex justify-content-between">
                        {/* div with rounded corners on the left side, content is USDT and a down arrow, it's a dropdown */}
                        <CurrencySelector poolAddress={pool.id} data={data} />
                        <VerticalPair2
                          title="Your Balance"
                          value="NOT IMPLEMENTED"
                          end
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-lg btn-secondary me-3 fw-bold border-0"
                          style={{
                            letterSpacing: "0.033em",
                            // desaturate completely and lighten by 50%
                            filter: "saturate(0%) brightness(100%)",
                          }}
                        >
                          Unstake
                        </button>
                        <button
                          className="btn btn-lg btn-primary fw-bold border-0"
                          style={{
                            letterSpacing: "0.033em",
                            filter:
                              "hue-rotate(40deg) saturate(80%) brightness(115%)",
                          }}
                        >
                          Stake
                        </button>
                      </div>
                      {/* <StakeForm poolAddress={pool.id} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <pre className="text-light">{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
} catch (e) {
  // @ts-ignore
  return (
    <div className="alert alert-danger" role="alert">
      {("Error:", e)}
    </div>
  );
}
