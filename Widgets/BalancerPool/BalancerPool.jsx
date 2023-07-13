// @ts-check

/** @typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** @typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** @typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** @typedef {Object} SPoolId @property {string} totalWeight */
/** @typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens */
/** @typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** @typedef {Object} TokenWeights @property {string} address @property {number} weight */
/** @typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights[]} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens */
/** @typedef {Object} TransformedData @property {SBalancer[]} balancers @property {TransformedPool[]} pools */
/** @typedef {Object} StatePool @property {string} id @property {boolean} approved @property {boolean} depositing @property {boolean} withdrawing @property {boolean} approving @property {boolean} loading */
/** @typedef {Object} PoolAndBalance @property {string} poolAddress @property {string | undefined} balance */

const erc20ABI =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

/**
 * @typedef {Object} State
 * @property {string | undefined} poolBalance - The user's balance of the pool's tokens
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 * @property {string | undefined} userAddress - The user's address
 * @property {number} refreshTick - A number that triggers a refresh of the data when it changes
 */

State.init({
  poolBalance: undefined,
  errorGettingBalance: undefined,
  userAddress: undefined,
  refreshTick: 0,
});
if (state.errorGettingBalance)
  console.log("Error getting balance: ", state.errorGettingBalance);

const missingProps = [];

// @ts-ignore
if (!props.pool) missingProps.push("pool (TransformedPool)");
// @ts-ignore
if (!props.operation) missingProps.push('operation ("stake" | "unstake")');
// @ts-ignore
if (!props.vaultAddress) missingProps.push("vaultAddress (string)");
// @ts-ignore
if (!props.balancerQueriesAddress)
  missingProps.push("balancerQueriesAddress (string)");
// @ts-ignore
if (props.pool && !props.pool.id)
  missingProps.push("pool has no id, check type (TransformedPool)");

const pool =
  // @ts-ignore
  props.pool;

/** @type {string} */
const VAULT_ADDRESS =
  // @ts-ignore
  props.vaultAddress;

/** @type {string} */
const BALANCER_QUERIES_ADDRESS =
  // @ts-ignore
  props.balancerQueriesAddress;

function MissingPropsWarning({ missingProps }) {
  return (
    <div
      className="card border-warning mb-3 shadow"
      style={{ maxWidth: "30rem", margin: "auto" }}
    >
      <div className="card-header text-white bg-warning">
        <h4 className="card-title mb-0">Attention!</h4>
      </div>
      <div className="card-body text-danger">
        <p className="card-text">
          There {missingProps.length === 1 ? "is" : "are"} {missingProps.length}{" "}
          missing prop{missingProps.length === 1 ? "" : "s"}:
        </p>
        <ul className="list-group list-group-flush">
          {missingProps.map((prop) => (
            <li key={prop} className="list-group-item">
              <pre className="m-0">{prop}</pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

if (missingProps.length) {
  // @ts-ignore
  return <MissingPropsWarning missingProps={missingProps} />;
}

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
State.update({ userAddress });

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 */
function getUserBalance(poolAddress, userAddress) {
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
      poolAddress,
      erc20ABI,
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const balance = erc20
      .balanceOf(userAddress)
      .then((/** @type {{ toString: () => string; }} */ balance) => {
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        return formattedBalance;
      });
    return balance;
  } catch (e) {
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
  getUserBalanceOnceAndUpdateState(pool.address, state.userAddress);
}
updatedBalance = true;

function getPoolBalance({}) {
  const userAddress = Ethers.signer().getAddress();
  if (!userAddress) State.update({ errorGettingBalance: "Not connected" });
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

const VerticalPair = ({ title, value, end }) => {
  const isEnd = !!end;
  return (
    <div className="d-flex flex-column">
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

/**
 * @typedef {Object} StakeUnstakeButtonAndFormProps
 * @property {"stake"|"unstake"} operation
 * @property {TransformedPool} pool
 * @property {string} vaultAddress
 * @property {string} balancerQueriesAddress
 */

/** @type {StakeUnstakeButtonAndFormProps} */
const stakeWidgetProps = {
  pool,
  operation: "stake",
  vaultAddress: VAULT_ADDRESS,
  balancerQueriesAddress: BALANCER_QUERIES_ADDRESS,
};

/** @type {StakeUnstakeButtonAndFormProps} */
const unstakeWidgetProps = {
  pool,
  operation: "unstake",
  vaultAddress: VAULT_ADDRESS,
  balancerQueriesAddress: BALANCER_QUERIES_ADDRESS,
};

function MainComponent() {
  return (
    <div
      key={pool.id}
      className="card bg-dark text-light rounded-4 shadow border-0 p-3"
      style={{
        width: "450px",
      }}
    >
      <div className="card-header">
        <h5 className="card-title">
          {pool.tokens
            .map((t) => <span title={t.name}>{t.symbol || "a"}</span>)
            // @ts-ignore
            .reduce((prev, curr) => [prev, " / ", curr])}
        </h5>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="">
          <div className="row">
            <div className="col-md-6">
              <VerticalPair
                end={false}
                title="Pool Type"
                value={
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
                          ? `${
                              pool.tokenWeights.find(
                                (w) => w.address === t.address
                              )?.weight * 100
                            }%`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                {/* tiny reload button */}
                <button
                  className="btn btn-sm btn-outline-secondary fs-5 pt-2"
                  onClick={() => {
                    getUserBalanceOnceAndUpdateState(pool.address, userAddress);
                    State.update({
                      refreshTick: state.refreshTick + 1,
                    });
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
                {state.refreshTick >= 0 && (
                  <>
                    <Widget
                      src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/StakeUnstakeButtonAndForm"
                      props={{ ...unstakeWidgetProps }}
                      key={(state.refreshTick + 1).toString()}
                    />
                    <Widget
                      src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/StakeUnstakeButtonAndForm"
                      props={{ ...stakeWidgetProps }}
                      key={(state.refreshTick + 2).toString()}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// @ts-ignore
return <MainComponent />;
