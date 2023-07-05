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

/**
 * @typedef {Object} Props
 * @property {"stake"|"unstake"} operation
 * @property {TransformedPool} pool
 * @property {string} erc20ABI
 * @property {boolean} test
 * @property {string} className
 */

/** @type {Props["operation"]} */
props.operation = "stake";
/** @type {Props["pool"]} */
props.pool = {
  id: "0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef000200000000000000000020",
  address: "0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef",
  tokensList: [
    "0xa2036f0538221a77a3937f1379699f44945018d0",
    "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
  ],
  tokenWeights: [
    {
      address: "0xa2036f0538221a77a3937f1379699f44945018d0",
      weight: "0.5",
    },
    {
      address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
      weight: "0.5",
    },
  ],
  totalValueLocked: "2",
  totalWeight: "1",
  totalShares: "5.559483084822705174",
  holdersCount: "2",
  poolType: "Weighted",
  poolTypeVersion: 4,
  tokens: [
    {
      name: "Matic Token",
      symbol: "MATIC",
      address: "0xa2036f0538221a77a3937f1379699f44945018d0",
      decimals: 18,
      totalBalanceUSD: "0",
      totalBalanceNotional: "524.526715569650686347",
      totalVolumeUSD: "1596.28395398633399141053847844533",
      totalVolumeNotional: "0",
      latestUSDPrice: null,
      latestPrice: null,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
      decimals: 6,
      totalBalanceUSD: "30444.551589",
      totalBalanceNotional: "30444.551589",
      totalVolumeUSD: "6964.227925",
      totalVolumeNotional: "0",
      latestUSDPrice: "0.9999999999999999999999999999999999",
      latestPrice: {
        pricingAsset: "0x16c9a4d841e88e52b51936106010f27085a529ec",
        price: "0.9999999723110625373984519813985565",
        poolId: {
          totalWeight: "0",
        },
      },
    },
  ],
};
/** @type {Props["erc20ABI"]} */
props.erc20ABI =
  // @ts-ignore
  fetch("https://raw.githubusercontent.com/dredshep/dev/main/abi.json").body;
/** @type {Props["test"]} */
props.test = true;
/** @type {Props["className"]} */
props.className = "";
/** @type {StakeUnstakeCallback} */
props.stake = async (poolAddress, userAddress, sToken, abi) => (
  console.log("stake", poolAddress, userAddress, sToken, abi), true
);
/** @type {StakeUnstakeCallback} */
props.unstake = async (poolAddress, userAddress, sToken, abi) => (
  console.log("unstake", poolAddress, userAddress, sToken, abi), true
);
/** @type {string} */
props.poolBalance = "0";

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
// @ts-ignore
if (!props.poolBalance) missingProps.push("poolBalance (string)");

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
 * Checks if the user has approved the pool to spend their tokens.
 * @param {string} poolAddress - The address of the pool.
 * @param {string} userAddress - The address of the user.
 * @param {SToken} sToken - The sToken object.
 * @param {string} abi - The ABI of the sToken.
 * @returns {Promise<boolean>|string|undefined} - The allowance of the user for the pool, or undefined if there's an error.
 */
function isApproved(poolAddress, userAddress, sToken, abi) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting isApproved()");
    return;
  }
  try {
    let checkedPoolAddress, checkedUserAddress, checkedTokenAddress;
    try {
      checkedPoolAddress = ethers.utils.getAddress(poolAddress);
      checkedUserAddress = ethers.utils.getAddress(userAddress);
      checkedTokenAddress = ethers.utils.getAddress(sToken.address);
    } catch (error) {
      console.log("isApproved() error while checking addresses", error);
      console.log("poolAddress", poolAddress);
      console.log("userAddress", userAddress);
      console.log("sToken.address", sToken.address);
      console.log("checkedPoolAddress", checkedPoolAddress);
      console.log("checkedUserAddress", checkedUserAddress);
      console.log("checkedTokenAddress", checkedTokenAddress);
      return;
    }
    if (!userAddress) return;
    const tokenContract = new ethers.Contract(
      checkedTokenAddress,
      abi,
      Ethers.provider()?.getSigner?.()
    );
    const allowance = tokenContract
      .allowance(userAddress, poolAddress)
      .then((/** @type {{ gt: (bignum: any) => boolean; }} */ allowance) => {
        // console.log(typeof allowance);
        return allowance.gt(ethers.utils.parseUnits("0", sToken.decimals));
      });
    return allowance;
  } catch (error) {
    console.log("isApproved() error", error);
    return;
  }
}

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

// console.log(
//   "checking if pool 0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef is approved to spend 0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035"
// );
// let checkedIfApproved = false;
// console.log(
//   "WE'RE APPROVING BOYOS! due to SToken being undefined, I'm checking it here. Token array:",
//   indexedTokens
// );
// const isApprovedResult = isApproved(
//   "0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef",
//   "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
//   indexedTokens["0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035"],
//   erc20ABI
// );
// const itsAString = typeof isApprovedResult === "string";
// if (itsAString) {
//   console.log("Error getting approval status:", isApprovedResult);
// } else if (isApprovedResult) {
//   const tokenIsApproved = isApprovedResult.then(
//     (/** @type {boolean} */ tokenIsApproved) => {
//       console.log("inner tokenIsApproved", tokenIsApproved);
//       checkedIfApproved = true;
//       return tokenIsApproved;
//     }
//   );
//   console.log("outer tokenIsApproved", tokenIsApproved);
// } else {
//   const resIsNull = isApprovedResult === null;
//   const resIsUndefined = isApprovedResult === undefined;
//   console.log("resIsNull", resIsNull);
//   console.log("resIsUndefined", resIsUndefined);
//   checkedIfApproved = true;
// }

const tokenEntries = Object.entries(indexedTokens);
const tokenEntriesLength = tokenEntries.length;
const checkedTokens = [];

// check only if checkedTokens.length < tokenEntriesLength
if (tokenEntriesLength > 0 && checkedTokens.length < tokenEntriesLength) {
  tokenEntries.forEach(
    (/** @type {[string, SToken]} */ [tokenAddress, token]) => {
      const isApprovedResult = isApproved(
        pool.address,
        userAddress,
        token,
        erc20ABI
      );
      const itsAString = typeof isApprovedResult === "string";
      if (itsAString) {
        console.log("Error getting approval status:", isApprovedResult);
      } else if (isApprovedResult) {
        return isApprovedResult.then(
          (/** @type {boolean} */ tokenIsApproved) => {
            // console.log(
            //   `token ${token.symbol} approval status:`,
            //   tokenIsApproved
            // );
            State.update({
              indexedApprovedTokens: {
                ...state.indexedApprovedTokens,
                [tokenAddress]: tokenIsApproved,
              },
            });
            return tokenIsApproved;
          }
        );
      } else {
        // const resIsNull = isApprovedResult === null;
        // const resIsUndefined = isApprovedResult === undefined;
        // console.log("resIsNull", resIsNull);
        // console.log("resIsUndefined", resIsUndefined);
      }
    }
  );
  // console.log(JSON.stringify(state.indexedApprovedTokens, null, 2));
}

/**
 * Checks if the user has approved the pool to spend their tokens.
 * @param {string} poolAddress - The address of the pool.
 * @param {string} userAddress - The address of the user.
 * @param {SToken} sToken - The sToken object.
 * @param {string} amount - The amount to approve.
 * @param {string} erc20ABI - The ABI of the sToken.
 * @returns {Promise<string>|string|undefined} - The allowance of the user for the pool, or undefined if there's an error.
 */
function approve(poolAddress, userAddress, sToken, amount, erc20ABI) {
  // break if no signer, user disconnected
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting approve()");
    return;
  }
  try {
    const tokenContract = new ethers.Contract(
      sToken.address, // address
      erc20ABI,
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const allowance = tokenContract
      .approve(poolAddress, amount)
      .then((/** @type {{ toString: () => string; }} */ allowance) => {
        return allowance.toString();
      });
    return allowance;
  } catch (error) {
    console.log("approve() error", error);
    return;
  }
}

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
 * @property {Object<string, boolean>} indexedApprovedTokens - Whether the user has approved the pool to spend their tokens.
 */
State.init({
  inputAmount: "",
  lastValidInput: "",
  selectedToken: undefined,
  tokenSelectorIsOpen: false,
  // @ts-ignore
  form: {},
  poolBalance: undefined,
  tokenBalances: {},
  // disconnected: true,
  userAddress: undefined,
  errorGettingBalance: undefined,
  indexedApprovedTokens: {},
});

State.update({
  poolBalance:
    // @ts-ignore
    props.poolBalance,
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

// function getUserBalanceOnceAndUpdateState() {
//   const balanceProcessor = getUserBalance(pool.address, userAddress);
//   if (typeof balanceProcessor === "string") {
//     console.log(
//       "Error getting balance using getUserBalanceOnceAndUpdateState():",
//       balanceProcessor
//     );
//     return;
//   }
//   if (balanceProcessor && balanceProcessor.then) {
//     balanceProcessor.then((newBalance) => {
//       State.update({
//         poolBalance: newBalance,
//       });
//     });
//   } else {
//     console.log(
//       "Got balance using getUserBalanceOnceAndUpdateState(); it was undefined."
//     );
//   }
// }
// let updatedBalance;
// if (!updatedBalance) {
//   getUserBalanceOnceAndUpdateState();
// }
// updatedBalance = true;

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

/**
 * @param {{ poolBalance: string | undefined; errorGettingBalance: string | undefined; operation: "stake" | "unstake", FormWidget: CurrencySelector}} innerProps
 */
function StakeUnstakeWidget(innerProps) {
  const poolBalance = innerProps.poolBalance;
  const operation = innerProps.operation;
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
        <div>{operation === "stake" ? "Stake" : "Unstake"}</div>
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
            <h5 className="card-title  d-flex align-items-center justify-content-between">
              <div>{operation === "stake" ? "Stake" : "Unstake"}</div>
              <Dialog.Close className="btn btn-sm bg-secondary border-0 pt-2 ps-2 pe-2">
                {/* <button className="btn btn-sm btn-secondary border-0 rounded-circle d-flex justify-content-center"> */}
                <div className="">
                  <i className="bi bi-x-lg"></i>
                </div>
                {/* </button> */}
              </Dialog.Close>
            </h5>
          </div>
          <div className="card-body">
            {/* <p className="card-text">
              <span className="fw-bold">Your Balance:</span>{" "}
              {poolBalance}
            </p> */}
            <innerProps.FormWidget className="" operation="stake" />
            {/* <Dialog.Close
              className="btn btn-lg btn-secondary me-3 fw-bold border-0"
              style={{
                letterSpacing: "0.033em",
                // desaturate completely and lighten by 50%
                filter: "saturate(0%) brightness(100%)",
              }}
            >
              Cancel
            </Dialog.Close> */}
            {/* <button
                className="btn btn-lg btn-primary fw-bold border-0"
                // dataSide="top"
                // dataAlign="end"
                style={{
                  letterSpacing: "0.033em",
                  filter: "hue-rotate(40deg) saturate(80%) brightness(115%)",
                }}
              >
                {operation === "stake" ? "Stake" : "Unstake"}
              </button> */}
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

function checkSelectedTokenIsApproved() {
  const selectedToken = state.selectedToken; // this is a string (address) | undefined
  // state.indexedApprovedTokens is Object<string, boolean>
  if (selectedToken) {
    return state.indexedApprovedTokens[selectedToken];
  }
  return undefined; // this way we can use nullish coalescence (??) to have a default value
}

/**
 * @callback CurrencySelector
 * @param {{ className: string, operation: "stake" | "unstake" }} currencySelectorProps
 * @returns {React.JSX.Element}
 */
function CurrencySelector({ className, operation }) {
  /** @type {CurrencySelectorGroup} */
  const currencySelectorGroup = state.form;
  const { oneForms, tokenAddresses } = currencySelectorGroup;
  /** @type {number[]} */
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];

  return (
    <div className={className}>
      <div className="d-flex flex-column container py-2 pb-3">
        {!state.userAddress ? (
          <h6>No user address available, connect wallet.</h6>
        ) : (
          <div className="d-flex flex-column">
            {/* here goes the title: "Input Amount" */}
            {(operation === "stake" || operation === "unstake") && (
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
                      ) : (
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
                        maxWidth: "170px",
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
                    ? "(Max: " + props.poolBalance
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
                      maxWidth: "220px",
                    }}
                  >
                    Warning: If you stake/unstake more than your balance, the
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
                className={
                  "btn btn-sm" +
                  (state.selectedToken && userAddress
                    ? " btn-primary"
                    : " btn-secondary")
                }
                disabled={!state.selectedToken || !userAddress}
                style={{
                  filter:
                    state.selectedToken && userAddress
                      ? "hue-rotate(40deg) saturate(80%) brightness(115%)"
                      : "saturate(0%) brightness(100%)",
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
                    // stake(
                    //   pool.address,
                    //   state.selectedToken,
                    //   indexedTokens[state.selectedToken],
                    //   state.inputAmount
                    // );
                    // check if approved first if not use the approve function
                    if (checkSelectedTokenIsApproved()) {
                      stake(
                        pool.address,
                        state.selectedToken,
                        indexedTokens[state.selectedToken],
                        state.inputAmount
                      );
                    } else {
                      if (state.userAddress) {
                        approve(
                          pool.address,
                          state.userAddress,
                          indexedTokens[state.selectedToken],
                          state.inputAmount,
                          erc20ABI
                        );
                      }
                    }
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
                {typeof checkSelectedTokenIsApproved() === "boolean"
                  ? checkSelectedTokenIsApproved()
                    ? "Stake"
                    : "Approve"
                  : "Select a token"}
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
        <CurrencySelector className="my-2" operation="stake" />
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
    <CurrencySelector operation={operation} className={className || ""} />
  );
}

// @ts-ignore
// return <MainReturn />;
return (
  <StakeUnstakeWidget
    poolBalance={poolBalance}
    errorGettingBalance={errorGettingBalance}
    operation={operation}
    FormWidget={CurrencySelector}
  />
);
