const pools = [
  { id: 1, name: "Pool 1", composition: "ETH/DAI", tvl: "1000", apr: "10%" },
  { id: 2, name: "Pool 2", composition: "BTC/ETH", tvl: "2000", apr: "15%" },
];

// check if account connected
const sender = Ethers.send("eth_requestAccounts", [])[0];
if (!sender) {
  return (
    <div style={{ margin: "auto", textAlign: "center", color: "white" }}>
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
  const goerliChain = {
    chainId: "0x5", // The chain ID for Goerli (5 in hexadecimal)
    chainName: "Goerli", // The name of the Goerli chain
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"], // The RPC endpoint for the Goerli chain (replace with your Infura project ID)
    blockExplorerUrls: ["https://goerli.etherscan.io/"], // The block explorer URL for Goerli
  };

  Ethers.send("wallet_addEthereumChain", [goerliChain]);
};

// if (chainId !== 1313161554) {
//   return (
//     <div style={{ margin: "auto", textAlign: "center", color: "white" }}>
//       <h2>Please switch to Aurora</h2>
//       <br />
//       <button onClick={switchChain} style={{ color: "black" }}>
//         Switch to Aurora
//       </button>
//       <br />
//       <br />
//       <p>**Please refresh once after switch chain**</p>
//     </div>
//   );
// }

const userBalance = { pool1: "500", pool2: "300" };

// Initialize state
const state = {
  selectedPoolId: null,
  actionType: null, // 'add' or 'withdraw'
  amount: "",
};

// Handle amount change
const handleAmountChange = (e) => {
  state.update({ ...state, amount: e.target.value });
};

// Handle liquidity operations
const handleLiquidityOperation = (poolId, actionType) => {
  state.update({ ...state, selectedPoolId: poolId, actionType });
};

// temporary container to hold the title and stuff
// function TemporaryContainer({ children }) {
//   return (
//     <div className="bg-dark">
//       <div className="container bg-dark text-light">
//         <h1 className="my-4">Balancer Pools on zkEVM</h1>
//         {children}
//       </div>
//     </div>
//   );
// }

/*
subgraph request data

headers:
POST /query/24660/balancer-polygon-zkevm-v2/v0.0.2 HTTP/2
Host: api.studio.thegraph.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0
Accept: application/json, multipart/mixed
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
content-type: application/json
Content-Length: 217
Origin: https://api.studio.thegraph.com
DNT: 1
Connection: keep-alive
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Sec-GPC: 1

data: {"query":"{\n  balancers(first: 3) {\n    id\n    poolCount\n    totalLiquidity\n  }\n  pools(first: 10) {\n    id\n    tokens {\n      id\n      balance\n    }\n  }\n}","variables":null,"extensions":{"headers":null}}
url: https://api.studio.thegraph.com/query/24660/balancer-polygon-zkevm-v2/v0.0.2
*/

async function getPoolData() {
  const query = `
		{
			balancers(first: 3) {
				id
				poolCount
				totalLiquidity
			}
			pools(first: 10) {
				id
				tokens {
					id
					balance
				}
			}
		}
	`;
  const url =
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zkevm-v2/v0.0.2";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };
  const rawRes = await fetch(url, options);
  const res = await rawRes.json();
  console.log(res);
  return res;
}

const TemporaryContainer = styled.div`
  background-color: black;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
`;

// const Pool = ({ pool }) => {
//   // const [stateTest, setStateTest] = useState({
//   //   selectedPoolId: null,
//   //   actionType: null,
//   //   amount: "",
//   // });
//   // useEffect(() => {
//   //   const { selectedPoolId, actionType, amount } = stateTest;
//   //   if (selectedPoolId && actionType && amount) {
//   //     alert(`You are ${actionType}ing ${amount} from pool ${selectedPoolId}`);
//   //   } else {
//   //     console.log("Please fill in all fields");
//   //   }
//   // }, [stateTest]);
//   // use effect to call the subgraph and store it in state
//   return (
//   );
// };
// useEffect(() => {
// }, []);

/*

  getPoolData().then((res) => {
    State.update({ ...State, poolData: res });
  });
*/

const loadingCom = () => {
  return (
    <div class="text-center mt-10">
      <h2>Loading Data...</h2>
    </div>
  );
};

const { poolData } = State;
if (!poolData) return loadingCom();

// getPoolData()
//   .then((res) => {
//     State.update({ poolData: res });
//   })
//   .catch((err) => {
//     State.update({ poolData: "nothing" });
//   });

/* let's test with a sleep, make a sleep function, call it with a promise and update the effect, and let's see if we can remove the loadingCom component */

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getPoolData = async () => {
  await sleep(2000);
  return "hello";
};

getPoolData().then((res) => {
  State.update({ poolData: res });
});

return (
  <TemporaryContainer>
    <div className="my-4">
      <h2>Your Pool Balance</h2>
      {Object.keys(userBalance).map((poolKey) => (
        <p key={poolKey}>
          {poolKey}: {userBalance[poolKey]}
        </p>
      ))}
    </div>

    <div className="card bg-secondary text-light">
      <div className="card-body">
        <h4 className="card-title">Pools</h4>
        {pools.map((pool) => (
          <div className="mb-3 bg-primary p-3 rounded-3" key={pool.id}>
            <h5>{pool.name}</h5>
            <h6>State Test</h6>
            {/* <p>{JSON.stringify(stateTest)}</p> */}
            <>{JSON.stringify(poolData)}</>
            <p>
              Composition: {pool.composition} <br />
              Total Value Locked: {pool.tvl} <br />
              Annual Percentage Rate: {pool.apr} <br />
              Your Balance: {userBalance[`pool${pool.id}`] || 0}
            </p>
            <button
              className="btn btn-light"
              onClick={() => handleLiquidityOperation(pool.id, "add")}
            >
              Add Liquidity
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleLiquidityOperation(pool.id, "withdraw")}
            >
              Withdraw Liquidity
            </button>
          </div>
        ))}
      </div>
    </div>

    {state.selectedPoolId && (
      <div className="card bg-secondary text-light mt-4">
        <div className="card-body">
          <h4 className="card-title">
            {state.actionType === "add"
              ? "Add Liquidity"
              : "Withdraw Liquidity"}{" "}
            to {pools.find((pool) => pool.id === state.selectedPoolId).name}
          </h4>
          <input
            type="number"
            value={state.amount}
            onChange={handleAmountChange}
            className="form-control"
            placeholder="Amount"
          />
          <button
            className="btn btn-light mt-2"
            onClick={() =>
              state.actionType === "add"
                ? console.log("Add liquidity function here")
                : console.log("Withdraw liquidity function here")
            }
          >
            Confirm
          </button>
        </div>
      </div>
    )}
  </TemporaryContainer>
);
