const poolInfo = [
  {
    totalValueLockedETH: "173.5",
    totalValueLockedUSD: "1000000",
    mngmtFee: "2",
    poolType: "Balancer",
    poolTypeVersion: "1.1",
    userBalance: "0.5",
    tokens: [
      {
        symbol: "ETH",
        balance: "3.5",
        value: "1000000",
        weight: "50",
      },
      {
        symbol: "DAI",
        balance: "1000",
        value: "1000000",
        weight: "50",
      },
    ],
  },
  {
    totalValueLockedETH: "173.5",
    totalValueLockedUSD: "1000000",
    mngmtFee: "2",
    poolType: "Balancer",
    poolTypeVersion: "1.1",
    userBalance: "0.5",
    tokens: [
      {
        symbol: "ETH",
        balance: "3.5",
        value: "1000000",
        weight: "50",
      },
      {
        symbol: "DAI",
        balance: "1000",
        value: "1000000",
        weight: "50",
      },
    ],
  },
];

/*finish the bootstrap return clause where the structure is this:

title: token1/token2
pool separator bar / lower border from title to card body 2x2 grid with the following elements:
1. pooltype
2. tvl
3. mngmnt fee
4. a small-font secondary colors table with 2 columns: token and weight a margin to bottom your balance: userBalance
2 buttons: stake and unstake
*/

const VerticalPair = ({ title, value, end }) => {
  const isEnd = !!end;
  return (
    <div className="d-flex flex-column">
      {/* size small */}
      <p
        className={
          "text-secondary text-uppercase fw-bold mb-0 text-nowrap " +
          (isEnd ? " text-end" : "")
        }
        style={{
          fontSize: "0.9rem",
          letterSpacing: "0.033rem",
        }}
      >
        {title}
      </p>
      <p className={"fs-4 fw-bold" + (isEnd ? " text-end" : "")}>{value}</p>
    </div>
  );
};

return (
  <div
    className="bg-secondary"
    style={{
      paddingTop: "1rem",
      paddingBottom: "1rem",
    }}
  >
    <div
      className="container d-flex flex-column align-items-center"
      // style={{
      //   // Gradient from 0F1023 to 3A215E
      //   background:
      //     "linear-gradient(90deg, rgba(15,16,35,1) 0%, rgba(58,33,94,1) 100%)",
      // }}
    >
      <div
        className="d-flex flex-column gap-3"
        style={{
          maxWidth: "375px",
        }}
      >
        {poolInfo.map((pool) => (
          <div className="card bg-dark text-light" key={pool.id} style={{}}>
            <div className="card-header">
              <h5
                className="card-title"
                style={{
                  marginTop: "0.4rem",
                  marginBottom: "0.3rem",
                }}
              >
                {pool.tokens.map((t) => t.symbol).join(" / ")}
              </h5>
            </div>
            <div className="card-body d-flex flex-column">
              {/* 2x2 grid*/}
              <div className="">
                <div className="row">
                  <div className="col-md-6">
                    {/* <VerticalPair>
                      Pool Type: {pool.poolType} {pool.poolTypeVersion}
                    </VerticalPair>
                    <VerticalPair>
                      Total Value Locked: {pool.totalValueLockedETH} ETH / $
                      {pool.totalValueLockedUSD}
                    </VerticalPair> */}
                    <VerticalPair
                      title="Pool Type"
                      value={`${pool.poolType} v${pool.poolTypeVersion}`}
                    />
                    <VerticalPair
                      title="Total Value Locked"
                      value={`${pool.totalValueLockedETH} ETH / $${pool.totalValueLockedUSD}`}
                    />
                  </div>
                  <div className="col-md-6">
                    {/* <VerticalPair>Mngmnt Fee: {pool.mngmtFee}%</VerticalPair> */}
                    <VerticalPair
                      title="Management Fee"
                      value={`${pool.mngmtFee}%`}
                    />
                    <table
                      className="table table-sm table-transparent text-light border-secondary"
                      style={{
                        // max size is like 150px
                        maxWidth: "200px",
                        marginTop: "-0.25rem",
                      }}
                    >
                      <thead>
                        <tr>
                          {/* uppercase font secondary */}
                          <th className="fw-bold">Token</th>
                          {/* uppercase font secondary */}
                          <th className="fw-bold">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pool.tokens.map((t) => (
                          <tr key={t.symbol}>
                            <td>{t.symbol}</td>
                            <td>{t.weight}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* align to the right */}
                <div className="row mt-3">
                  <div className="col-md-12">
                    {/* <p className="text-end fs-3">
                      Your Balance: {pool.userBalance}
                    </p> */}
                    <div className="d-flex justify-content-end">
                      <VerticalPair
                        title="Your Balance"
                        value={pool.userBalance}
                        end
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-secondary me-2 fw-bold"
                        style={{
                          letterSpacing: "0.033em",
                          // desaturate completely and lighten by 50%
                          filter: "saturate(0%) brightness(95%)",
                        }}
                      >
                        Unstake
                      </button>
                      <button
                        className="btn btn-primary fw-bold"
                        style={{
                          letterSpacing: "0.033em",
                          filter:
                            "hue-rotate(40deg) saturate(80%) brightness(104%)",
                        }}
                      >
                        Stake
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
