// /**
//  * @typedef {{
//  * selectedTokenAddress: string,
//  * enabled: boolean,
//  * }} CurrencySelectee
//  */

// /**
//  * @typedef {{ [address: string]: CurrencySelectee }} CurrencySelector
//  */

/**
 * @typedef {{
 * checkedChainInfo: boolean,
 * userBalances: string[],
 * chainId: string,
 * chainName: string,
 * errorWrongNetwork: boolean,
 * currencySelectors: CurrencySelector,
 * }} State
 */
/** @type {State} */
const statePreInit = {
  checkedChainInfo: false,
  userBalances: [],
  chainId: "",
  chainName: "",
  errorWrongNetwork: false,
  currencySelectors: {}, //Example initial currencySelectors
};
State.init(statePreInit);

/**
 * Get Currency Selector
 * @param {State} state
 * @param {string} poolAddress
 * @returns {CurrencySelectee | undefined}
 */
function getCurrencySelector(state, poolAddress) {
  return state.currencySelectors[poolAddress];
}

/**
 * Update Currency Selector
 * @param {State} state
 * @param {string} poolAddress
 * @param {string} selectedTokenAddress
 * @param {boolean} enabled
 * @returns {State}
 */
function updateCurrencySelector(
  state,
  poolAddress,
  selectedTokenAddress,
  enabled
) {
  const currencySelectors = { ...state.currencySelectors };
  const currencySelector = currencySelectors[poolAddress] || {};

  const newCurrencySelector = {
    ...currencySelector,
    selectedTokenAddress,
    enabled,
  };

  currencySelectors[poolAddress] = newCurrencySelector;
  const newState = { ...state, currencySelectors };

  State.update(newState);

  return newState;
}

/**
 * Enable Currency Selector
 * @param {State} state
 * @param {string} poolAddress
 * @param {string} selectedTokenAddress
 * @returns {State}
 */
function enableCurrencySelector(state, poolAddress, selectedTokenAddress) {
  return updateCurrencySelector(state, poolAddress, selectedTokenAddress, true);
}

enableCurrencySelector(state, "poolAddress", "selectedTokenAddress");
State.update({ checkedChainInfo: true });
State.update({ checkedChainInfo: false });
return <pre>{JSON.stringify(state, null, 2)}</pre>;
