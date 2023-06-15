const pools = [
  { id: 1, name: "Pool 1", composition: "ETH/DAI", tvl: "1000", apr: "10%" },
  { id: 2, name: "Pool 2", composition: "BTC/ETH", tvl: "2000", apr: "15%" },
];

const TemporaryContainer = styled.div`
  background-color: black;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
`;

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
  </TemporaryContainer>
);
