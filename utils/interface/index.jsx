const pools = [
  {
    id: "0x1a9f4d",
    name: "Pool 1",
    composition: "ETH/DAI",
    tvl: "1000",
    apr: "10%",
  },
  {
    id: "0x37c8a2",
    name: "Pool 2",
    composition: "BTC/ETH",
    tvl: "2000",
    apr: "15%",
  },
];

const TemporaryContainer = styled.div`
  background: linear-gradient(to right, #07081c, #4b2e71);
  filter: noise(0.7) grayscale(0.7);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
`;

const colors = {
  darkGray200: "#151718",
  darkGray400: "#2C2E2F",
  purple: "#8247e5",
};

const lightenColor = (color, percent) => {
  const { r, g, b, a } = color;
  const newAlpha = a - (a * percent) / 100;
  return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
};

const PurpleButton = styled.button`
  &&& {
    background-color: ${colors.purple};
  }

  &&&:hover {
    background-color: ${lightenColor(colors.purple, 20)};
  }
`;
const First = styled.div`
  background: linear-gradient(to right, #07081c, #4b2e71);
  filter: noise(0.7) grayscale(0.7);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
`;
const HoverDiv = styled.div`
  background-color: #8247e5;
  padding: 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      lightenColor({ r: 130, g: 71, b: 229, a: 1 }, 20)};
  }

  &:active {
    background-color: ${(props) =>
      lightenColor({ r: 130, g: 71, b: 229, a: 1 }, 40)};
  }
`;

function PoolList({ pools, userBalance }) {
  const colors = {
    darkGray200: "#2c2c2c",
    darkGray400: "#1c1c1c",
  };
  const { poolData } = usePoolData();

  const handleLiquidityOperation = (poolId, operation) => {
    if (operation === "add") {
      console.log(`Adding liquidity to pool ${poolId}`);
    } else if (operation === "remove") {
      console.log(`Removing liquidity from pool ${poolId}`);
    }
  };

  return (
    <div className="card bg-dark bg-gradient text-light">
      <div
        className="card-body"
        style={{ backgroundColor: colors.darkGray200 }}
      >
        <h4 className="card-title">Pools</h4>
        {pools.map((pool) => (
          <div
            className="mb-3 p-3 rounded-3"
            key={pool.id}
            style={{ backgroundColor: colors.darkGray400 }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://www.cryptocompare.com${
                  poolData[pool.token1].ImageUrl
                }`}
                alt={pool.token1}
                width="50"
                height="50"
              />
              <img
                src={`https://www.cryptocompare.com${
                  poolData[pool.token2].ImageUrl
                }`}
                alt={pool.token2}
                width="50"
                height="50"
              />
            </div>
            <h2>
              {pool.token1}/{pool.token2}
            </h2>
            <p style={{ textAlign: "right" }}>
              Composition: {pool.composition} <br />
              Total Value Locked: {pool.tvl} <br />
              Annual Percentage Rate: {pool.apr} <br />
              Your Balance: {userBalance[`pool${pool.id}`] || 0}
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => handleLiquidityOperation(pool.id, "add")}
              >
                Add Liquidity
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleLiquidityOperation(pool.id, "remove")}
              >
                Remove Liquidity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

return (
  <TemporaryContainer>
    <PoolList pools={pools} userBalance={userBalance} />
  </TemporaryContainer>
);
