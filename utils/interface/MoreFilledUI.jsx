// @ts-check
// zkEVM addresses
const knownAddresses = {
  /** main reference, priced by bb-o-USD */ "bb-o-USDT":
    "0x4b718e0e2fea1da68b763cd50c446fba03ceb2ea",
  /** reference for bb-o-USDT*/ "bb-o-USD":
    "0xe274c9deb6ed34cfe4130f8d0a8a948dea5bb286",
  /** NOT a reference, priced by bb-o-USD */ USDT: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
  /** reference for USDC */ "bb-o-USDC":
    "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
  /** priced by bb-o-USDC*/ USDC: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
  /** reference for WETH, circular pricing */ "B-wstETH-STABLE":
    "0xe1f2c039a68a216de6dd427be6c60decf405762a",
  /** priced by B-wstETH-STABLE, circular pricing*/ WETH: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
};

const url =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";

/**
 * @typedef {Object} SBalancer
 * @property {string} id
 * @property {number} poolCount
 * @property {string} totalLiquidity
 */

/**
 * @typedef {Object} SToken
 * @property {string} name
 * @property {string} symbol
 * @property {string} address
 * @property {number} decimals
 * @property {string} totalBalanceUSD
 * @property {string} totalBalanceNotional
 * @property {string} totalVolumeUSD
 * @property {string} totalVolumeNotional
 * @property {string|null} latestUSDPrice
 * @property {SLatestPrice|null} latestPrice
 */

/**
 * @typedef {Object} SLatestPrice
 * @property {string} pricingAsset
 * @property {string} price
 * @property {SPoolId} poolId
 */

/**
 * @typedef {Object} SPoolId
 * @property {string} totalWeight
 */

/**
 * @typedef {Object} SPool
 * @property {string} id
 * @property {string} address
 * @property {string[]} tokensList
 * @property {string} totalWeight
 * @property {string} totalShares
 * @property {string} holdersCount
 * @property {string} poolType
 * @property {number} poolTypeVersion
 * @property {{token: SToken}[]} tokens
 */

/**
 * @typedef {Object} SBalancerGQLResponse
 * @property {SBalancer[]} balancers
 * @property {SPool[]} pools
 */

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

/*make typedef for

const transformedPools: {
    totalValueLocked: string;
    tokenWeights: {
        address: string;
        weight: string;
    }[];
    id: string;
    address: string;
    tokensList: string[];
    totalWeight: string;
    totalShares: string;
    holdersCount: string;
    poolType: string;
    poolTypeVersion: number;
    tokens: Token[];
}[]
*/

/**
 * @typedef {Object} TokenWeights
 * @property {string} address
 * @property {string} weight
 */

/**
 * @typedef {Object} TransformedPool
 * @property {string} totalValueLocked
 * @property {TokenWeights[]} tokenWeights
 * @property {string} id
 * @property {string} address
 * @property {string[]} tokensList
 * @property {string} totalWeight
 * @property {string} totalShares
 * @property {string} holdersCount
 * @property {string} poolType
 * @property {number} poolTypeVersion
 * @property {SToken[]} tokens
 */

/**
 * @typedef {Object} TransformedData
 * @property {SBalancerGQLResponse["balancers"]} balancers
 * @property {TransformedPool[]} pools
 * @example const data = getTransformedData();
 * console.log(data);
 */

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

try {
  let data;
  try {
    data = getTransformedData();
  } catch (error) {
    // @ts-ignore
    return <div>Error getting data, please refresh this tab or component</div>;
  }
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
                      <div className="d-flex justify-content-end">
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
