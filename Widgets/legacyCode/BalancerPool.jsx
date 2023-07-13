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
/**
 * @typedef {Object} State
 * @property {CurrencySelectorFormGroupsObject} forms - Forms object for the currency selector.
 * @property {string | undefined} userAddress - User's address.
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 */

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
            {/* <VerticalPair3>
                      Pool Type: {pool.poolType} {pool.poolTypeVersion}
                    </VerticalPair3>
                    <VerticalPair3>
                      Total Value Locked: {pool.totalValueLockedETH} ETH / $
                      {pool.totalValueLockedUSD}
                    </VerticalPair3> */}
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
          {/* <CurrencySelector poolAddress={pool.address} data={data} /> */}
          <div className="d-flex flex-column align-items-end">
            {/* <p className="text-end fs-3">
                      Your Balance: {pool.userBalance}
                    </p> */}
            <div className="d-flex justify-self-end">
              {/* div with rounded corners on the left side, content is USDT and a down arrow, it's a dropdown */}
              <VerticalPair
                title="Your Balance"
                value={state.forms[pool.address]?.poolBalance}
                end
              />
            </div>
            <div className="d-flex justify-content-end">
              {/* <button
                          className="btn btn-lg btn-secondary me-3 fw-bold border-0"
                          style={{
                            letterSpacing: "0.033em",
                            // desaturate completely and lighten by 50%
                            filter: "saturate(0%) brightness(100%)",
                          }}
                        >
                          Unstake
                        </button> */}
              <Popover.Root>
                <Popover.Trigger
                  className="btn btn-lg btn-secondary me-3 fw-bold border-0"
                  style={{
                    letterSpacing: "0.033em",
                    // desaturate completely and lighten by 50%
                    filter: "saturate(0%) brightness(100%)",
                  }}
                >
                  Unstake
                </Popover.Trigger>
                <Popover.Content
                  sideOffset={10}
                  alignOffset={10}
                  // make it appear at the top of the button
                  side="top"
                  align="end"
                >
                  <Popover.Arrow
                    // arrow is black, make it secondary, it's a svg contained inside this element as a child
                    style={{
                      fill: "var(--bs-secondary)",
                      // seems to be a tiny bit ligher than the content, so make it a bit darker
                      filter: "brightness(81%)",
                    }}
                  />
                  <CurrencySelector
                    className="bg-secondary text-light border-0 rounded-2"
                    poolAddress={pool.address}
                    data={data}
                    operation="unstake"
                  />
                </Popover.Content>
              </Popover.Root>
              <Popover.Root
                style={
                  {
                    // display: "relative",
                  }
                }
              >
                {/* <Popover.Anchor
                            style={{
                              display: "absolute",
                              // make it like 200 pixels above the button
                              top: "-200px",
                              // make it like 50 pixels to the left of the button
                              left: "-50px",
                            }}
                          > */}
                <Popover.Trigger
                  className="btn btn-lg btn-primary fw-bold border-0"
                  // dataSide="top"
                  // dataAlign="end"
                  style={{
                    letterSpacing: "0.033em",
                    filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                  }}
                >
                  Stake
                </Popover.Trigger>
                {/* </Popover.Anchor> */}
                {/* put the content as absolute and on top left */}
                <Popover.Content
                  sideOffset={10}
                  alignOffset={10}
                  // make it appear at the top of the button
                  side="top"
                  align="end"
                >
                  <Popover.Arrow
                    // arrow is black, make it secondary, it's a svg contained inside this element as a child
                    style={{
                      fill: "var(--bs-secondary)",
                      // seems to be a tiny bit ligher than the content, so make it a bit darker
                      filter: "brightness(81%)",
                    }}
                  />
                  <CurrencySelector
                    className="bg-secondary text-light border-0 rounded-2"
                    poolAddress={pool.address}
                    data={data}
                    operation="stake"
                  />
                </Popover.Content>
              </Popover.Root>
              {/* <button
                          className="btn btn-lg btn-primary fw-bold border-0"
                          style={{
                            letterSpacing: "0.033em",
                            filter:
                              "hue-rotate(40deg) saturate(80%) brightness(115%)",
                          }}
                        >
                          Stake
                        </button> */}
            </div>
            {/* <StakeForm poolAddress={pool.id} */}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// @ts-ignore
return <MainComponent />;
