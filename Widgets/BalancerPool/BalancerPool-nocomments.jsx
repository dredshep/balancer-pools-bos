const erc20ABI = fetch(
  "https://raw.githubusercontent.com/dredshep/dev/main/abi.json"
).body;

State.init({
  poolBalance: undefined,
  errorGettingBalance: undefined,
  userAddress: undefined,
  refreshTick: 0,
});
if (state.errorGettingBalance)
  console.log("Error getting balance: ", state.errorGettingBalance);

const missingProps = [];

if (!props.pool) missingProps.push("pool (TransformedPool)");
if (!props.operation) missingProps.push('operation ("stake" | "unstake")');
if (!props.vaultAddress) missingProps.push("vaultAddress (string)");
if (!props.balancerQueriesAddress)
  missingProps.push("balancerQueriesAddress (string)");
if (!props.pool.id)
  missingProps.push("pool has no id, check type (TransformedPool)");

const pool = props.pool;

const VAULT_ADDRESS = props.vaultAddress;

const BALANCER_QUERIES_ADDRESS = props.balancerQueriesAddress;

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

const stakeWidgetProps = {
  pool,
  operation: "stake",
  vaultAddress: VAULT_ADDRESS,
  balancerQueriesAddress: BALANCER_QUERIES_ADDRESS,
};

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
            .map((t) => <span title={t.name}>{t.symbol || "a"}a</span>)

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

return <MainComponent />;
