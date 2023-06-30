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

/**
 * @callback StakeUnstakeCallback
 * @param {string} poolAddress The pool address.
 * @param {string} userAddress The user address.
 * @param {SToken} sToken The SToken object.
 * @param {Object} abi The ABI object.
 * @returns {Promise<boolean>} Promise that resolves with true on success, false on failure.
 */

// /**
//  * @typedef {Object} Props
//  * @property {"stake"|"unstake"} operation
//  * @property {TransformedPool} pool
//  * @property {string} erc20ABI
//  * @property {boolean} test
//  * @property {string} className
//  */

// /** @type {Props["operation"]} */
// props.operation = "stake";
// /** @type {Props["pool"]} */
// props.pool = {
//   id: "0x0000000000",
//   address: "0x0000000000",
//   tokensList: ["0x0000000000", "0x0000000000"],
//   totalWeight: "0",
//   totalShares: "0",
//   holdersCount: "0",
//   poolType: "0",
//   poolTypeVersion: 0,
//   tokens: [
//     {
//       name: "Token 1",
//       symbol: "TKN1",
//       address: "0x0000000000",
//       decimals: 18,
//       totalBalanceUSD: "0",
//       totalBalanceNotional: "0",
//       totalVolumeUSD: "0",
//       totalVolumeNotional: "0",
//       latestUSDPrice: "0",
//       latestPrice: null,
//     },
//   ],
//   totalValueLocked: "0",
//   tokenWeights: [{ address: "0x0000000000", weight: "0" }],
// };
// /** @type {Props["erc20ABI"]} */
// props.erc20ABI = "asdasd";
// /** @type {Props["test"]} */
// props.test = true;
// /** @type {Props["className"]} */
// props.className = "";

const missingProps = [];
// @ts-ignore
if (!props.operation) missingProps.push('operation ("stake"|"unstake")');
// @ts-ignore
if (!props.pool) missingProps.push("pool (TransformedPool)");
// @ts-ignore
if (!props.erc20ABI) missingProps.push("erc20ABI (string)");
// @ts-ignore
if (!props.stake) missingProps.push("stake (StakeUnstakeCallback)");
// @ts-ignore
if (!props.unstake) missingProps.push("unstake (StakeUnstakeCallback)");

function MissingPropsWarning({ missingProps }) {
  return (
    <div className="alert alert-danger">
      <div className="fw-bold">Missing props:</div>
      <pre>{missingProps.join("\n")}</pre>
    </div>
  );
}
if (missingProps.length) {
  // @ts-ignore
  return <MissingPropsWarning missingProps={missingProps} />;
}

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

/** @type {boolean} */
const test =
  // @ts-ignore
  props.test;

/** @type {StakeUnstakeCallback} */
const unstake =
  // @ts-ignore
  props.unstake;

/** @type {StakeUnstakeCallback} */
const stake =
  // @ts-ignore
  props.stake;

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

const indexedTokens = Object.values(pool.tokens).reduce(
  (
    /** @type {Object<string, SToken>} */
    acc,
    /** @type {SToken} */
    token
  ) => {
    acc[token.address] = token;
    return acc;
  },
  {}
);

/**
 * @param {{ poolAddress: string, className: string, operation: "stake" | "unstake" }} currencySelectorProps
 */
function CurrencySelector({ poolAddress, className, operation }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.form;
  const { allOrOne, oneForms, tokenAddresses } = currencySelectorGroup;
  /** @type {number[]} */
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];

  return (
    <div className={className}>
      <div className="d-flex flex-column container py-2 pb-3">
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
        </div>
        {!state.userAddress ? (
          <h6>No user address available, connect wallet.</h6>
        ) : (
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              {undefined && operation === "unstake" && (
                <RadioGroup.Root>
                  <RadioGroup.RadioGroup
                    value={allOrOne}
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
                    <RadioGroup.Item
                      value="all"
                      style={{
                        fontWeight: allOrOne === "all" ? "bold" : "normal",
                        backgroundColor:
                          allOrOne === "all" ? "#6e4ac5" : "#585858",
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                        height: "40px",
                        border: "0px",
                        color: "white",
                        letterSpacing:
                          allOrOne === "all" ? "0.033em" : "0.01em",
                        padding: "4px 16px",
                      }}
                    >
                      <RadioGroup.Indicator />
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
                        </span>
                      ) : (
                        // if all is selected, show "All"
                        "All"
                      )}
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
                value={state.inputAmount}
                onChange={(e) => {
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
                style={{
                  filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                  width: "100%",
                  height: "40px",
                }}
                onClick={() => {
                  // handle stake or unstake
                  if (operation === "stake") {
                    if (!state.selectedToken) {
                      console.log("no token selected, cannot stake");
                      return;
                    }
                    stake(
                      pool.address,
                      state.selectedToken,
                      indexedTokens[state.selectedToken],
                      state.inputAmount
                    );
                  }
                  if (operation === "unstake") {
                    if (!state.selectedToken) {
                      console.log("no token selected, cannot unstake");
                      return;
                    }
                    unstake(
                      pool.address,
                      state.selectedToken,
                      indexedTokens[state.selectedToken],
                      state.inputAmount
                    );
                  }
                }}
              >
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

function MainReturn() {
  return test ? (
    <TestComponent />
  ) : (
    <CurrencySelector
      operation={operation}
      className={className || ""}
      poolAddress={pool.address}
    />
  );
}

// @ts-ignore
return <MainReturn />;
