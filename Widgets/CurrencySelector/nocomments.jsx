const missingProps = [];
if (
  !props.operation ||
  (props.operation !== "stake" && props.operation !== "unstake")
)
  missingProps.push('operation ("stake"|"unstake")');
if (!props.pool) missingProps.push("pool (TransformedPool)");
if (!props.vaultAddress) missingProps.push("vaultAddress (string)");
if (!props.balancerQueriesAddress)
  missingProps.push("balancerQueriesAddress (string)");
if (!props.pool.id)
  missingProps.push("pool has no id, check type (TransformedPool)");

function MissingPropsWarning({ missingProps }) {
  return (
    <div className="alert alert-danger">
      <div className="fw-bold">Missing props:</div>
      <pre>{missingProps.join("\n")}</pre>
    </div>
  );
}
if (missingProps.length) {
  return <MissingPropsWarning missingProps={missingProps} />;
}
const operation = props.operation;
const pool = props.pool;
const VAULT_ADDRESS = props.vaultAddress;
const BALANCER_QUERIES_ADDRESS = props.balancerQueriesAddress;

const fetchBody = (url) => fetch(url).body;
const vaultAbi = fetchBody(
  "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/21b0c88dd84ac06cc380472b88004ad43f8a688b/balancerVaultABI.json"
);

function joinPool(joinArgs) {
  const vault = new ethers.Contract(
    VAULT_ADDRESS,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  console.log("vault:", vault);
  return vault.joinPool(
    joinArgs.poolId,
    joinArgs.sender,
    joinArgs.recipient,
    [
      joinArgs.sortedTokenAddresses,
      joinArgs.maxAmountsIn,
      joinArgs.userData,
      joinArgs.fromInternalBalance,
    ],
    { gasLimit: 6000000 }
  );
}

function exitPool(exitArgs) {
  const vault = new ethers.Contract(
    VAULT_ADDRESS,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  return vault.exitPool(
    exitArgs.poolId,
    exitArgs.sender,
    exitArgs.recipient,
    [
      exitArgs.sortedTokenAddresses,
      exitArgs.minAmountsOut,
      exitArgs.userData,
      exitArgs.toInternalBalance,
    ],
    { gasLimit: 6000000 }
  );
}
/**
 * @param {{ exitArgs?: ExitPoolArgs, joinArgs?: JoinPoolArgs }} joinExitFunctionArgs */
function joinOrExitPool(joinExitFunctionArgs) {
  const { exitArgs, joinArgs } = joinExitFunctionArgs;
  let txPromise;
  if (exitArgs) {
    console.log("exitArgs:", exitArgs);
    txPromise = exitPool(exitArgs);
  } else if (joinArgs) {
    console.log("joinArgs:", joinArgs);
    txPromise = joinPool(joinArgs);
  } else {
    throw new Error("Must provide either exitArgs or joinArgs");
  }
  txPromise
    ?.then?.((tx) => {
      console.log("joinOrExitPool() transaction emitted TX.then: tx:", tx);
      tx?.wait?.()
        ?.then?.((receipt) => {
          console.log(
            "joinOrExitPool() transaction mined TX.wait.then: receipt:",
            receipt
          );

          fetchAndUpdateBalance(state, getUserBalance, pool, userAddress, true);
          initializeTokenBalances(state, getUserBalance, true);
        })
        ?.catch?.((e) => {
          console.log(
            "joinOrExitPool() transaction mined TX.wait.catch: e:",
            e
          );
        });
    })
    ?.catch?.((e) => {
      console.log("joinOrExitPool() inner error on TX.catch: e:", e);
    });
}

const ONEe18 = ethers.BigNumber.from(10).pow(18);
const ONE = ethers.BigNumber.from(1);
const ZERO = ethers.BigNumber.from(0);
const MAX = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
const encode = (types, values) =>
  ethers.utils.defaultAbiCoder.encode(types, values);
const exitIsSingle = (tokens, amounts) =>
  tokens.length === 1 && amounts.length === 1;
const singleExitIndex = (amounts) =>
  amounts.findIndex((amount) => amount.gt(0));
function queryExit(poolId, sender, recipient, rawRequest) {
  const exitArgs = rawRequest;
  const request = [
    exitArgs.sortedTokenAddresses,
    exitArgs.minAmountsOut,
    exitArgs.userData,
    exitArgs.toInternalBalance,
  ];

  const balancerQueriesContract = new ethers.Contract(
    BALANCER_QUERIES_ADDRESS,
    fetchBody(
      "https://gist.githubusercontent.com/dredshep/728298ed3649bb12cd2c3638e0e1e2fb/raw/df57d6f23060805d02a533b0239d93d0ae807e97/balancerQueriesABI.json"
    ),
    Ethers.provider().getSigner()
  );
  const eth_calledPromise = balancerQueriesContract.provider.call({
    to: balancerQueriesContract.address,
    data: balancerQueriesContract.interface.encodeFunctionData("queryExit", [
      poolId,
      sender,
      recipient,
      request,
    ]),
  });
  const queryResultPromise = eth_calledPromise.then((result) => {
    const decoded = balancerQueriesContract.interface.decodeFunctionResult(
      "queryExit",
      result
    );
    /**@type {{bptIn: object, amountsOut: object[]}} */
    const queryResult = {
      bptIn: decoded[0],
      amountsOut: decoded[1],
    };
    return queryResult;
  });
  return queryResultPromise;
}

function queryThenExit(poolId, sender, recipient, rawRequest) {
  queryExit(poolId, sender, recipient, rawRequest).then((res) => {
    const stringifiedAmountsOut = res.amountsOut.map((x) =>
      ethers.utils.formatUnits(x, 18)
    );
    const stringifiedBptIn = ethers.utils.formatUnits(res.bptIn, 18);
    console.log("queryThenExit res:", {
      bptIn: stringifiedBptIn,
      amountsOut: stringifiedAmountsOut,
    });
    const stringifiedInputAmountsOut = rawRequest.minAmountsOut.map((x) =>
      ethers.utils.formatUnits(x, 18)
    );
    const rawInputBptIn = new ethers.utils.AbiCoder().decode(
      ["uint256", "uint256"],
      ethers.utils.arrayify(rawRequest.userData)
    )[1];
    console.log("rawInputBptIn:", rawInputBptIn);
    const stringifiedInputBptIn = ethers.utils.formatUnits(rawInputBptIn, 18);
    console.log("queryThenExit input:", {
      bptIn: stringifiedInputBptIn,
      amountsOut: stringifiedInputAmountsOut,
    });
    return joinOrExitPool({
      exitArgs: {
        ...rawRequest,
        minAmountsOut: res.amountsOut.map((x) => x.mul(99).div(100)),
        userData: encode(["uint256", "uint256"], [1, res.bptIn]),
      },
    });
  });
}

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
State.update({ userAddress });

function checkAllowanceAmount(poolAddress, userAddress, sToken, abi) {
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting isApproved()");
    return;
  }
  try {
    if (!userAddress || !poolAddress || !sToken || !abi) {
      console.log("isApproved() missing args");
      return;
    }
    let checkedPoolAddress, checkedUserAddress, checkedTokenAddress;
    try {
      checkedPoolAddress = ethers.utils.getAddress(VAULT_ADDRESS);
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

      .allowance(userAddress, VAULT_ADDRESS)
      .then((/** @type {{ gt: (bignum: any) => boolean; }} */ allowance) => {
        return parseFloat(ethers.utils.formatUnits(allowance, sToken.decimals));
      });
    return allowance;
  } catch (error) {
    console.log("isApproved() error", error);
    return;
  }
}

const indexedTokens = Object.values(pool.tokens).reduce((acc, token) => {
  acc[token.address] = token;
  return acc;
}, {});

const tokenEntries = Object.entries(indexedTokens);
const tokenEntriesLength = tokenEntries.length;
const checkedTokens = [];
const erc20ABI = fetchBody(
  "https://raw.githubusercontent.com/dredshep/dev/main/abi.json"
);
if (tokenEntriesLength > 0 && checkedTokens.length < tokenEntriesLength) {
  tokenEntries.forEach(([tokenAddress, token]) => {
    const allowanceAmountPromise = checkAllowanceAmount(
      pool.address,
      userAddress,
      token,
      erc20ABI
    );
    const itsAString = typeof allowanceAmountPromise === "string";
    if (itsAString) {
      console.log("Error getting approval status:", allowanceAmountPromise);
    } else if (allowanceAmountPromise) {
      return allowanceAmountPromise.then(
        (/** @type {number} */ allowanceAmount) => {
          State.update({
            indexedApprovalAmountPerToken: {
              ...state.indexedApprovalAmountPerToken,
              [tokenAddress]: allowanceAmount,
            },
          });
        }
      );
    }
  });
}

function approve(poolAddress, userAddress, sToken, amount, erc20ABI) {
  if (!Ethers.provider()?.getSigner?.()) {
    State.update({
      userAddress: undefined,
    });
    console.log("No signer, user disconnected, exiting approve()");
    return;
  }
  try {
    const tokenContract = new ethers.Contract(
      sToken.address,
      erc20ABI,
      Ethers.provider().getSigner()
    );
    if (!userAddress) return;
    const preFilledAmount = ethers.utils.parseUnits(amount, sToken.decimals);
    const allowance = tokenContract
      .approve(VAULT_ADDRESS, preFilledAmount, {
        gasLimit: 6000000,
      })
      .then((allowance) => {
        const allowancePromise = checkAllowanceAmount(
          poolAddress,
          userAddress,
          sToken,
          erc20ABI
        );
        if (
          typeof allowancePromise !== "string" &&
          allowancePromise &&
          allowancePromise.then
        ) {
          allowancePromise.then((/** @type {number} */ allowanceAmount) => {
            State.update({
              indexedApprovalAmountPerToken: {
                ...state.indexedApprovalAmountPerToken,
                [sToken.address]: allowanceAmount,
              },
            });
          });
        }
        return allowance.toString();
      });
    return allowance;
  } catch (error) {
    console.log("approve() error", error);
    return;
  }
}

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
    const balance = erc20.balanceOf(userAddress).then((balance) => {
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

State.init({
  inputAmount: "",
  lastValidInput: "",
  selectedToken: undefined,
  tokenSelectorIsOpen: false,
  form: {},
  poolBalance: undefined,
  tokenBalances: {},
  customWithdrawableAmounts: undefined,
  maxWithdrawableAmounts: undefined,

  userAddress: undefined,
  errorGettingBalance: undefined,

  indexedApprovalAmountPerToken: {},
});
let isTokenBalanceInitialized = false;

async function initializeTokenBalances(state, getUserBalance, force) {
  console.log("INITIALIZING TOKEN BALANCES");
  if (isTokenBalanceInitialized && !force) {
    return;
  }
  isTokenBalanceInitialized = true;

  const tokenCount = state.form.tokenAddresses.length;
  let tokenCountDone = 0;
  const balances = [];

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
      balances.push(balance);
      if (balances.length === tokenCount) {
        balances.reduce((acc, balance, i) => {
          acc[state.form.tokenAddresses[i]] = balance;
          return acc;
        }, {});
        State.update({
          tokenBalances: balances.reduce((acc, balance, i) => {
            acc[state.form.tokenAddresses[i]] = balance;
            return acc;
          }, {}),
        });
      }
      tokenCountDone++;
      if (tokenCountDone === tokenCount) {
        State.update({
          errorGettingBalance: undefined,
        });
      }
    });
  }
}
const noBalances =
  !state.tokenBalances ||
  typeof state.tokenBalances !== "object" ||
  Object.keys(state.tokenBalances).length === 0;
if (noBalances) {
  State.update({
    tokenBalances: {},
  });
  initializeTokenBalances(state, getUserBalance, false);
}
if (state.errorGettingBalance) {
  return <div>Error getting balance: {state.errorGettingBalance}</div>;
}

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
  if (inputAmount === "") {
    State.update({
      lastValidInput: "",
    });
    return "";
  }
  if (!/^\d*\.?\d*$/.test(inputAmount)) return state.lastValidInput;
  const num = parseFloat(inputAmount);
  if (isNaN(num)) return state.lastValidInput;
  if (num < 0)
    //|| num > parseFloat(state.poolBalance ?? "0"))
    return state.lastValidInput;
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
            <innerProps.FormWidget operation={operation} />
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function checkSelectedTokenIsApproved() {
  const selectedToken = state.selectedToken;
  const inputAmount = state.inputAmount;
  const indexedApprovalAmountPerToken = state.indexedApprovalAmountPerToken;
  const parsedInputAmount = inputAmount ? parseFloat(inputAmount) : undefined;
  const selectedTokenIsApproved =
    selectedToken && parsedInputAmount
      ? parsedInputAmount <= indexedApprovalAmountPerToken[selectedToken]
      : false;
  return selectedTokenIsApproved;
}

async function fetchAndUpdateBalance(
  state,
  getUserBalance,
  pool,
  userAddress,
  force
) {
  if (typeof state.poolBalance !== "undefined" && !force) {
    return;
  }

  const promise = getUserBalance(pool.address, userAddress);
  if (promise !== undefined && typeof promise !== "string") {
    promise.then((_balance) => {
      const balance = ethers.utils.parseUnits(_balance, 18);
      State.update({ poolBalance: ethers.utils.formatUnits(balance, 18) });
    });
  }
}

fetchAndUpdateBalance(state, getUserBalance, pool, userAddress, false);

if (typeof state.poolBalance === "undefined") {
  return <div>Loading...</div>;
}

function updateWithdrawableAmounts(init) {
  try {
    if (
      !state.poolBalance ||
      !state.form ||
      !state.userAddress ||
      !pool ||
      !pool.tokens?.length
    ) {
      console.log("updateWithdrawableAmounts: missing state");
      return;
    }

    const bptAmount =
      state.inputAmount &&
      state.inputAmount !== "" &&
      state.inputAmount !== "0" &&
      (state.inputAmount.split(".")[1]?.length ?? 0) <= 18
        ? ethers.utils.parseUnits(state.inputAmount, 18)
        : undefined;
    if (bptAmount === undefined)
      State.update({ customWithdrawableAmounts: undefined });
    const maxBptAmount = ethers.utils.parseUnits(state.poolBalance, 18);
    [bptAmount, maxBptAmount].forEach((amount, i) => {
      if (amount && pool.id && userAddress) {
        queryExit(pool.id, userAddress, userAddress, {
          minAmountsOut: pool.tokens.map(() => ethers.BigNumber.from(0)),
          poolId: pool.id,
          recipient: userAddress,
          sender: userAddress,
          sortedTokenAddresses: pool.tokens
            .map((token) => token.address)
            .sort(),
          toInternalBalance: false,
          userData: encode(["uint256", "uint256"], [1, amount]),
        })
          .then((exitAmounts) => {
            console.log("exitAmounts", exitAmounts);
            i === 0
              ? !init &&
                State.update({
                  customWithdrawableAmounts: exitAmounts.amountsOut,
                })
              : State.update({
                  maxWithdrawableAmounts: exitAmounts.amountsOut,
                });
          })
          .catch((e) => {
            console.log(
              "Error while running queryExit() in updateWithdrawableAmounts():",
              e
            );
            i === 0
              ? State.update({ customWithdrawableAmounts: undefined })
              : State.update({ maxWithdrawableAmounts: undefined });
          });
      }
    });
  } catch (e) {
    console.log("Error in updateWithdrawableAmounts()", e);
  }
}

function CurrencySelector({ operation }) {
  const currencySelectorGroup = state.form;

  const { oneForms, tokenAddresses } = currencySelectorGroup;
  const arrayOfSameLengthAsTokenAddresses = [...Array(tokenAddresses.length)];
  const displayInput =
    (operation === "stake" && state.selectedToken) || operation === "unstake";

  return (
    <div>
      <div className="d-flex flex-column container py-2 pb-3">
        {!state.userAddress ? (
          <h6>No user address available, connect wallet.</h6>
        ) : (
          <div className="d-flex flex-column">
            {/* here goes the title: "Input Amount" */}
            {operation === "stake" && (
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
                    borderRadius: "4px",
                    padding: "4px 4px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
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
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            outline: "none",
                          }}
                        >
                          {/* find selected token address and use its symbol, if none are there, put "Select a token" */}
                          {arrayOfSameLengthAsTokenAddresses.reduce(
                            (acc, _, index) => {
                              const tokenAddress = tokenAddresses[index];
                              const oneForm = oneForms[tokenAddress];
                              if (state.selectedToken === tokenAddress) {
                                return oneForm.symbol;
                              }
                              return acc;
                            },
                            "Select a token"
                          )}
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
            {operation === "unstake" && (
              <>
                <div className="d-flex flex-row my-2">
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    By unstaking, you will receive:
                  </div>
                </div>
                <div>
                  <ol
                    style={{
                      listStyleType: "none",
                      paddingLeft: "0px",
                    }}
                  >
                    {Object.keys(state.tokenBalances).map((tokenAddress) => {
                      const oneForm = oneForms[tokenAddress];
                      const tokenBalance = state.tokenBalances[tokenAddress];
                      return (
                        <li
                          key={tokenAddress}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 0px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{oneForm.symbol}:</span>

                            <span
                              style={{
                                marginLeft: "5px",
                                color: "#585858",
                              }}
                            >
                              {state.customWithdrawableAmounts &&
                              state.customWithdrawableAmounts.length > 0 &&
                              state.customWithdrawableAmounts[
                                tokenAddresses.indexOf(tokenAddress)
                              ]
                                ? ethers.utils.formatUnits(
                                    state.customWithdrawableAmounts[
                                      tokenAddresses.indexOf(tokenAddress)
                                    ],
                                    indexedTokens[tokenAddress].decimals
                                  )
                                : "0"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </>
            )}
            {displayInput && (
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
                      filter:
                        "hue-rotate(40deg) saturate(80%) brightness(115%)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!state.selectedToken && operation === "stake") {
                        return;
                      } else if (state.selectedToken && operation === "stake") {
                        const maxStakeAmount =
                          state.tokenBalances[state.selectedToken];
                        State.update({
                          inputAmount: processInputAmount(maxStakeAmount),
                        });
                        return;
                      }

                      const maxAmount = state.poolBalance;
                      State.update({
                        inputAmount: processInputAmount(maxAmount || "0"),
                      });
                      updateWithdrawableAmounts(false);
                    }}
                  >
                    {operation === "unstake"
                      ? "(Max: " + state.poolBalance + ")"
                      : state.selectedToken &&
                        state.tokenBalances[state.selectedToken]
                      ? "(Max: " +
                        state.tokenBalances[state.selectedToken] +
                        ")"
                      : undefined}
                  </span>
                </div>
              </div>
            )}
            {displayInput && (
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
                    updateWithdrawableAmounts(false);
                  }}
                />
              </div>
            )}
            {operation === "stake" &&
              state.selectedToken &&
              parseFloat(state.inputAmount) >
                parseFloat(state.tokenBalances[state.selectedToken] ?? "0") && (
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
            {(state.selectedToken || operation === "unstake") && (
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <button
                  className={
                    "btn btn-sm" +
                    ((state.selectedToken || operation === "unstake") &&
                    userAddress
                      ? " btn-primary"
                      : " btn-secondary")
                  }
                  disabled={
                    (operation === "stake" &&
                      (!state.selectedToken || !userAddress)) ||
                    !state.inputAmount ||
                    0 === parseFloat(state.inputAmount)
                  }
                  style={{
                    filter:
                      (state.selectedToken || operation === "unstake") &&
                      userAddress
                        ? "hue-rotate(40deg) saturate(80%) brightness(115%)"
                        : "saturate(0%) brightness(100%)",
                    width: "100%",
                    height: "40px",
                  }}
                  onClick={() => {
                    if (operation === "stake") {
                      if (!state.selectedToken) {
                        console.log("no token selected, cannot stake");
                        return;
                      }
                      if (checkSelectedTokenIsApproved()) {
                        const sortedTokenAddresses = [...tokenAddresses].sort();
                        const amountsIn = sortedTokenAddresses.map(
                          (tokenAddress) => {
                            const tokenAmount = state.inputAmount;
                            const tokenDecimals =
                              indexedTokens[tokenAddress].decimals;
                            if (tokenAddress === state.selectedToken) {
                              return ethers.utils.parseEther(
                                tokenAmount,
                                tokenDecimals
                              );
                            } else {
                              return ethers.utils.parseEther(
                                "0",
                                tokenDecimals
                              );
                            }
                          }
                        );
                        const joinArgs = {
                          fromInternalBalance: false,
                          maxAmountsIn: amountsIn,
                          poolId: pool.id,
                          recipient: userAddress,
                          sender: userAddress,
                          sortedTokenAddresses: sortedTokenAddresses,
                          userData: encode(
                            ["uint256", "uint256[]", "uint256"],
                            [1, amountsIn, 0]
                          ),
                        };
                        joinOrExitPool({ joinArgs });
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
                      const sortedTokenAddresses = [...tokenAddresses].sort();
                      const amountsOut = sortedTokenAddresses.map(
                        (tokenAddress, i) => {
                          return state.customWithdrawableAmounts?.[i];
                        }
                      );
                      amountsOut.forEach((amount, i) => {
                        if (amount === undefined) {
                          throw new Error(
                            "amountsOut[" +
                              i +
                              "] is undefined, this should not happen"
                          );
                        }
                      });
                      const bigNumberInputAmount = ethers.utils.parseUnits(
                        state.inputAmount,
                        18
                      );
                      /** @type {ExitPoolArgs} */
                      const exitArgs = {
                        minAmountsOut: [],
                        toInternalBalance: false,
                        poolId: pool.id,
                        recipient: userAddress,
                        sender: userAddress,
                        sortedTokenAddresses: sortedTokenAddresses,
                        userData: encode(
                          ["uint256", "uint256"],
                          [1, bigNumberInputAmount]
                        ),
                      };
                      queryThenExit(
                        pool.id,
                        userAddress,
                        userAddress,
                        exitArgs
                      );
                    }
                  }}
                >
                  {typeof checkSelectedTokenIsApproved() === "boolean"
                    ? checkSelectedTokenIsApproved() || operation === "unstake"
                      ? operation === "stake"
                        ? "Stake"
                        : "Unstake"
                      : !state.inputAmount ||
                        0 === parseFloat(state.inputAmount)
                      ? "Input an amount"
                      : "Approve"
                    : "Select a token"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
return (
  <StakeUnstakeWidget
    poolBalance={poolBalance}
    errorGettingBalance={errorGettingBalance}
    operation={operation}
    FormWidget={CurrencySelector}
  />
);
