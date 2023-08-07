// @ts-check

/** @typedef {Object} SBalancer @property {string} id @property {number} poolCount @property {string} totalLiquidity */
/** @typedef {Object} SToken @property {string} name @property {string} symbol @property {string} address @property {number} decimals @property {string} totalBalanceUSD @property {string} totalBalanceNotional @property {string} totalVolumeUSD @property {string} totalVolumeNotional @property {string | null} latestUSDPrice @property {SLatestPrice | null} latestPrice */
/** @typedef {Object} SLatestPrice @property {string} pricingAsset @property {string} price @property {SPoolId} poolId */
/** @typedef {Object} SPoolId @property {string} totalWeight */
/** @typedef {Object} SPool @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} totalLiquidity @property {string} poolType @property {number} poolTypeVersion @property {{ token: SToken }[]} tokens @property {string} owner @property {number} createTime*/
/** @typedef {Object} SBalancerGQLResponse @property {SBalancer[]} balancers @property {SPool[]} pools */
/** @typedef {Object} TokenWeights @property {string} address @property {number} weight */
/** @typedef {Object} TransformedPool @property {string} totalValueLocked @property {TokenWeights[]} tokenWeights @property {string} id @property {string} address @property {string[]} tokensList @property {string} totalWeight @property {string} totalShares @property {string} holdersCount @property {string} poolType @property {number} poolTypeVersion @property {SToken[]} tokens @property {string} owner @property {number} createTime*/
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
 * @property {boolean} seeMore - Whether the user has clicked the "see more" button
 */

State.init({
  poolBalance: undefined,
  errorGettingBalance: undefined,
  userAddress: undefined,
  refreshTick: 0,
  seeMore: false,
});

function toggleSeeMore() {
  State.update({ seeMore: !state.seeMore });
}

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
// @ts-ignore
if (props.pool && !props.pool.owner)
  missingProps.push("pool has no owner, check type (TransformedPool)");
// @ts-ignore
if (props.pool && !props.pool.createTime)
  missingProps.push("pool has no createTime, check type (TransformedPool)");
// @ts-ignore
if (!props.chainId) missingProps.push("chainId (number | string)");
// @ts-ignore
if (!props.balancerTokens)
  missingProps.push(`balancerTokens (APRApiResponse["tokens"])`);

/** @type {TransformedPool} */
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

/** @type {number | string} */
const CHAIN_ID =
  // @ts-ignore
  props.chainId;

/** @type {APRApiResponse["tokens"]} */
const BALANCER_TOKENS =
  // @ts-ignore
  props.balancerTokens;

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

/**
 * Formats and abbreviates a number with a suffix based on its magnitude.
 * @param {number} num - The number to format and abbreviate.
 * @returns {string} The formatted and abbreviated number with a suffix.
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
    <div className="d-flex flex-column align-items-start">
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

const HoverableTd = styled.td`
  /* align td content center in the table way */
  text-align: center;
  &:hover {
    background: #2f2f2f; /* hover effect */
    cursor: pointer; /* hand cursor on hover */
  }
`;

const ImageWithPlaceholder = ({
  imageUrl,
  placeholderUrl,
  index,
  length,
  alt,
}) => {
  // @ts-ignore
  const imageExists = fetch(imageUrl)?.body;
  const zIndex = length - index;
  const marginLeft = index === 0 ? "" : "-7px";
  return imageExists ? (
    <img
      src={imageUrl}
      alt={alt}
      width="24"
      height="24"
      className="rounded-circle"
      style={{
        marginLeft,
        zIndex,
      }}
    />
  ) : (
    <img
      src={placeholderUrl}
      alt={alt}
      width="24"
      height="24"
      className="rounded-circle"
      style={{ marginLeft, zIndex }}
    />
  );
};

function stringNumToFixed2(stringNum) {
  return stringNum === undefined ? undefined : parseFloat(stringNum).toFixed(2);
}

/**
 * Converts Unix timestamp to ISO date format.
 * @param {number} unixTime - Unix timestamp in seconds.
 * @returns {string} - ISO date format string (yyyy-mm-dd). Example: "2021-01-23"
 */
function unixTimeToISO(unixTime) {
  return new Date(unixTime * 1000).toISOString().slice(0, 10);
}

/**
 * @param {string} address - hex address
 * @returns {string} 3 comma-separated hex colors. Example: "ff0000,00ff00,0000ff"
 */
function addressTo3Colors(address) {
  const hexColors = address.slice(2);
  const color1 = hexColors.slice(0, 6);
  const color2 = hexColors.slice(6, 12);
  const color3 = hexColors.slice(12, 18);
  return `shape1Color=${color1}&shape2Color=${color2}&shape3Color=${color3}`;
}

function CoolTr() {
  return (
    <tr
      onClick={() => {
        /* implement your on click function here */
        toggleSeeMore();
      }}
    >
      <td>
        <div className="d-flex">
          {pool.tokensList.map((token, index, arr) => (
            <ImageWithPlaceholder
              key={token}
              imageUrl={`https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/${token}.png`}
              placeholderUrl={`https://api.dicebear.com/6.x/shapes/svg?seed=${token}&height=24&width=24&${addressTo3Colors(
                token
              )}`}
              alt={token}
              index={index}
              length={arr.length}
            />
          ))}
        </div>
      </td>
      <td>{pool.tokens.map((t) => t.symbol).join(" / ")}</td>
      <td>
        <Widget
          src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/APRText"
          props={{
            chainId: CHAIN_ID,
            poolId: pool.id,
          }}
        />
      </td>
      <td>${pool.totalValueLocked}</td>
      <td>
        {stringNumToFixed2(state.poolBalance) ?? "-"}
        {state.poolBalance ? "BPT" : ""}
      </td>
      {/* view more with quotes to the right like >> but curved */}
      <Popover.Root>
        <HoverableTd
          style={{
            padding: 0,
            borderSpacing: 0,
            height: "45px",
            width: "45px",
          }}
        >
          <Popover.Content asChild>
            <div
              className="border-2 border-secondary rounded-4 shadow border-bottom-1"
              style={{
                zIndex: "3",
                backgroundColor: "#393e41",
                // maxWidth: "472px",
              }}
            >
              {/* title bar with close button */}
              <div className="d-flex justify-content-between align-items-center pb-4 border-bottom border-secondary pt-4 px-4">
                <div>
                  <h5 className="text-light fw-bold d-flex p-0 m-0">
                    Pool Details
                  </h5>
                </div>
                <div>
                  <Popover.Close className="btn btn-sm btn-secondary">
                    <i className="bi bi-x-lg text-white"></i>
                  </Popover.Close>
                </div>
              </div>
              <div
                style={
                  {
                    // width: "100%",
                    // display: "flex",
                    // flexDirection: "column",
                    // make the flex have 2 items at most per row
                  }
                }
                // make the flex wrap
                className="d-flex w-100 gap-3 col-12 p-4"
              >
                {/* <div className="d-flex justify-content-between border-bottom-1 p-2">
            <div className="fw-bold">Amount of Holders</div>
            <div>{pool.holdersCount}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="fw-bold">Pool Type</div>
            <div>{pool.poolType}</div>
          </div> */}
                <div className="col-md-6">
                  <VerticalPair
                    end={false}
                    title="Amount of Holders"
                    value={`${pool.holdersCount}`}
                  />
                  <VerticalPair
                    end={false}
                    title="Owner"
                    value={
                      <a
                        href={`https://etherscan.io/address/${pool.owner}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {/* shorten it like this: 0x12...321514 */}
                        {pool.owner.slice(0, 6) +
                          "..." +
                          pool.owner.slice(pool.owner.length - 6)}
                      </a>
                    }
                  />
                </div>
                <div className="col-md-6">
                  {/* <VerticalPair
                    end={false}
                    title="Token Balance"
                    value={pool.tokens.reduce(
                      (acc, token) =>
                        acc +
                          parseFloat(
                            stringNumToFixed2(token.totalBalanceNotional) || "0"
                          ) || 0,
                      0
                    )}
                  /> */}
                  <VerticalPair
                    end={false}
                    title="Pool Type"
                    value={`${pool.poolType} ${pool.poolTypeVersion}`}
                  />
                  <VerticalPair
                    end={false}
                    title="Create Time"
                    value={unixTimeToISO(pool.createTime)}
                  />
                </div>
                {/* <div className="col-md-6">
                <VerticalPair
                  end={false}
                  title="Pool Type"
                  value={`${pool.poolType} ${pool.poolTypeVersion}`}
                />
              </div> */}
              </div>

              <div className="d-flex justify-content-between text-light fw-bold rounded-top align-items-center px-4">
                <div>
                  {/* 2x2 grid with some info like amount of holders, pool type, token composition (weights) */}
                  <PrettyTable className="col-md-6">
                    {/* <VerticalPair
                end={false}
                title="Amount of Holders"
                value={`${pool.holdersCount}`}
              /> */}
                    <Widget
                      src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/BalancerAPITokenTable"
                      props={{
                        tokens: BALANCER_TOKENS,
                      }}
                    />
                    {/* <table
                      className="table table-sm table-transparent text-light"
                      style={{
                        // max size is like 150px
                        maxWidth: "200px",
                        marginTop: "-0.25rem",
                      }}
                    >
                      <thead>
                        <tr className="border-secondary">
                          <th className="fw-bold">Token</th>
                          <th className="fw-bold">Weight</th>
                          <th className="fw-bold">Amount</th>
                          <th className="fw-bold">USD&nbsp;Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pool.tokens.map((t) => (
                          <tr key={t.symbol}>
                            <td title={t.name}>{t.symbol}</td>
                            <td>
                              {pool.tokenWeights.find(
                                (w) => w.address === t.address
                              )
                                ? `${
                                    (pool?.tokenWeights?.find(
                                      (w) => w.address === t.address
                                    )?.weight ?? 0) * 100
                                  }%`
                                : "N/A"}
                            </td>
                            <td key={"balance" + t.address + state.refreshTick}>
                              {formatAndAbbreviateNumber(
                                parseFloat(
                                  stringNumToFixed2(t.totalBalanceNotional) ??
                                    "0"
                                )
                              )}
                            </td>
                            <td key={"price" + t.address + state.refreshTick}>
                              ${parseFloat(t.latestUSDPrice || "0").toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                  </PrettyTable>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3 pb-4 px-4">
                {state.refreshTick >= 0 && (
                  <div className="d-flex gap-3 mt-4">
                    <button
                      className="btn btn-sm btn-outline-secondary fs-5 pt-2"
                      onClick={() => {
                        getUserBalanceOnceAndUpdateState(
                          pool.address,
                          userAddress
                        );
                        State.update({
                          refreshTick: state.refreshTick + 1,
                        });
                      }}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                    {/* <Web3Connect /> */}
                    {/* <div> */}
                    <div style={{ maxWidth: "150px" }}>
                      <Widget
                        src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/StakeUnstakeButtonAndForm"
                        props={{ ...unstakeWidgetProps }}
                        key={(state.refreshTick + 1).toString()}
                      />
                    </div>
                    <div style={{ maxWidth: "150px" }}>
                      <Widget
                        src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/StakeUnstakeButtonAndForm"
                        props={{ ...stakeWidgetProps }}
                        key={(state.refreshTick + 2).toString()}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                )}
              </div>
              {/* <Popover.Arrow
          style={{
            fill: "var(--bs-secondary)",
          }}
        /> */}
            </div>
          </Popover.Content>
          {/* <div
            className="d-flex justify-content-center align-items-center bg-secondary"
            style={{
              height: "100%",
              width: "100%",
            }}
          > */}
          <Popover.Trigger
            className="d-flex justify-content-center align-items-center"
            asChild
            style={{
              // marginBottom: "-1px",
              height: "100%",
              width: "100%",
            }}
          >
            <i
              className="bi bi-graph-up-arrow text-primary"
              style={{
                filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
              }}
            ></i>
          </Popover.Trigger>
          {/* </div> */}
        </HoverableTd>
      </Popover.Root>
    </tr>
  );
}

function Table() {
  return (
    <PrettyTable>
      <table className="table table-sm table-transparent text-light bg-dark">
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
            <th className="fw-bold">Pool value</th>
            <th className="fw-bold">Your balance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <CoolTr />
          <CoolTr />
          <CoolTr />
          <CoolTr />
        </tbody>
      </table>
    </PrettyTable>
  );
}

function MainComponent() {
  return (
    <div>
      <Web3Connect />
      <Table />
    </div>
  );
}

// @ts-ignore
// return <MainComponent />;

// @ts-ignore
return <CoolTr />;
