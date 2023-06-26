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
    // console.log("my address", pool.address);
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
                address: token.address,
              };
              return acc;
            },
            {}
          ),
        },
        tokenSelectorIsOpen: false,
        tokenAddresses: indexedPoolAddresses[poolAddress].tokens.map(
          (token) => token.address
        ),
      };
      return acc;
    },
    {}
  ),
};
State.init({
  forms,
});

/**
 * Function to find the selected OneForm in a given CurrencySelectorGroup
 * @param {string} poolAddress - The address of the pool to search in.
 * @param {CurrencySelectorFormGroupsObject} forms - The forms object to search in.
 * @returns {OneForm | null} - The selected OneForm if found, null otherwise.
 */
function getSelectedOneFormInPool(poolAddress, forms) {
  if (forms[poolAddress]) {
    for (let key in forms[poolAddress].oneForms) {
      if (forms[poolAddress].oneForms[key].isSelected) {
        return forms[poolAddress].oneForms[key];
      }
    }
  }
  return null;
}

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

const myItemStyles = `
    border-radius: 3px;
    margin-bottom: 5px;
    background: #4A4F51;
    padding: 8px;
    cursor: pointer;
    /* deep shadow */
    
    &:hover {
        /*darken*/
        background: #3A3F41;
    }
`;
const MyCheckboxItem = styled("DropdownMenu.CheckboxItem")`
  ${myItemStyles}
`;

/**
 * @param {{ poolAddress: string, data: TransformedData, className: string, operation: "stake" | "unstake" }} props
 */
function CurrencySelector({ data, poolAddress, className, operation }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.forms[poolAddress];
  const { allOrOne, allForm, oneForms, tokenAddresses, tokenSelectorIsOpen } =
    currencySelectorGroup;
  // const whatever = tokenAddresses.map((a) => oneForms[a].isSelected);
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];
  // arrayOfSameLengthAsTokenAddresses.map((a) => oneForms[a].isSelected);
  const pool = indexedPoolAddresses[poolAddress];
  function handleSubmitAll(
    /** @type {string} */ poolAddress,
    /** @type {string} */ totalAmount
  ) {
    console.log("handleSubmitAll");
  }
  function handleSubmitOne(
    /** @type {string} */ poolAddress,
    /** @type {string} */ tokenAddress,
    /** @type {string} */ inputAmount
  ) {
    console.log("handleSubmitOne");
  }

  function setMaxOne(
    /** @type {string} */ poolAddress,
    /** @type {string} */ tokenAddress
  ) {
    console.log("setMaxOne");
  }

  function setMaxAll(/** @type {string} */ poolAddress) {
    console.log("setMaxAll");
  }

  /**
   * Returns a comma-separated string of token symbols for the selected tokens in the CurrencySelector.
   * @param {OneForm[]} oneForms - An object containing the form data for each token in the CurrencySelector.
   * @param {undefined[]} arrayOfSameLengthAsTokenAddresses - An array of the same length as the number of tokens in the CurrencySelector.
   * @returns {OneForm[]} A list of token symbols for the selected tokens.
   */
  function getOneFormListOfTokenSymbols(
    oneForms,
    arrayOfSameLengthAsTokenAddresses
  ) {
    return arrayOfSameLengthAsTokenAddresses
      .map((_, index) => {
        const tokenAddress = tokenAddresses[index];
        const oneForm = oneForms[tokenAddress];
        return oneForm;
      })
      .filter(
        (
          /** @type {OneForm} */
          oneForm
        ) => oneForm.isSelected
      );
  }

  // const tokens = pool.tokens;
  // const tokenSymbols = tokens.map((token) => token.symbol);
  // const tokenDecimals = tokens.map((token) => token.decimals);
  // const tokenBalances = tokens.map((token) => token.
  return (
    <div className={className}>
      <div
        className="d-flex flex-column container py-2 pb-3"
        // style={{
        //   zIndex: 1000,
        // }}
      >
        {/* title */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            marginBottom: "0.25rem",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {operation === "stake" ? "Stake" : "Unstake"}
          </div>
          {/* <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
          </div> */}
        </div>
        <div className="d-flex align-items-center mb-2">
          {/* RadioGroup selectors with All or One; display only if operation is "unstake" */}
          {operation === "unstake" && (
            <RadioGroup.Root>
              {/* <RadioGroup.Content> */}
              <RadioGroup.RadioGroup
                value={allOrOne}
                // make this transparent cuz this is just a label thing and then we'll modify the indicator to make it round
                style={{
                  backgroundColor: "transparent",
                  // make height 40px
                  height: "40px",
                  width: "100%",
                }}
                onValueChange={(
                  /** @type {"all" | "one"} */
                  newAllOrOne
                ) => {
                  console.log("newAllOrOne", newAllOrOne);
                  return handleRadioChange(poolAddress, newAllOrOne);
                }}
              >
                {/* <RadioGroup.Indicator value="all"> */}
                <RadioGroup.Item
                  value="all"
                  style={{
                    fontWeight: allOrOne === "all" ? "bold" : "normal",
                    // Background is 6e4ac5 if selected, otherwise it's 585858
                    backgroundColor: allOrOne === "all" ? "#6e4ac5" : "#585858",
                    // round corners to the left by 4 px
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    height: "40px",
                    // make border 1px solid
                    // border:
                    //   "1px solid " + (allOrOne === "all" ? "#6e4ac5" : "#585858"),
                    // make border right 0px
                    border: "0px",
                    color: "white",
                    letterSpacing: allOrOne === "all" ? "0.033em" : "0.01em",
                    // horizontal padding is 16px and vertical padding is 4px
                    padding: "4px 16px",
                  }}
                >
                  <RadioGroup.Indicator />
                  {/* <i className="bi bi-check-circle-fill"></i> */}
                  {/* </RadioGroup.Indicator> */}
                  {/* All */}
                  <label
                    className="form-check-label"
                    style={{
                      cursor: "pointer",
                    }}
                    // highlight if selected
                  >
                    All
                  </label>
                </RadioGroup.Item>
                {/* </RadioGroup.Indicator> */}
                <RadioGroup.Item
                  value="one"
                  style={{
                    cursor: "pointer",
                    fontWeight: allOrOne === "one" ? "bold" : "normal",
                    // Background is 6e4ac5 if selected, otherwise it's 585858
                    backgroundColor: allOrOne === "one" ? "#6e4ac5" : "#585858",
                    // round corners to the right by 4 px
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                    height: "40px",
                    // make border 1px solid
                    // border:
                    //   "1px solid " + (allOrOne === "one" ? "#6e4ac5" : "#585858"),
                    // make border left 0px
                    border: "0px",
                    color: "white",
                    letterSpacing: allOrOne === "one" ? "0.033em" : "0.01em",
                    // horizontal padding is 16px and vertical padding is 4px
                    padding: "4px 16px",
                  }}
                >
                  <RadioGroup.Indicator>{/* <>One</> */}</RadioGroup.Indicator>
                  <label
                    className="form-check-label"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    One
                  </label>
                </RadioGroup.Item>
              </RadioGroup.RadioGroup>
              {/* </RadioGroup.Content> */}
            </RadioGroup.Root>
          )}
          {/* <div className="d-flex flex-row ms-2">
            {
              // say "token" if one or "tokens" if all
              (allOrOne === "one" ? "token" : "tokens") + ""
            }
          </div> */}
        </div>
        {/* here goes the title: "Input Amount" */}
        {(operation === "stake" ||
          (operation === "unstake" && allOrOne === "one")) && (
          <>
            <div className="d-flex flex-row my-2">
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Select a token to {operation === "stake" ? "stake" : "unstake"}.
              </div>
            </div>
            {/* Token dropdown for the One form*/}
            {/* make a div same color as input here, rounded right, straight left, and it'll have the selected token inside */}

            <div
              style={{
                backgroundColor: "#585858",
                color: "white",
                // round right corners
                borderRadius: "4px",
                // horizontal padding is 16px and vertical padding is 4px
                padding: "4px 4px",
                height: "40px",
                // make it a flexbox
                display: "flex",
                // center the text
                alignItems: "center",
                // justify the text to the right
                justifyContent: "center",
              }}
            >
              <DropdownMenu.Root
                open={currencySelectorGroup.tokenSelectorIsOpen}
                style={{ position: "relative" }}
                onOpenChange={(
                  /** @type {boolean} */
                  isOpen
                ) => {
                  console.log(
                    "isOpen",
                    isOpen,
                    "containinAmountOfTokenssss",
                    state.forms[poolAddress],
                    // tokenAddresses.length,
                    "tokenAddresses",
                    state.forms[poolAddress].tokenAddresses,
                    "poolAddress",
                    poolAddress
                    // "state",
                    // JSON.stringify(state, null, 2)
                  );
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
                    color: "white",
                    letterSpacing: "0.033em",
                    display: "flex",
                  }}
                >
                  {tokenAddresses.length === 0 ? (
                    <></>
                  ) : allOrOne === "one" || operation === "stake" ? (
                    // if one is selected, show the selected token
                    <span
                      style={{
                        // make it a flexbox
                        display: "flex",
                        // center the text
                        alignItems: "center",
                        // justify the text to the right
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* find selected token address and use its symbol, if none are there, put "Select a token" */}
                      {
                        // use this length to iterate through the array of oneForms without actually using Object.keys(oneForm) which is disallowed
                        arrayOfSameLengthAsTokenAddresses.reduce(
                          (acc, _, index) => {
                            const tokenAddress = tokenAddresses[index];
                            const oneForm = oneForms[tokenAddress];
                            if (oneForm.isSelected) {
                              return oneForm.symbol;
                            }
                            return acc;
                          },
                          "Select a token"
                        )
                      }
                      {/* <i className="bi bi-chevron-down"></i> */}
                    </span>
                  ) : (
                    // if all is selected, show "All"
                    "All"
                  )}
                  {/* {Object.keys(oneForms).find(
                (tokenAddress) => oneForms[tokenAddress].isSelected
              ) || "Select a token"} */}
                  <span className="ms-1">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  sideOffset={5}
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    backgroundColor: "#161616",
                    padding: "5px",
                    borderRadius: "4px",
                    paddingBottom: "0px",
                    /*set width so it's the maximum allowed by the interior content (width: max-content)*/
                    width: "max-content",
                  }}
                >
                  {arrayOfSameLengthAsTokenAddresses.map((_, index) => {
                    const tokenAddress = tokenAddresses[index];
                    const oneForm = oneForms[tokenAddress];
                    return (
                      <MyCheckboxItem
                        key={tokenAddress}
                        checked={oneForm.isSelected}
                        onCheckedChange={(
                          /** @type {boolean} */
                          isSelected
                        ) => {
                          if (isSelected) {
                            handleTokenSelect(poolAddress, tokenAddress);
                          }
                        }}
                      >
                        <DropdownMenu.ItemIndicator
                          style={{ marginRight: "5px" }}
                        >
                          <i className="bi bi-check-circle-fill"></i>
                        </DropdownMenu.ItemIndicator>
                        {oneForm.symbol}
                      </MyCheckboxItem>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </>
        )}
        {/* here goes the title: "Input Amount" */}
        <div className="d-flex flex-row my-2">
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Input Amount{" "}
            <span
              style={{ color: "#6e4ac5", filter: "brightness(60%)" }}
              onClick={() => {
                // if all setMaxAll if not setMaxOne
                if (allOrOne === "all") {
                  setMaxAll(poolAddress);
                } else {
                  const selectedTokenAddress = getSelectedOneFormInPool(
                    poolAddress,
                    state.forms
                  )?.address;
                  if (!selectedTokenAddress) return;
                  setMaxOne(poolAddress, selectedTokenAddress);
                }
              }}
            >
              (Max: "user balance")
            </span>
          </div>
        </div>
        <div className="d-flex flex-row mb-2">
          {/* make an input here that will get user inputAmount & pass it to the functions above */}
          <input
            type="text"
            className="form-control"
            style={{
              backgroundColor: "#585858",
              color: "white",
              border: "0px",
              // unround right corners if one is selected, otherwise round right corners
              // borderTopRightRadius: allOrOne === "one" ? "0px" : "4px",
              // borderBottomRightRadius: allOrOne === "one" ? "0px" : "4px",
              // borderTopRightRadius: "0px",
              // borderBottomRightRadius: "0px",
              // horizontal padding is 16px and vertical padding is 4px
              padding: "4px 16px",
              // maxWidth: "100px" if one is selected, otherwise 150px
              // maxWidth: allOrOne === "one" ? "100px" : "100%",
              height: "40px",
            }}
            // path to amount: sampleForms.forms["0"].oneForms["0"].inputAmount; but we gotta find which one is selected
            value={
              allOrOne === "all" || operation === "stake"
                ? allForm.totalAmount
                : oneForms[ // takes a string (tokenAddress)
                    // use this length to iterate through the array of oneForms without actually using Object.keys(oneForm) which is disallowed
                    arrayOfSameLengthAsTokenAddresses.reduce(
                      (acc, _, index) => {
                        const tokenAddress = tokenAddresses[index];
                        const oneForm = oneForms[tokenAddress];
                        if (oneForm.isSelected) {
                          return tokenAddress;
                        }
                        return acc;
                      },
                      ""
                    )
                  ].inputAmount
            }
            onChange={(e) => {
              const newForm = {
                ...currencySelectorGroup,
                inputAmount: e.target.value,
              };
              updateForm(poolAddress, newForm);
            }}
          />
        </div>
        {/* submit buttons */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ width: "100%" }}
        >
          <button
            className="btn btn-primary btn-sm"
            style={{ width: "100%", height: "40px" }}
            onClick={() => {
              // if all is selected, submit the form
              if (allOrOne === "all") {
                // address & amount
                handleSubmitAll(poolAddress, allForm.totalAmount);
              } else {
                const tokenAddress = Object.keys(oneForms).find(
                  (tokenAddress) => oneForms[tokenAddress].isSelected
                );
                if (!tokenAddress) {
                  console.log("Error: token not selected");
                  return;
                }
                // if one is selected, submit the form
                handleSubmitOne(
                  poolAddress,
                  oneForms[tokenAddress].inputAmount
                );
              }
            }}
          >
            {allOrOne === "all" ? "Submit All" : "Submit One"}
          </button>
          {/* show the % of each token that the pool has multiplied by the input amount */}
          {
            // if all, show all the tokens, so if there's 30% usdt and 70% eth, show inputAmount*30% usdt and inputAmount*70% eth
            // allOrOne === "all" ? (
            //   <div
            //     className="d-flex justify-content-between align-items-center"
            //     style={{ width: "100%" }}
            //   >
            //     {tokenAddresses.map((tokenAddress) => {
            //       const oneForm = oneForms[tokenAddress];
            //       // get the contents of the pool from the pool address
            //       /** @type {TransformedPool} */
            //       const pool = state.pools[poolAddress];
            //       return (
            //         <div
            //           key={tokenAddress}
            //           className="d-flex flex-column align-items-center"
            //           style={{ width: "100%" }}
            //         >
            //           {
            //             // if the pool has the token, show the % of the pool that the token is
            //             pool.tokens[tokenAddress] ? (
            //               <div
            //                 className="d-flex justify-content-between align-items-center"
            //                 style={{ width: "100%" }}
            //               >
            //                 {/* show the % of the pool that the token is */}
            //                 <span
            //                   style={{
            //                     color: "white",
            //                     fontSize: "0.8rem",
            //                     fontWeight: "bold",
            //                     letterSpacing: "0.033em",
            //                   }}
            //                 >
            //                   {pool.tokens[tokenAddress]}%
            //                 </span>
            //                 {/* show the % of the pool that the token is */}
            //                 <span
            //           }
            // })}
          }
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
                  <div className="mt-3 d-flex justify-content-end">
                    {/* <CurrencySelector poolAddress={pool.address} data={data} /> */}
                    <div className="d-flex flex-column align-items-end">
                      {/* <p className="text-end fs-3">
                      Your Balance: {pool.userBalance}
                    </p> */}
                      <div className="d-flex justify-self-end">
                        {/* div with rounded corners on the left side, content is USDT and a down arrow, it's a dropdown */}
                        <VerticalPair3
                          title="Your Balance"
                          value="NOT IMPLEMENTED"
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
                              filter:
                                "hue-rotate(40deg) saturate(80%) brightness(115%)",
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
