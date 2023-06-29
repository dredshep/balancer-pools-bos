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
 * @typedef {Object} StateAsVar
 * @property {CurrencySelectorFormGroupsObject} forms - Forms object for the currency selector.
 * @property {string | undefined} userAddress - User's address.
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 */

// /****************************** START OF TEMPORARY *****************************/

// const zkEVMGraphQLUri =
//   "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";
// /**
//  * @name calculateTokenWeights
//  * @description Calculate the token weights in a pool
//  * @param {SBalancerGQLResponse["pools"][0]} pool
//  * @returns {{
//  * address: string,
//  * weight: string
//  * }[]}
//  * @example const tokenWeights = calculateTokenWeights(pool);
//  * console.log(tokenWeights);
//  */
// function calculateTokenWeights(pool) {
//   const totalValueLocked = calculateTotalValueLocked(pool);
//   const getWeight = (
//     /** @type {number} */ value,
//     /** @type {number} */ decimals
//   ) =>
//     (
//       (value / (Number(totalValueLocked.num) * Number("1e" + decimals))) *
//       100
//     ).toFixed(2) + "%";
//   const weights = pool.tokens.map((_token) => {
//     const { token } = _token;
//     const weight = getWeight(parseFloat(token.totalBalanceUSD), token.decimals);
//     return {
//       address: token.address,
//       weight,
//       token,
//     };
//   });
//   return weights;
// }
// /**
//  * @name formatAndAbbreviateNumber
//  * @description Formats a number with commas as thousands separators and abbreviates it with a letter suffix
//  * @param {number} num - The number to format and abbreviate
//  * @returns {string} The formatted and abbreviated number as a string
//  * @example const formattedNumber = formatAndAbbreviateNumber(1234567.89);
//  * console.log(formattedNumber); // "1.23M"
//  */
// function formatAndAbbreviateNumber(num) {
//   let counter = 0;
//   const abbreviations = ["", "K", "M", "B", "T", "Quadrillion", "Quintillion"];

//   while (num >= 1000) {
//     num /= 1000;
//     counter++;
//   }

//   const stringNum = num.toFixed(2);

//   // Split number into integer and decimal parts
//   let parts = Number(stringNum).toString().split(".");
//   // Add commas every three digits to the integer part
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   return parts.join(".") + abbreviations[counter];
// }
// function calculateTotalValueLocked(pool) {
//   const totalLiquidity = pool.tokens.reduce((acc, _token) => {
//     const { token } = _token;
//     const usdBalance =
//       parseFloat(token.totalBalanceUSD) / Number("1e" + token.decimals);
//     if (usdBalance) {
//       return acc + usdBalance;
//     }
//     return acc;
//   }, 0);
//   return {
//     num: totalLiquidity,
//     str: formatAndAbbreviateNumber(totalLiquidity),
//   };
// }
// /**
//  * @name runAllInOneQuery
//  * @description Get the pool data from the Balancer subgraph
//  * @returns {SBalancerGQLResponse}
//  * @example const data = runAllInOneQuery();
//  */
// function runAllInOneQuery() {
//   const query = `{
//     balancers(first: 5) {
//       id
//       poolCount
//       totalLiquidity
//     }
//     pools(first: 5) {
//       id
//       address
//       tokensList
//       totalWeight
//       totalShares
//       holdersCount
//       poolType
//       poolTypeVersion
//       tokens {
//         token {
//           name
//           symbol
//           address
//           decimals
//           totalBalanceUSD
//           totalBalanceNotional
//           totalVolumeUSD
//           totalVolumeNotional
//           latestUSDPrice
//           latestPrice {
//             pricingAsset
//             price
//             poolId {
//               totalWeight
//             }
//           }
//         }
//       }
//     }
//   }`;
//   function getGraphQlQuerySync(query) {
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     };
//     // @ts-ignore
//     const { body } = fetch(zkEVMGraphQLUri, options);
//     return body.data;
//   }
//   /** @type {SBalancerGQLResponse} */
//   const data = getGraphQlQuerySync(query);
//   return data;
// }
// /**
//  * @name getTransformedData
//  * @description Get the transformed data from the Balancer subgraph data and the calculations
//  * @returns {TransformedData}
//  * @example const data = getTransformedData();
//  * console.log(data);
//  */

// function getTransformedData() {
//   const data = runAllInOneQuery();
//   /** @type {TransformedPool[]} */
//   const transformedPools = data.pools.map((pool) => {
//     const totalValueLocked = calculateTotalValueLocked(pool).str;
//     const tokenWeights = calculateTokenWeights(pool);
//     const flattenedTokens = pool.tokens.map((_token) => {
//       const { token } = _token;
//       return token;
//     });
//     const tokens = flattenedTokens.sort((a, b) => {
//       const aBalance = parseFloat(a.totalBalanceUSD);
//       const bBalance = parseFloat(b.totalBalanceUSD);
//       return bBalance - aBalance;
//     });

//     // fill in the rest of the data
//     return {
//       ...pool,
//       tokens,
//       totalValueLocked,
//       tokenWeights,
//     };
//   });
//   /** @type {TransformedData} */
//   const transformedData = {
//     balancers: data.balancers,
//     pools: transformedPools,
//   };
//   return transformedData;
// }
// const transformedData = getTransformedData();

// const erc20ABI =
//   // @ts-ignore
//   fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;

// const pool = transformedData.pools[0];

// /****************************** /END OF TEMPORARY *****************************/

// // @ts-ignore
// if (!props.pool)
//   // @ts-ignore
//   return <>Prop required but not provided: pool (type: TransformedPool)</>;
// /** @type {TransformedPool} */
// const pool =
//   // @ts-ignore
//   props.pool;

// // @ts-ignore
// if (!props.erc20ABI)
//   // @ts-ignore
//   return <>Prop required but not provided: erc20ABI (type: string)</>;
// /** @type {string} */
// const erc20ABI =
//   // @ts-ignore
//   props.erc20ABI;

/** @type {"stake"|"unstake"} */
const operation =
  // @ts-ignore
  props.operation;

/** @type {TransformedPool} */
const pool =
  // @ts-ignore
  props.pool;

/** @type {string} */
const className =
  // @ts-ignore
  props.className;

/** @type {string} */
const erc20ABI =
  // @ts-ignore
  props.erc20ABI;

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
State.update({ userAddress });

/**
 * @param {string} poolAddress
 * @param {string} userAddress
 * @returns {Promise<string>|string|undefined}
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

/********************************
 * END BALANCE FETCHING THINGY
 *******************************/

/**
 * @typedef {Object} State
 * @property {string} inputAmount - The input amount (that user attempts to type in).
 * @property {string } lastValidInput - The last valid input amount.
 * @property {string | undefined} selectedToken - The selected token's address.
 * @property {boolean} tokenSelectorIsOpen - Whether the token selector is open or not.
 * @property {CurrencySelectorGroup} form - Forms object for the currency selector.
 * @property {string | undefined} poolBalance - The nominal balance the user has staked in the pool.
 * @property {Object<string, string>} tokenBalances - The nominal balance the user has available in their wallet per token.
 * @property {string | undefined} userAddress - User's address.
 * @property {string | undefined} errorGettingBalance - Error message when trying to get the user's balance, if any.
 */
State.init({
  inputAmount: "",
  lastValidInput: 0,
  selectedToken: undefined,
  tokenSelectorIsOpen: false,
  form: {},
  poolBalance: undefined,
  tokenBalances: {},
  // disconnected: true,
  userAddress: undefined,
  errorGettingBalance: undefined,
});

// for each token in the pool, find its balance and update state.tokenBalances["tokenAddress"] = balance
const tokenCount = state.form.tokenAddresses.length;
let tokenCountDone = 0;

for (let i = 0; i < tokenCount; i++) {
  const tokenAddress = state.form.tokenAddresses[i];
  const userAddress = state.userAddress;
  if (!userAddress) continue;
  const balance = getUserBalance(tokenAddress, userAddress);
  if (!balance || typeof balance === "string") {
    State.update({
      errorGettingBalance: balance,
    });
    continue;
  }
  balance.then((/** @type {string} */ balance) => {
    State.update({
      tokenBalances: {
        ...state.tokenBalances,
        [tokenAddress]: balance,
      },
    });
    tokenCountDone++;
    if (tokenCountDone === tokenCount) {
      State.update({
        errorGettingBalance: undefined,
      });
    }
  });
}
// console.log(state.tokenBalances);
/**
 * @param {string} inputAmount
 */
function validateInputAmount(inputAmount) {
  if (inputAmount === "") return true;
  const num = parseFloat(inputAmount);
  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (num > parseFloat(state.poolBalance ?? "0")) return false;
  return true;
}

/**
 * @param {string} inputAmount
 * @returns {string}
 */
function processInputAmount(inputAmount) {
  // Check for empty string
  if (inputAmount === "") {
    State.update({
      lastValidInput: "",
    });
    return "";
  }

  // Check for invalid characters and multiple dots
  if (!/^\d*\.?\d*$/.test(inputAmount)) return state.lastValidInput;

  // Parse float value
  const num = parseFloat(inputAmount);

  // Check for valid float value
  if (isNaN(num)) return state.lastValidInput;

  // Check for negative or exceeding pool balance value
  if (num < 0)
    //|| num > parseFloat(state.poolBalance ?? "0"))
    return state.lastValidInput;

  // If everything is fine, update the last valid input and return it
  State.update({
    lastValidInput: inputAmount,
  });
  return inputAmount ?? "";
}

let updated;
if (!updated) {
  State.update({
    form:
      /**
       * Form for the currency selector.
       * @type {CurrencySelectorGroup}
       */
      {
        allOrOne: "one",
        allForm: {
          totalAmount: "",
        },
        oneForms: {
          ...pool.tokens.reduce(
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
        tokenAddresses: pool.tokens.map(
          (
            /** @type {SToken} */
            token
          ) => token.address
        ),
        poolBalance: undefined, //getUserBalance(pool.address, userAddress),
      },
  });
}
updated = true;

function getUserBalanceOnceAndUpdateState() {
  const balanceProcessor = getUserBalance(pool.address, userAddress);
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
  getUserBalanceOnceAndUpdateState();
}
updatedBalance = true;

// /**
//  * Function to find the selected OneForm in a given CurrencySelectorGroup
//  * @param {string} poolAddress - The address of the pool to search in.
//  * @param {CurrencySelectorFormGroupsObject} forms - The forms object to search in.
//  * @returns {OneForm | null} - The selected OneForm if found, null otherwise.
//  */
// function getSelectedOneFormInPool(poolAddress, forms) {
//   if (forms[poolAddress]) {
//     for (let key in forms[poolAddress].oneForms) {
//       if (forms[poolAddress].oneForms[key].isSelected) {
//         return forms[poolAddress].oneForms[key];
//       }
//     }
//   }
//   return null;
// }

/**
 * @returns {OneForm | null} - The selected OneForm if found, null otherwise.
 */
function getSelectedOneFormInPool() {
  for (let key in state.form.oneForms) {
    if (state.form.oneForms[key].isSelected) {
      return state.form.oneForms[key];
    }
  }
  return null;
}

function updateForm(
  /** @type {string} */ poolAddress,
  /** @type {CurrencySelectorGroup} */ newForm
) {
  State.update({
    form: {
      ...state.form,
      [poolAddress]: newForm,
    },
  });
}

function handleRadioChange(
  /** @type {string} */ poolAddress,
  /** @type {"all" | "one"} */ newAllOrOne
) {
  /** @type {CurrencySelectorGroup} */
  const changedForm = state.form;
  if (changedForm.allOrOne === newAllOrOne) {
    return;
  }
  const formToChange = state.form;
  /** @type {CurrencySelectorGroup} */
  const newForm = {
    ...formToChange,
    allOrOne: newAllOrOne,
  };
  updateForm(poolAddress, newForm);
}

function handleTokenSelect(
  /** @type {string} */ poolAddress,
  /** @type {string} */ tokenAddress
) {
  /** @type {CurrencySelectorGroup} */
  const formToChange = state.form;

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

// /**
//  * @param {string} tokenAddress
//  * @param {string} inputAmount
//  */
// function handleStake(tokenAddress, inputAmount) {
//   const poolAddress = pool.address;
//   // we have both the token address and the input amount, so we can stake
//   const poolContract = new Ethers.Contract(
//     poolAddress,
//     erc20ABI,
//     Ethers.provider().getSigner()
//   );
//   const tokenContract = new Ethers.Contract(
//     tokenAddress,
//     erc20ABI,
//     Ethers.provider().getSigner()
//   );
//   const tokenDecimals = await tokenContract.decimals();
//   const tokenAmount = Ethers.utils.parseUnits(inputAmount, tokenDecimals);
//   const tx = await poolContract.stake(tokenAmount);
//   await tx.wait();

//   // update the balance
//   const newBalance = await poolContract.balanceOf(Ethers.signerAddress());
//   const newBalanceFormatted = Ethers.utils.formatUnits(
//     newBalance,
//     tokenDecimals
//   );
//   setBalance(newBalanceFormatted);
// }

// /**
//  * @param {string} tokenAddress
//  * @param {string} inputAmount
//  */
// function handleUnstake(tokenAddress, inputAmount) {
//   const poolAddress = pool.address;
//   // we have both the token address and the input amount, so we can stake
//   const poolContract = new Ethers.Contract(
//     poolAddress,
//     erc20ABI,
//     Ethers.provider().getSigner()
//   );
//   const tokenContract = new Ethers.Contract(
//     tokenAddress,
//     erc20ABI,
//     Ethers.provider().getSigner()
//   );
//   const tokenDecimals = await tokenContract.decimals();
//   const tokenAmount = Ethers.utils.parseUnits(inputAmount, tokenDecimals);
//   const tx = await poolContract.unstake(tokenAmount);
//   await tx.wait();

//   // update the balance
//   const newBalance = await poolContract.balanceOf(Ethers.signerAddress());
//   const newBalanceFormatted = Ethers.utils.formatUnits(
//     newBalance,
//     tokenDecimals
//   );
//   setBalance(newBalanceFormatted);
// }

/**
 * @param {{ poolAddress: string, className: string, operation: "stake" | "unstake" }} props
 */
function CurrencySelector({ poolAddress, className, operation }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.form;
  const { allOrOne, allForm, oneForms, tokenAddresses, tokenSelectorIsOpen } =
    currencySelectorGroup;
  // const whatever = tokenAddresses.map((a) => oneForms[a].isSelected);
  /** @type {number[]} */
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];
  // arrayOfSameLengthAsTokenAddresses.map((a) => oneForms[a].isSelected);
  // const pool = indexedPoolAddresses[poolAddress];

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
        {!state.userAddress ? (
          <h6>No user address available, connect wallet.</h6>
        ) : (
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              {/* RadioGroup selectors with All or One; display only if operation is "unstake" */}
              {undefined && operation === "unstake" && (
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
                        backgroundColor:
                          allOrOne === "all" ? "#6e4ac5" : "#585858",
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
                        letterSpacing:
                          allOrOne === "all" ? "0.033em" : "0.01em",
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
                        backgroundColor:
                          allOrOne === "one" ? "#6e4ac5" : "#585858",
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
                        letterSpacing:
                          allOrOne === "one" ? "0.033em" : "0.01em",
                        // horizontal padding is 16px and vertical padding is 4px
                        padding: "4px 16px",
                      }}
                    >
                      <RadioGroup.Indicator>
                        {/* <>One</> */}
                      </RadioGroup.Indicator>
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
                    Select a token to{" "}
                    {operation === "stake" ? "stake" : "unstake"}.
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
                    userSelect: "none",
                  }}
                >
                  <DropdownMenu.Root
                    open={state.tokenSelectorIsOpen}
                    style={{ position: "relative" }}
                    onOpenChange={(
                      /** @type {boolean} */
                      isOpen
                    ) => {
                      State.update({ tokenSelectorIsOpen: isOpen });
                      // console.log(
                      //   "isOpen",
                      //   isOpen,
                      //   "isOpenInState",
                      //   state.form.tokenSelectorIsOpen,
                      //   // "containinAmountOfTokenssss",
                      //   // state.form,
                      //   // tokenAddresses.length,
                      //   "tokenAddresses",
                      //   state.form.tokenAddresses,
                      //   "poolAddress",
                      //   poolAddress
                      //   // "state",
                      //   // JSON.stringify(state, null, 2)
                      // );
                      // const newForm = {
                      //   ...currencySelectorGroup,
                      //   tokenSelectorIsOpen: isOpen,
                      // };
                      // updateForm(poolAddress, newForm);
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
                            outline: "none",
                          }}
                        >
                          {/* find selected token address and use its symbol, if none are there, put "Select a token" */}
                          {
                            // use this length to iterate through the array of oneForms without actually using Object.keys(oneForm) which is disallowed
                            arrayOfSameLengthAsTokenAddresses.reduce(
                              (acc, _, index) => {
                                // console.log({
                                //   arrayOfSameLengthAsTokenAddresses,
                                //   tokenAddresses,
                                //   index,
                                // });
                                const tokenAddress = tokenAddresses[index];
                                const oneForm = oneForms[tokenAddress];
                                if (state.selectedToken === tokenAddress) {
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
                            checked={state.selectedToken === tokenAddress}
                            onCheckedChange={(
                              /** @type {boolean} */
                              isSelected
                            ) => {
                              if (isSelected) {
                                // handleTokenSelect(poolAddress, tokenAddress);
                                State.update({ selectedToken: tokenAddress });
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
                  className="text-primary"
                  style={{
                    filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                    cursor: "pointer",
                  }}
                  // style={{ color: "#6e4ac5", filter: "brightness(60%)" }}
                  onClick={() => {
                    const maxAmount = state.poolBalance;
                    State.update({ inputAmount: maxAmount });
                  }}
                >
                  {operation === "unstake"
                    ? "(Max: " + state.poolBalance
                    : state.selectedToken
                    ? "(Max: " + state.tokenBalances[state.selectedToken] + ")"
                    : undefined}
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
                  padding: "4px 16px",
                  height: "40px",
                }}
                // path to amount: sampleForms.forms["0"].oneForms["0"].inputAmount; but we gotta find which one is selected
                value={state.inputAmount}
                onChange={(e) => {
                  // const isValid = validateInputAmount(e.target.value);
                  // if (isValid) {
                  //   State.update({ inputAmount: e.target.value });
                  // }
                  const processed = processInputAmount(e.target.value) || "";
                  State.update({ inputAmount: processed });
                }}
              />
            </div>
            {operation === "stake" &&
              parseFloat(state.inputAmount) >
                parseFloat(state.poolBalance ?? "0") && (
                <div className="d-flex flex-row mb-2">
                  <div
                    className="alert alert-warning mt-1"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    Warning: If you unstake more than your balance, the
                    transaction will consume gas but will be cancelled.
                  </div>
                </div>
              )}
            {/* submit buttons */}
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ width: "100%" }}
            >
              <button
                className="btn btn-primary btn-sm"
                // className="btn btn-lg btn-primary fw-bold border-0"
                // dataSide="top"
                // dataAlign="end"
                style={{
                  // letterSpacing: "0.033em",
                  filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                  width: "100%",
                  height: "40px",
                }}
                onClick={() => {
                  // handle stake or unstake
                  if (operation === "stake") {
                    // stake(state.selectedToken, state.inputAmount);
                  }
                  if (operation === "unstake") {
                    // unstake(state.selectedToken, state.inputAmount);
                  }
                }}
              >
                {/* {allOrOne === "all" ? "Submit All" : "Submit One"} */}
                {operation === "stake" ? "Stake" : "Unstake"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function logAndReturnBalance() {
  console.log("logged balance while rendering", state.form.poolBalance);
  return state.form.poolBalance;
}

function TestComponent() {
  return (
    <div className="container flex">
      <div
        className="bg-dark rounded-2"
        style={{
          width: "250px",
        }}
      >
        <CurrencySelector
          className="my-2"
          operation="stake"
          poolAddress={pool.address}
        />
      </div>
      <Web3Connect connectLabel="Connect wallet with Web3" className="mb-3" />
      <h2>User Balance:</h2>
      <pre>{JSON.stringify(state.poolBalance, null, 2)}</pre>
      <h2>state.form Information:</h2>
      <pre>{JSON.stringify(state.form, null, 2)}</pre>
      <h2>Pool Information:</h2>
      <pre>{JSON.stringify(pool, null, 2)}</pre>
    </div>
  );
}

// props.test = true;
function MainReturn() {
  // console.log("my props test is ", props.test);
  // @ts-ignore
  return props.test ? (
    <TestComponent />
  ) : (
    <CurrencySelector
      operation={
        // @ts-ignore
        props.operation
      }
      className={className || ""}
      poolAddress={pool.address}
    />
  );
}

/*
interface CurrencySelectorProps {
  operation: "stake" | "unstake";
  poolAddress: string;
  className?: string;
  erc20Abi?: string; // we use this for the pools too
}
*/

/**
 * @typedef {Object} CurrencySelectorProps
 * @property {string} operation
 * @property {TransformedPool} pool
 * @property {string} [className]
 * @property {string} erc20Abi
 */

/** @type {(keyof CurrencySelectorProps)[]} */
const requiredProps = ["operation", "pool", "erc20Abi"];
const missingProps = requiredProps.filter(
  (prop) =>
    // @ts-ignore
    !props[prop]
);

// @ts-ignore
props.test = true;
if (
  // @ts-ignore
  !props.test &&
  missingProps.length
) {
  // @ts-ignore
  return (
    <div className="alert alert-danger">
      <div className="fw-bold">Missing props:</div>
      <div>{missingProps.join(", ")}</div>
    </div>
  );
}

// @ts-ignore
return <MainReturn />;
