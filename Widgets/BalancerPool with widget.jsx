// @ts-check

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
/** @typedef {Object} PoolAndBalance @property {string} poolAddress @property {string | undefined} balance */
/**
 * Form for a single token in the pool.
 * @typedef {Object} OneForm
 * @property {string} inputAmount - User input amount for the token in the pool.
 * @property {string} symbol - Self-explanatory.
 * @property {boolean} isSelected - Indicates whether the token is selected.
 * @property {string} address - Address of the token.
 */

/**
 * Form for the "all" token in the pool.
 * @typedef {Object} AllForm
 * @property {string} totalAmount - Total amount for the "all" token in the pool.
 */

/**
 * Forms object for the currency selector. There's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all".
 * @typedef {Object} CurrencySelectorGroup
 * @property {"all" | "one"} allOrOne - Indicates whether the form is for "all" or "one" tokens in the pool.
 * @property {AllForm} allForm - Form for the "all" token in the pool.
 * @property {Object.<string, OneForm>} oneForms - Forms for each token in the pool.
 * @property {boolean} tokenSelectorIsOpen - Indicates whether the token selector dropdown is open.
 * @property {string[]} tokenAddresses - Array containing all the addresses of the tokens it contains.
 * @property {string | undefined} poolBalance - User's balance of pool tokens.
 */
/**
 * Forms object for the currency selector. There's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all".
 * @typedef {Object.<string, CurrencySelectorGroup>} CurrencySelectorFormGroupsObject
 */

/****************************** START OF TEMPORARY *****************************/

const zkEVMGraphQLUri =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";
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
  function getGraphQlQuerySync(query) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    };
    // @ts-ignore
    const { body } = fetch(zkEVMGraphQLUri, options);
    return body.data;
  }
  /** @type {SBalancerGQLResponse} */
  const data = getGraphQlQuerySync(query);
  return data;
}
/**
 * @name getTransformedData
 * @description Get the transformed data from the Balancer subgraph data and the calculations
 * @returns {TransformedData}
 * @example const data = getTransformedData();
 * console.log(data);
 */

function getTransformedData() {
  // try {
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
  // } catch (e) {
  //   console.log("mina eroro", e);
  //   return {
  //     balancers: [],
  //     pools: [],
  // };
  // }
}
// console.log("before transformedData");
const transformedData = getTransformedData();
// console.log("after transformedData", transformedData);

const erc20ABI =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

props.pool = transformedData.pools[0];

/****************************** /END OF TEMPORARY *****************************/

/**
 * @typedef {Object} State
 * @property {string | undefined} poolBalance - The user's balance of the pool's tokens
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 * @property {"stake" | "unstake" | false} downOpen - Error message when trying to get the user's balance, if any.
 * @property {string | undefined} userAddress - The user's address
 */

State.init({
  poolBalance: undefined,
  errorGettingBalance: undefined,
  downOpen: false,
  userAddress: undefined,
});

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
State.update({ userAddress });

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 */
function getUserBalance(poolAddress, userAddress) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
      errorGettingBalance: "No signer, user disconnected",
    });
    console.log("No signer, user disconnected, exiting getUserBalance()");
    return;
  }
  try {
    const erc20 = new ethers.Contract(
      poolAddress, // address
      erc20ABI, // erc20 abi
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const balance = erc20
      .balanceOf(userAddress)
      .then((/** @type {{ toString: () => string; }} */ balance) => {
        // console.log(typeof balance);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        // console.log(formattedBalance);
        // undo big number into a string
        return formattedBalance;
      });
    return balance;
  } catch (e) {
    // return dummy balance 666s
    return `Error in getUserBalance(). params:
- poolAddress: ${poolAddress}
- userAddress: ${userAddress}
- error: ${e}`;
  }
}

/**
 * @param {string | undefined} poolAddress
 * @param {string | undefined} userAddress
 */
function getUserBalanceOnceAndUpdateState(poolAddress, userAddress) {
  if (!userAddress) {
    console.log("No user address, exiting getUserBalanceOnceAndUpdateState()");
    return;
  }
  if (!poolAddress) {
    console.log("No pool address, exiting getUserBalanceOnceAndUpdateState()");
    return;
  }
  const balanceProcessor = getUserBalance(poolAddress, userAddress);
  if (typeof balanceProcessor === "string") {
    console.log(
      "Error getting balance using getUserBalanceOnceAndUpdateState():",
      balanceProcessor
    );
    return;
  }
  if (balanceProcessor && balanceProcessor.then) {
    balanceProcessor.then((newBalance) => {
      State.update({
        poolBalance: newBalance,
      });
    });
  } else {
    console.log(
      "Got balance using getUserBalanceOnceAndUpdateState(); it was undefined."
    );
  }
}
let updatedBalance;
if (!updatedBalance) {
  getUserBalanceOnceAndUpdateState(props.pool.address, state.userAddress);
}
updatedBalance = true;

/**
 * @param {{ poolBalance: string | undefined; errorGettingBalance: string | undefined; operation: "stake" | "unstake"}} props
 */
function StakeUnstakeWidget(props) {
  const poolBalance = props.poolBalance;
  const errorGettingBalance = props.errorGettingBalance;
  const operation = props.operation;
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={
          (operation === "stake" ? "btn-primary" : "btn-secondary") +
          " btn btn-lg fw-bold border-0"
        }
        style={{
          letterSpacing: "0.033em",
          // desaturate completely and lighten by 50%
          filter:
            operation === "stake"
              ? "hue-rotate(40deg) saturate(80%) brightness(115%)"
              : "saturate(0%) brightness(100%)",
        }}
      >
        {operation === "stake" ? "Stake" : "Unstake"}
      </Dialog.Trigger>
      <Dialog.Content
        className="rounded-4"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      >
        <div className="card bg-dark text-light rounded-4 shadow border-0 p-3">
          <div className="card-header">
            <h5 className="card-title">
              {operation === "stake" ? "Stake" : "Unstake"}
            </h5>
          </div>
          <div className="card-body">
            <p className="card-text">
              <span className="fw-bold">Your Balance:</span>{" "}
              {/* {state.forms[pool.address]?.poolBalance} */}
              {props.poolBalance}
            </p>
            <div className="d-flex justify-content-end">
              <Dialog.Close
                className="btn btn-lg btn-secondary me-3 fw-bold border-0"
                style={{
                  letterSpacing: "0.033em",
                  // desaturate completely and lighten by 50%
                  filter: "saturate(0%) brightness(100%)",
                }}
              >
                Cancel
              </Dialog.Close>
              <button
                className="btn btn-lg btn-primary fw-bold border-0"
                // dataSide="top"
                // dataAlign="end"
                style={{
                  letterSpacing: "0.033em",
                  filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                }}
              >
                {operation === "stake" ? "Stake" : "Unstake"}
              </button>
            </div>
          </div>
        </div>

        {/* <Widget
        src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/StakeUnstakeForm"
        props={{
          pool,
          operation: "unstake",
          erc20ABI: erc20ABI,
          stake: () => {},
          unstake: () => {},
        }}
      /> */}
      </Dialog.Content>
    </Dialog.Root>
  );
}

function getPoolBalance({}) {
  const userAddress = Ethers.signer().getAddress();
  if (!userAddress) State.update({ errorGettingBalance: "Not connected" });
  const { pool } = props;
  const { tokens } = pool;
  const tokenAddresses = tokens.map((token) => token.address);
  const contract = new ethers.Contract(
    userAddress,
    erc20ABI,
    Ethers.provider().getSigner()
  );
  const balance = contract.balanceOf(pool.address);
  return balance;
}

// @ts-ignore
if (!props.pool)
  // @ts-ignore
  return <>Prop required but not provided: pool (type: TransformedPool)</>;
/** @type {TransformedPool} */
const pool =
  // @ts-ignore
  props.pool;

const VerticalPair = ({ title, value, end }) => {
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
        {value || "-"}
      </p>
    </div>
  );
};

function MainComponent() {
  return (
    <div
      key={pool.id}
      className="card bg-dark text-light rounded-4 shadow border-0 p-3"
      style={{
        width: "450px",
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
              <VerticalPair
                end={false}
                title="Pool Type"
                value={
                  // nonbreaking
                  <span className="text-nowrap">
                    {pool.poolType} v{pool.poolTypeVersion}
                  </span>
                }
              />
              <VerticalPair
                end={false}
                title="Total Value Locked"
                value={`$${pool.totalValueLocked}`}
              />
            </div>
            <div className="col-md-6">
              <VerticalPair
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
                    <th className="fw-bold">Token</th>
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
                        {pool.tokenWeights.find((w) => w.address === t.address)
                          ?.weight || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* align to the right */}
          <div className="mt-3 d-flex justify-content-end">
            <div className="d-flex flex-column align-items-end">
              <div className="d-flex justify-self-end">
                <VerticalPair
                  title="Your Balance"
                  value={state.poolBalance}
                  end
                />
              </div>
              <div className="d-flex justify-content-end gap-3">
                <StakeUnstakeWidget
                  errorGettingBalance={state.errorGettingBalance}
                  operation="unstake"
                  poolBalance={state.poolBalance}
                />
                <StakeUnstakeWidget
                  errorGettingBalance={state.errorGettingBalance}
                  operation="stake"
                  poolBalance={state.poolBalance}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// @ts-ignore
return (
  <div className="d-flex flex-column gap-2">
    <Web3Connect connectLabel="Connect Wallet" />
    <MainComponent />
    <MainComponent />
  </div>
);
