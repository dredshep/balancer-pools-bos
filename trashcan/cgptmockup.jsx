import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  // Mock Data
  const pools = [
    { id: 1, name: "Pool 1", composition: "ETH/DAI", tvl: "1000", apr: "10%" },
    { id: 2, name: "Pool 2", composition: "BTC/ETH", tvl: "2000", apr: "15%" },
    // Add more pools as needed
  ];

  const userBalance = { pool1: "500", pool2: "300" };

  return (
    <div className="container">
      <h1 className="my-4">Balancer Pools on zkEVM</h1>

      <div className="row">
        {pools.map((pool) => (
          <div className="col-lg-4 col-md-6 mb-4" key={pool.id}>
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">{pool.name}</h4>
                <h5>Composition: {pool.composition}</h5>
                <p className="card-text">
                  Total Value Locked: {pool.tvl} <br />
                  Annual Percentage Rate: {pool.apr}
                </p>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary">Add Liquidity</button>
                <button className="btn btn-secondary">
                  Withdraw Liquidity
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-4">
        <h2>Your Pool Balance</h2>
        <p>Pool 1: {userBalance.pool1}</p>
        <p>Pool 2: {userBalance.pool2}</p>
        {/* Add more balances as needed */}
      </div>
    </div>
  );
};

export default App;
