// @ts-check

const graphQlUri =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";

/**
 * @description Fetches a URL and returns the body string synchronously
 * @param {string} graphQlUri - The URL to fetch
 * @returns {string} The body string
 * @example const body = fetchSync("https://example.com");
 */
function fetchGetSync(graphQlUri) {
  // @ts-ignore
  return fetch(graphQlUri).body;
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
  const { body } = fetch(graphQlUri, options);
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

const VerticalPair3 = ({ title, value, end }) => {
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
 * @param {TransformedData} data
 * @returns {{ [tokenAddress: string]: TransformedPool }}
 */
const getIndexedPoolAddresses2 = (/** @type {TransformedData} */ data) =>
  data.pools.reduce((acc, pool) => {
    acc[pool.address] = pool;
    return acc;
  }, {});

const getIndexedTokenAddresses2 = (/** @type {TransformedData} */ data) => {
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
const transformedData = getTransformedData();
const indexedTokenAddresses = getIndexedTokenAddresses2(transformedData);
const indexedPoolAddresses = getIndexedPoolAddresses2(transformedData);

/**
 * Form for a single token in the pool.
 * @typedef {Object} OneForm
 * @property {string} inputAmount - User input amount for the token in the pool.
 * @property {string} symbol - Self-explanatory.
 * @property {boolean} isSelected - Indicates whether the token is selected.
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
 */

/**
 * Forms object for the currency selector. There's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all".
 * @typedef {Object.<string, CurrencySelectorGroup>} CurrencySelectorFormGroupsObject
 */

/**
 * Object containing forms for the currency selector.
 * @type {CurrencySelectorFormGroupsObject}
 */
const forms = {
  // for the currency selector, there's one per pool address, and inside we'll have a mini form per token in the "one", and a form for the "all"
  // so we'll have a form for each token in the pool, and a form for the "all" in the pool
  ...Object.keys(indexedPoolAddresses).reduce(
    (
      /** @type {CurrencySelectorFormGroupsObject} */
      acc,
      /** @type {string} */
      poolAddress
    ) => {
      // just instantiate
      acc[poolAddress] = {
        allOrOne: "all",
        allForm: {
          totalAmount: "",
        },
        oneForms: {
          // now index the tokens & instantiate with inputAmount, symbol and isSelected
          ...indexedPoolAddresses[poolAddress].tokens.reduce(
            (
              /** @type {Object<string, OneForm>} */
              acc,
              token,
              i
            ) => {
              acc[token.address] = {
                inputAmount: "",
                symbol: token.symbol,
                isSelected: i === 0,
              };
              return acc;
            },
            {}
          ),
        },
        tokenSelectorIsOpen: false,
      };
      return acc;
    },
    {}
  ),
};
State.init({
  forms,
});

let data;
try {
  data = getTransformedData();
} catch (error) {
  // @ts-ignore
  return <div>Error getting data, please refresh this tab or component</div>;
}

// abstract updater for forms
function updateForm(
  /** @type {string} */ poolAddress,
  /** @type {CurrencySelectorGroup} */ newForm
) {
  State.update({
    forms: {
      ...state.forms,
      [poolAddress]: newForm,
    },
  });
}

function handleRadioChange(
  /** @type {string} */ poolAddress,
  /** @type {"all" | "one"} */ newAllOrOne
) {
  /** @type {CurrencySelectorGroup} */
  const changedForm = state.forms[poolAddress];
  if (changedForm.allOrOne === newAllOrOne) {
    return;
  }
  const formToChange = state.forms[poolAddress];
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    allOrOne: newAllOrOne,
  };
  updateForm(poolAddress, newForm);
}

function handleAllInputChange(
  /** @type {string} */ poolAddress,
  /** @type {string} */ newTotalAmount
) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.forms[poolAddress];
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    allForm: {
      ...formToChange.allForm,
      totalAmount: newTotalAmount,
    },
  };
  updateForm(poolAddress, newForm);
}

function handleOneInputChange(
  /** @type {string} */ poolAddress,
  /** @type {string} */ tokenAddress,
  /** @type {string} */ newInputAmount
) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.forms[poolAddress];
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    oneForms: {
      ...formToChange.oneForms,
      [tokenAddress]: {
        ...formToChange.oneForms[tokenAddress],
        inputAmount: newInputAmount,
      },
    },
  };
  updateForm(poolAddress, newForm);
}

function handleTokenSelect(
  /** @type {string} */ poolAddress,
  /** @type {string} */ tokenAddress
) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.forms[poolAddress];

  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,

    oneForms: {
      ...Object.keys(formToChange.oneForms).reduce(
        (
          /** @type {Object<string, OneForm>} */
          acc,
          /** @type {string} */
          tokenAddress
        ) => {
          acc[tokenAddress] = {
            ...formToChange.oneForms[tokenAddress],
            isSelected: false,
          };
          return acc;
        },
        {}
      ),
      [tokenAddress]: {
        ...formToChange.oneForms[tokenAddress],
        isSelected: true,
      },
    },
  };
  updateForm(poolAddress, newForm);
}

function handleClickCurrencySelector(/** @type {string} */ poolAddress) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.forms[poolAddress];
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    tokenSelectorIsOpen: !formToChange.tokenSelectorIsOpen,
  };
  updateForm(poolAddress, newForm);
}

/**
 * @param {{ poolAddress: string, data: TransformedData }} props
 */
function CurrencySelector({ data, poolAddress }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.forms[poolAddress];
  const { allOrOne, allForm, oneForms } = currencySelectorGroup;

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
          {/* RadioGroup selectors with All or One */}
          <RadioGroup.Root
            value={allOrOne}
            onChange={(newAllOrOne) =>
              handleRadioChange(poolAddress, newAllOrOne)
            }
          >
            <RadioGroup.Item value="all">
              <RadioGroup.Label>All</RadioGroup.Label>
            </RadioGroup.Item>
            <RadioGroup.Item value="one">
              <RadioGroup.Label>One</RadioGroup.Label>
            </RadioGroup.Item>
          </RadioGroup.Root>
          {/* Token dropdown for the One form */}
          <DropdownMenu.Root
            open={currencySelectorGroup.tokenSelectorIsOpen}
            onOpenChange={(isOpen) => {
              const newForm = {
                ...currencySelectorGroup,
                tokenSelectorIsOpen: isOpen,
              };
              updateForm(poolAddress, newForm);
            }}
          >
            <DropdownMenu.Trigger
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {Object.keys(oneForms).find(
                (tokenAddress) => oneForms[tokenAddress].isSelected
              ) || "Select a token"}
              <span className="ms-1">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={5}>
              {Object.keys(oneForms).map((oneFormTokenAddress) => {
                const oneForm = oneForms[oneFormTokenAddress];
                return (
                  <DropdownMenu.CheckboxItem
                    key={oneFormTokenAddress}
                    checked={oneForm.isSelected}
                    onCheckedChange={(isSelected) => {
                      if (isSelected) {
                        handleTokenSelect(poolAddress, oneFormTokenAddress);
                      }
                    }}
                  >
                    {oneForm.symbol}
                  </DropdownMenu.CheckboxItem>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        {/* input form to put how many tokens to stake */}
        {/* input form to put how many tokens to stake, use bootstrap, use functions */}
        <div className="ps-2">
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
            value={allOrOne === "all" ? allForm.totalAmount : ""}
            onChange={(event) =>
              handleAllInputChange(poolAddress, event.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
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
                      {/* <VerticalPair3>
                      Pool Type: {pool.poolType} {pool.poolTypeVersion}
                    </VerticalPair3>
                    <VerticalPair3>
                      Total Value Locked: {pool.totalValueLockedETH} ETH / $
                      {pool.totalValueLockedUSD}
                    </VerticalPair3> */}
                      <VerticalPair3
                        end={false}
                        title="Pool Type"
                        value={
                          // nonbreaking
                          <span className="text-nowrap">
                            {pool.poolType} v{pool.poolTypeVersion}
                          </span>
                        }
                      />
                      <VerticalPair3
                        end={false}
                        title="Total Value Locked"
                        value={`$${pool.totalValueLocked}`}
                      />
                    </div>
                    <div className="col-md-6">
                      <VerticalPair3
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
                        <VerticalPair3
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
