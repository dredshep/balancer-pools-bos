const { selectedTokenId, amount, hasError, status } = state;

// define loading component
const loadingCom = () => {
  return (
    <div class="text-center mt-10">
      <h2>Loading Data...</h2>
    </div>
  );
};

// check if account connected
const sender = Ethers.send("eth_requestAccounts", [])[0];
if (!sender) {
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Please login first</h2>
      <br />
      <Web3Connect connectLabel="Connect with Web3" />
    </div>
  );
}

// check if correct chain
const { chainId } = Ethers.getNetwork();
const chainIdToSwitch = "0x4E97D6A2";
const switchChain = () => {
  const auroraChain = {
    chainId: "0x4e454152", // The chain ID for Aurora (1313161554 in hexadecimal)
    chainName: "Aurora", // The name of the Aurora chain
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.aurora.dev"], // The RPC endpoint for the Aurora chain
    blockExplorerUrls: ["https://aurorascan.dev/"], // The block explorer URL for Aurora
  };

  Ethers.send("wallet_addEthereumChain", [auroraChain]);
};

if (chainId !== 1313161554) {
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Please switch to Aurora</h2>
      <br />
      <button onClick={switchChain}>Switch to Aurora</button>
      <br />
      <br />
      <p>**Please refresh once after switch chain**</p>
    </div>
  );
}

// fetch data from lens
const LenABI = fetch(
  "https://raw.githubusercontent.com/pysrbastion/bastion-abi/main/Lens.json"
).body;
const EIP20InterfaceABI = fetch(
  "https://raw.githubusercontent.com/JirapatWov/bos/main/EIP20.json"
).body;
const CEthABI = fetch(
  "https://raw.githubusercontent.com/JirapatWov/bos/main/CEther.json"
).body;
const CErc20ABI = fetch(
  "https://raw.githubusercontent.com/JirapatWov/bos/main/CErc20.json"
).body;
const ComptrollerABI = fetch(
  "https://raw.githubusercontent.com/JirapatWov/bos/main/Comptroller.json"
).body;

const checkABI1 = JSON.parse(LenABI);
const checkABI2 = JSON.parse(EIP20InterfaceABI);
const checkABI3 = JSON.parse(CEthABI);
const checkABI4 = JSON.parse(CErc20ABI);
const checkABI5 = JSON.parse(ComptrollerABI);

if (!checkABI1 || !checkABI2 || !checkABI3 || !checkABI4 || !checkABI5) {
  return loadingCom();
}

const lenContract = "0x080B5ce373fE2103A7086b31DabA412E88bD7356";

const len = new ethers.Contract(lenContract, LenABI, Ethers.provider());

const dataArray = [
  "0xfa786baC375D8806185555149235AcDb182C033b",
  "0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0",
  "0x8C14ea853321028a7bb5E4FB0d0147F183d3B677",
  "0xe5308dc623101508952948b141fD9eaBd3337D99",
  "0x845E15A441CFC1871B7AC610b0E922019BaD9826",
];

len.callStatic
  .cTokenBalancesAll(dataArray, sender, 0)
  .then((cTokenBalancesAll) => {
    State.update({ cTokenBalancesAll });
  });

len.callStatic.cTokenMetadataAll(dataArray, 0).then((cTokenMetadataAll) => {
  State.update({ cTokenMetadataAll });
});

// provide constants
const TokensDetail = {
  ["0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d"]: {
    name: "Near",
    symbol: "NEAR",
    address: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    cAddress: "0x8C14ea853321028a7bb5E4FB0d0147F183d3B677",
    icon: "near.svg",
    decimals: 24,
  },
  ["0xB12BFcA5A55806AaF64E99521918A4bf0fC40802"]: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    cAddress: "0xe5308dc623101508952948b141fD9eaBd3337D99",
    icon: "usdc.svg",
    decimals: 6,
  },
  ["0x4988a896b1227218e4A686fdE5EabdcAbd91571f"]: {
    name: "Tether USD",
    symbol: "USDT.e",
    address: "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    cAddress: "0x845E15A441CFC1871B7AC610b0E922019BaD9826",
    icon: "usdt.svg",
    decimals: 6,
  },
  ["0xf4eb217ba2454613b15dbdea6e5f22276410e89e"]: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0xf4eb217ba2454613b15dbdea6e5f22276410e89e",
    cAddress: "0xfa786baC375D8806185555149235AcDb182C033b",
    icon: "btc.png",
    decimals: 8,
  },
  ["ETH"]: {
    name: "Ether",
    symbol: "ETH",
    address: ethers.constants.AddressZero,
    cAddress: "0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0",
    icon: "eth.svg",
    decimals: 18,
  },
};

const Comptroller = "0x6De54724e128274520606f038591A00C5E94a1F6";

len.callStatic
  .getAccountLimits(Comptroller, sender)
  .then((getAccountLimits) => {
    State.update({ getAccountLimits });
  });

if (
  !state.cTokenBalancesAll ||
  !state.getAccountLimits ||
  !state.cTokenMetadataAll
) {
  return loadingCom();
}

const BigNumberToken = (value, decimals) => {
  return ethers.BigNumber.from(
    Math.round(Number(value) * Math.pow(10, decimals)).toLocaleString("en-US", {
      useGrouping: false,
    })
  );
};

const handleSelect = (e) => {
  State.update({
    amount: "",
    selectedTokenId: e.target.value,
    hasError: 0,
  });
};

const handleAmount = (e) => {
  State.update({
    amount: e.target.value,
    selectedTokenId,
    hasError: 0,
  });
};

const handleApprove = () => {
  if (!selectedTokenId || !amount || hasError) return;

  if (state.actionTabs == "repay") {
    if (amount > state.borrowedAmount) {
      State.update({ hasError: 3 });
      return;
    }
  } else if (state.actionTabs == "deposit") {
    if (amount > state.balance) {
      State.update({ hasError: 1 });
      return;
    }
  }

  const erc20 = new ethers.Contract(
    selectedTokenId,
    EIP20InterfaceABI,
    Ethers.provider().getSigner()
  );

  const toBigNumber = BigNumberToken(
    amount,
    TokensDetail[selectedTokenId].decimals
  );

  erc20
    .approve(TokensDetail[selectedTokenId].cAddress, toBigNumber)
    .then((transaction) => {
      console.log("Transaction sent:", transaction.hash);
      State.update({ hasError: -1 });
      return transaction.wait();
    })
    .then((receipt) => {
      State.update({ hasError: 0 });
      State.update({ success: true });
      console.log("Transaction mined, receipt:", receipt);
    })
    .catch((error) => {
      State.update({ hasError: 5, errorMessage: error });
      console.log("Error in mint function:", error);
    });
};

const handleDeposit = () => {
  if (!selectedTokenId || !amount || hasError) return;

  if (Number(amount) > Number(state.balance)) {
    State.update({ hasError: 1 });
    return;
  }

  let contractABI;
  if (selectedTokenId == "ETH") {
    contractABI = CEthABI;
  } else {
    contractABI = CErc20ABI;
  }

  const connection = new ethers.Contract(
    TokensDetail[selectedTokenId].cAddress,
    contractABI,
    Ethers.provider().getSigner()
  );

  const toBigNumber = BigNumberToken(
    amount,
    TokensDetail[selectedTokenId].decimals
  );

  const mintPromise =
    selectedTokenId == "ETH"
      ? connection.mint({ value: toBigNumber })
      : connection.mint(toBigNumber);

  mintPromise
    .then((transaction) => {
      console.log("Transaction sent:", transaction.hash);
      State.update({ hasError: -1 });
      return transaction.wait();
    })
    .then((receipt) => {
      State.update({ hasError: 0 });
      State.update({ success: true });
      console.log("Transaction mined, receipt:", receipt);
    })
    .catch((error) => {
      State.update({ hasError: 5, errorMessage: error });
      console.log("Error in mint function:", error);
    });
};

const getCTokenBalancesAllIndex = () => {
  const rewardIndex = state.cTokenBalancesAll.findIndex(
    (element) => element[0] == TokensDetail[selectedTokenId].cAddress
  );
  return rewardIndex;
};

const walletBalance = () => {
  const rewardIndex = getCTokenBalancesAllIndex();
  const bigValue = state.cTokenBalancesAll[rewardIndex][4].toString();
  const cal =
    Number(bigValue) / Math.pow(10, TokensDetail[selectedTokenId].decimals);
  State.update({
    balance: Number(cal),
  });
  return cal;
};

const supplyBalance = () => {
  const rewardIndex = getCTokenBalancesAllIndex();
  const bigValue = state.cTokenBalancesAll[rewardIndex][1].mul(
    state.cTokenBalancesAll[rewardIndex][3]
  );
  return (
    Number(bigValue.toString()) /
    Math.pow(10, 18 + TokensDetail[selectedTokenId].decimals)
  );
};

const getAllowance = () => {
  const rewardIndex = getCTokenBalancesAllIndex();
  const bigValue = state.cTokenBalancesAll[rewardIndex][5].toString();
  const cal =
    Number(bigValue) / Math.pow(10, TokensDetail[selectedTokenId].decimals);
  State.update({
    allowance: Number(cal),
  });
};

const remainingBalance = () => {
  let totalBorrowLimit = ethers.BigNumber.from(0);
  let totalBorrowd = ethers.BigNumber.from(0);
  for (const key of dataArray) {
    // find total borrow limit
    const indexBalance = state.cTokenBalancesAll.findIndex(
      (element) => element[0] == key
    );
    const indexMeta = state.cTokenMetadataAll.findIndex(
      (element) => element[0] == key
    );
    const bigValue = state.cTokenBalancesAll[indexBalance][1].mul(
      state.cTokenBalancesAll[indexBalance][3]
    );
    const valueUsd = bigValue.mul(state.cTokenMetadataAll[indexMeta][1]);
    const valueWithCFactor = valueUsd.mul(
      state.cTokenMetadataAll[indexMeta][11]
    );
    // find total borrowed
    const bigValueBorrowedUSD = state.cTokenBalancesAll[indexBalance][2].mul(
      state.cTokenMetadataAll[indexMeta][1]
    );
    if (state.getAccountLimits[0].includes(key)) {
      totalBorrowLimit = totalBorrowLimit.add(valueWithCFactor);
      totalBorrowd = totalBorrowd.add(bigValueBorrowedUSD);
    }
  }
  const totalBorrowdFinal =
    Number(totalBorrowd.toString()) / Math.pow(10, 18 * 2);
  const totalBorrowdLimitFinal =
    Number(totalBorrowLimit.toString()) / Math.pow(10, 18 * 4);
  State.update({
    LimitAmount: totalBorrowdLimitFinal - totalBorrowdFinal,
  });
  return totalBorrowdLimitFinal - totalBorrowdFinal;
};

const handleBorrow = () => {
  if (!selectedTokenId || !amount || hasError) return;
  if (Number(state.amount) > Number(state.LimitAmount)) {
    State.update({ hasError: 2 });
    return;
  }

  let contractABI;
  if (selectedTokenId == "ETH") {
    contractABI = CEthABI;
  } else {
    contractABI = CErc20ABI;
  }

  const connection = new ethers.Contract(
    TokensDetail[selectedTokenId].cAddress,
    contractABI,
    Ethers.provider().getSigner()
  );

  const toBigNumber = BigNumberToken(
    amount,
    TokensDetail[selectedTokenId].decimals
  ).toString();

  connection
    .borrow(toBigNumber)
    .then((transaction) => {
      console.log("Transaction sent:", transaction.hash);
      State.update({ hasError: -1 });
      return transaction.wait();
    })
    .then((receipt) => {
      State.update({ hasError: 0 });
      State.update({ success: true });
      console.log("Transaction receipt:", receipt);
    })
    .catch((error) => {
      State.update({ hasError: 5, errorMessage: error });
      console.log("Error:", error);
    });
};

const getBorrowed = () => {
  const rewardIndex = getCTokenBalancesAllIndex();
  const bigValueBorrowed = state.cTokenBalancesAll[rewardIndex][2];
  const finalValue =
    Number(bigValueBorrowed.toString()) /
    Math.pow(10, TokensDetail[selectedTokenId].decimals);
  State.update({ borrowedAmount: finalValue });
  return finalValue;
};

const handleRepay = () => {
  if (!selectedTokenId || !amount || hasError) return;

  if (Number(amount) > Number(state.borrowedAmount)) {
    State.update({ hasError: 3 });
    return;
  }

  let contractABI;
  if (selectedTokenId == "ETH") {
    contractABI = CEthABI;
  } else {
    contractABI = CErc20ABI;
  }

  const connection = new ethers.Contract(
    TokensDetail[selectedTokenId].cAddress,
    contractABI,
    Ethers.provider().getSigner()
  );

  const toBigNumber = BigNumberToken(
    amount,
    TokensDetail[selectedTokenId].decimals
  ).toString();

  connection
    .repayBorrow(toBigNumber)
    .then((transaction) => {
      console.log("Transaction sent:", transaction.hash);
      State.update({ hasError: -1 });
      return transaction.wait();
    })
    .then((receipt) => {
      State.update({ hasError: 0 });
      State.update({ success: true });
      console.log("Transaction receipt:", receipt);
    })
    .catch((error) => {
      State.update({ hasError: 5, errorMessage: error });
      console.log("Error:", error);
    });
};

const maxWithdraw = () => {
  const rewardIndex = getCTokenBalancesAllIndex();
  const supplyBalance = supplyBalance();
  const tokenPrice =
    Number(state.cTokenMetadataAll[rewardIndex][1].toString()) /
    Math.pow(10, 18 + (18 - TokensDetail[selectedTokenId].decimals));
  const liquidity =
    Number(state.getAccountLimits[1].toString()) / Math.pow(10, 18);
  const liquidityInToken = liquidity / tokenPrice;
  const CFactor =
    Number(state.cTokenMetadataAll[rewardIndex][11].toString()) /
    Math.pow(10, 18);
  const totalLiquidity = liquidityInToken / CFactor;
  if (supplyBalance >= totalLiquidity) {
    State.update({ maxWithdraw: Number(totalLiquidity) });
    return totalLiquidity;
  } else {
    State.update({ maxWithdraw: Number(supplyBalance) });
    return supplyBalance;
  }
};

const handleWithdraw = () => {
  if (!selectedTokenId || !amount || hasError) return;

  if (Number(amount) > Number(state.maxWithdraw)) {
    State.update({ hasError: 4 });
    return;
  }

  let contractABI;
  if (selectedTokenId == "ETH") {
    contractABI = CEthABI;
  } else {
    contractABI = CErc20ABI;
  }

  const connection = new ethers.Contract(
    TokensDetail[selectedTokenId].cAddress,
    contractABI,
    Ethers.provider().getSigner()
  );

  const toBigNumber = BigNumberToken(
    amount,
    TokensDetail[selectedTokenId].decimals
  ).toString();

  const supplyBalance = supplyBalance();

  if (amount >= supplyBalance) {
    connection
      .redeem(toBigNumber)
      .then((transaction) => {
        console.log("Transaction sent:", transaction.hash);
        State.update({ hasError: -1 });
        return transaction.wait();
      })
      .then((receipt) => {
        State.update({ hasError: 0 });
        State.update({ success: true });
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        State.update({ hasError: 5, errorMessage: error });
        console.log("Error:", error);
      });
  } else {
    connection
      .redeemUnderlying(toBigNumber)
      .then((transaction) => {
        console.log("Transaction sent:", transaction.hash);
        State.update({ hasError: -1 });
        return transaction.wait();
      })
      .then((receipt) => {
        State.update({ hasError: 0 });
        State.update({ success: true });
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        State.update({ hasError: 5, errorMessage: error });
        console.log("Error:", error);
      });
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const handleCollateral = () => {
  if (!selectedTokenId) return;
  const connection = new ethers.Contract(
    "0x6De54724e128274520606f038591A00C5E94a1F6",
    ComptrollerABI,
    Ethers.provider().getSigner()
  );
  if (
    !state.getAccountLimits[0].includes(TokensDetail[selectedTokenId].cAddress)
  ) {
    connection
      .enterMarkets([TokensDetail[selectedTokenId].cAddress])
      .then((transaction) => {
        console.log("Transaction sent:", transaction.hash);
        State.update({ hasError: -1 });
        return transaction.wait();
      })
      .then((receipt) => {
        State.update({ hasError: 0 });
        State.update({ success: true });
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        State.update({ hasError: 5, errorMessage: error });
        console.log("Error:", error);
      });
  } else {
    const borrowBalance = getBorrowed();
    const supplyBalance = supplyBalance();
    const maxWithdraw = maxWithdraw();

    if (Number(borrowBalance) > 0) {
      State.update({ hasError: 6 });
    } else if (supplyBalance > maxWithdraw) {
      State.update({ hasError: 7 });
    } else {
      connection
        .exitMarket(TokensDetail[selectedTokenId].cAddress)
        .then((transaction) => {
          console.log("Transaction sent:", transaction.hash);
          State.update({ hasError: -1 });
          return transaction.wait();
        })
        .then((receipt) => {
          State.update({ hasError: 0 });
          State.update({ success: true });
          console.log("Transaction receipt:", receipt);
        })
        .catch((error) => {
          State.update({ hasError: 5, errorMessage: error });
          console.log("Error:", error);
        });
    }
  }
};

const allAssetData = state.cTokenMetadataAll
  ? Object.keys(TokensDetail).map((key) => {
      const indexMeta = state.cTokenMetadataAll.findIndex(
        (element) => element[0] == TokensDetail[key].cAddress
      );
      const totalSupply = state.cTokenMetadataAll[indexMeta][8].mul(
        state.cTokenMetadataAll[indexMeta][2]
      );
      const totalSupplyValue =
        Number(totalSupply.toString()) /
        Math.pow(10, 18 + TokensDetail[key].decimals);
      const supplyRatePerBlock = state.cTokenMetadataAll[indexMeta][3];
      const supplyApy =
        (Math.pow(
          (Number(supplyRatePerBlock.toString()) / 1e18) * 86400 + 1,
          365
        ) -
          1) *
        100;
      const borrowRatePerBlock = state.cTokenMetadataAll[indexMeta][4];
      const borrowApy =
        (Math.pow(
          (Number(borrowRatePerBlock.toString()) / 1e18) * 86400 + 1,
          365
        ) -
          1) *
        100;
      const valueUSD =
        totalSupplyValue *
        (Number(state.cTokenMetadataAll[indexMeta][1].toString()) /
          Math.pow(10, 18 + (18 - TokensDetail[key].decimals)));
      return (
        <tr>
          <td>{TokensDetail[key].name}</td>
          <td class="text-end">{supplyApy.toFixed(2)}%</td>
          <td class="text-end">{borrowApy.toFixed(2)}%</td>
          <td class="text-end">
            {numberWithCommas(totalSupplyValue.toFixed(2))}{" "}
            {TokensDetail[key].symbol}
            <br />
            (${numberWithCommas(valueUSD.toFixed(2))})
          </td>
        </tr>
      );
    })
  : undefined;

const fetchAllData = () => {
  State.update({ allDataTab: allAssetData });
};

const portfolio =
  state.cTokenBalancesAll && state.cTokenMetadataAll
    ? Object.keys(TokensDetail).map((key) => {
        const indexMeta = state.cTokenMetadataAll.findIndex(
          (element) => element[0] == TokensDetail[key].cAddress
        );
        const indexBalance = state.cTokenBalancesAll.findIndex(
          (element) => element[0] == TokensDetail[key].cAddress
        );
        const bigValue = state.cTokenBalancesAll[indexBalance][4].toString();
        const cal = Number(bigValue) / Math.pow(10, TokensDetail[key].decimals);

        const bigValueSupply = state.cTokenBalancesAll[indexBalance][1].mul(
          state.cTokenBalancesAll[indexBalance][3]
        );
        const supplied =
          Number(bigValueSupply.toString()) /
          Math.pow(10, 18 + TokensDetail[key].decimals);
        const bigValueBorrowed = state.cTokenBalancesAll[indexBalance][2];
        const finalValueBorrowed =
          Number(bigValueBorrowed.toString()) /
          Math.pow(10, TokensDetail[key].decimals);
        const price =
          Number(state.cTokenMetadataAll[indexMeta][1].toString()) /
          Math.pow(10, 18 + (18 - TokensDetail[key].decimals));
        return (
          <tr>
            <td>{TokensDetail[key].name}</td>
            <td class="text-end">
              {cal.toFixed(2)} {TokensDetail[key].symbol}
              <br />
              (${numberWithCommas((Number(cal) * price).toFixed(2))})
            </td>
            <td class="text-end">
              {supplied.toFixed(2)} {TokensDetail[key].symbol}
              <br />
              (${numberWithCommas((Number(supplied) * price).toFixed(2))})
            </td>
            <td class="text-end">
              {finalValueBorrowed.toFixed(2)} {TokensDetail[key].symbol}
              <br />
              ($
              {numberWithCommas(
                (Number(finalValueBorrowed) * price).toFixed(2)
              )}
              )
            </td>
            <td class="text-end">
              {state.getAccountLimits[0].includes(
                TokensDetail[key].cAddress
              ) ? (
                <span style={{ color: "green" }}>Used</span>
              ) : (
                <span style={{ color: "red" }}>Not used</span>
              )}
            </td>
          </tr>
        );
      })
    : undefined;

if (!state.actionTabs) {
  State.update({ actionTabs: "deposit" });
}
if (!state.actionList) {
  State.update({ actionList: "assets" });
}

return (
  <>
    {state.cTokenBalancesAll &&
    state.cTokenMetadataAll &&
    state.getAccountLimits ? (
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        <div style={{ paddingRight: "3rem", width: "60%" }}>
          <div class="list btn-group" role="group" aria-label="List">
            <input
              type="radio"
              class="btn-check"
              name="btnradiolist"
              id="assets"
              autocomplete="off"
              checked={state.actionList === "assets"}
              onClick={() => State.update({ actionList: "assets" })}
            />
            <label class="btn btn-outline-primary" for="assets">
              Assets
            </label>
            <input
              type="radio"
              class="btn-check"
              name="btnradiolist"
              id="portfolio"
              autocomplete="off"
              checked={state.actionList === "portfolio"}
              onClick={() => State.update({ actionList: "portfolio" })}
            />
            <label class="btn btn-outline-primary" for="portfolio">
              Portfolio
            </label>
          </div>
          {state.actionList == "assets" ? (
            <table class="table">
              <thead>
                <tr
                  style={{
                    color: "white",
                  }}
                >
                  <th scope="col">Asset</th>
                  <th scope="col" class="text-end">
                    APY
                  </th>
                  <th scope="col" class="text-end">
                    APY (borrow)
                  </th>
                  <th scope="col" class="text-end">
                    Total Supply
                  </th>
                </tr>
              </thead>
              {fetchAllData()}
              <tbody>{state.allDataTab}</tbody>
            </table>
          ) : (
            <table class="table">
              <thead>
                <tr
                  style={{
                    color: "white",
                  }}
                >
                  <th scope="col">Asset</th>
                  <th scope="col" class="text-end">
                    Wallet Balance
                  </th>
                  <th scope="col" class="text-end">
                    Supplied
                  </th>
                  <th scope="col" class="text-end">
                    Borrowed
                  </th>
                  <th scope="col" class="text-end">
                    Collateral status
                  </th>
                </tr>
              </thead>
              <tbody>{portfolio}</tbody>
            </table>
          )}
        </div>
        <div style={{ maxWidth: "400px" }}>
          <div class="card-body d-grid gap-3">
            <div class="action btn-group" role="group" aria-label="Deposit">
              <input
                type="radio"
                class="btn-check"
                name="btnradioaction"
                id="deposit"
                autocomplete="off"
                checked={state.actionTabs === "deposit"}
                onClick={() => {
                  State.update({
                    amount: "",
                    hasError: 0,
                    actionTabs: "deposit",
                  });
                }}
              />
              <label class="btn btn-outline-primary" for="deposit">
                Deposit
              </label>
              <input
                type="radio"
                class="btn-check"
                name="btnradioaction"
                id="borrow"
                autocomplete="off"
                checked={state.actionTabs === "borrow"}
                onClick={() => {
                  State.update({
                    amount: "",
                    hasError: 0,
                    actionTabs: "borrow",
                  });
                }}
              />
              <label class="btn btn-outline-primary" for="borrow">
                Borrow
              </label>
              <input
                type="radio"
                class="btn-check"
                name="btnradioaction"
                id="repay"
                autocomplete="off"
                checked={state.actionTabs === "repay"}
                onClick={() => {
                  State.update({
                    amount: "",
                    hasError: 0,
                    actionTabs: "repay",
                  });
                }}
              />
              <label class="btn btn-outline-primary" for="repay">
                Repay
              </label>
              <input
                type="radio"
                class="btn-check"
                name="btnradioaction"
                id="withdraw"
                autocomplete="off"
                checked={state.actionTabs === "withdraw"}
                onClick={() => {
                  State.update({
                    amount: "",
                    hasError: 0,
                    actionTabs: "withdraw",
                  });
                }}
              />
              <label class="btn btn-outline-primary" for="withdraw">
                Withdraw
              </label>
            </div>
            <div>
              <div class="mb-2 text-muted">Token</div>
              <select
                onChange={handleSelect}
                class="p-2 mb-1"
                style={{ width: "100%" }}
              >
                <option value="">Choose your token</option>
                {Object.keys(TokensDetail).map((key) => {
                  return (
                    <option
                      key={key}
                      value={key}
                      selected={selectedTokenId === key}
                    >
                      {TokensDetail[key].symbol}
                    </option>
                  );
                })}
              </select>
              {state.selectedTokenId !== undefined &&
              state.selectedTokenId !== "" ? (
                state.actionTabs == "deposit" ? (
                  <div>
                    <span class="badge bg-light text-dark">
                      Wallet Balance: {walletBalance().toFixed(3)}{" "}
                      {TokensDetail[selectedTokenId].symbol}
                    </span>
                    <span class="badge bg-light text-dark">
                      Supply Balance: {supplyBalance().toFixed(3)}{" "}
                      {TokensDetail[selectedTokenId].symbol}
                    </span>
                    {getAllowance()}
                  </div>
                ) : state.actionTabs == "borrow" ? (
                  <div>
                    <span class="badge bg-light text-dark">
                      Remaining Borrow Limit: $ {remainingBalance().toFixed(3)}
                    </span>
                  </div>
                ) : state.actionTabs == "repay" ? (
                  <div>
                    <span class="badge bg-light text-dark">
                      Wallet Balance: {walletBalance().toFixed(3)}{" "}
                      {TokensDetail[selectedTokenId].symbol}
                    </span>
                    <span class="badge bg-light text-dark">
                      Amount Borrowed: {getBorrowed().toFixed(3)}{" "}
                      {TokensDetail[selectedTokenId].symbol}
                    </span>
                    {getAllowance()}
                  </div>
                ) : (
                  <div>
                    <span class="badge bg-light text-dark">
                      Max Withdrawal: {maxWithdraw().toFixed(3)}{" "}
                      {TokensDetail[selectedTokenId].symbol}
                    </span>
                  </div>
                )
              ) : (
                ""
              )}
            </div>
            {state.actionTabs == "deposit" &&
              state.selectedTokenId !== undefined &&
              state.selectedTokenId !== "" && (
                <div class="flex">
                  <span>
                    {state.getAccountLimits[0].includes(
                      TokensDetail[selectedTokenId].cAddress
                    )
                      ? "You are using this asset as colleteral."
                      : "This asset is NOT being used as collateral."}
                  </span>
                  {state.getAccountLimits[0].includes(
                    TokensDetail[selectedTokenId].cAddress
                  ) ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={handleCollateral}
                    >
                      Click here to Remove
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={handleCollateral}
                    >
                      Click here to Enable
                    </span>
                  )}
                </div>
              )}
            <div>
              <div class="mb-2 text-muted">Amount</div>
              <input type="number" value={amount} onChange={handleAmount} />
            </div>
            {state.hasError == 1 ? (
              <p class="alert alert-danger" role="alert">
                Amount greater than balance
              </p>
            ) : state.hasError == 2 ? (
              <p class="alert alert-danger" role="alert">
                Amount greater than Remaining Borrow Limit
              </p>
            ) : state.hasError == 3 ? (
              <p class="alert alert-danger" role="alert">
                Amount greater than Amount Borrowed
              </p>
            ) : state.hasError == 4 ? (
              <p class="alert alert-danger" role="alert">
                Amount greater than Max Withdrawal
              </p>
            ) : state.hasError == 5 ? (
              <p class="alert alert-danger" role="alert">
                Something went wrong!! error: {errorMessage}
              </p>
            ) : state.hasError == 6 ? (
              <p class="alert alert-danger" role="alert">
                You need to repay your borrowed{" "}
                {TokensDetail[selectedTokenId].symbol} to stop using this asset
                as collateral.
              </p>
            ) : state.hasError == 7 ? (
              <p class="alert alert-danger" role="alert">
                Your liquidity is not enough to stop using this asset as
                collateral.
              </p>
            ) : state.hasError == -1 ? (
              <p class="alert alert-warning" role="alert">
                Waiting for confirmation ...
              </p>
            ) : state.success == true ? (
              <p class="alert alert-success" role="alert">
                Your transaction was sent successfully
              </p>
            ) : (
              ""
            )}
            {state.actionTabs == "deposit" ? (
              state.amount > state.allowance &&
              state.selectedTokenId !== "ETH" ? (
                <button
                  disabled={state.amount == undefined || state.amount == ""}
                  onClick={handleApprove}
                  style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
                >
                  Approve
                </button>
              ) : (
                <button
                  disabled={state.amount == undefined || state.amount == ""}
                  onClick={handleDeposit}
                  style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
                >
                  Deposit
                </button>
              )
            ) : state.actionTabs == "borrow" ? (
              <button
                disabled={state.amount == undefined || state.amount == ""}
                onClick={handleBorrow}
                style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
              >
                Borrow
              </button>
            ) : state.actionTabs == "repay" ? (
              state.amount > state.allowance &&
              state.selectedTokenId !== "ETH" ? (
                <button
                  disabled={state.amount == undefined || state.amount == ""}
                  onClick={handleApprove}
                  style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
                >
                  Approve
                </button>
              ) : (
                <button
                  disabled={state.amount == undefined || state.amount == ""}
                  onClick={handleRepay}
                  style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
                >
                  Repay
                </button>
              )
            ) : (
              <button
                disabled={state.amount == undefined || state.amount == ""}
                onClick={handleWithdraw}
                style={{ background: "#4ED58A", borderColor: "#4ED58A" }}
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div>
        <h2>Loading...</h2>
      </div>
    )}
  </>
);
