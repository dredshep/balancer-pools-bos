function getCurrentTimestamp() {
  // Get the current timestamp
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime;
}

function getGraphQLSync(query) {
  const url =
    "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2";
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  const res = fetch(url, opts);
  return res.body.data;
}

function calculateAPR(poolId) {
  const currentTime = getCurrentTimestamp();
  const oneDayAgo = currentTime - 24 * 60 * 60;
  const oneYearAgo = currentTime - 24 * 60 * 60 * 365;

  // Get the pool's total liquidity and totalSwapFee a year ago
  const poolDataYearAgo = getGraphQLSync(`
    {
      pools(first: 1, orderBy: timestamp, orderDirection: desc, where: { id: "${poolId}", timestamp_lte: ${oneYearAgo} }) {
        totalLiquidity
        totalSwapFee
      }
    }`);

  const totalLiquidityYearAgo = poolDataYearAgo.totalLiquidity;
  const totalSwapFeeYearAgo = poolDataYearAgo.totalSwapFee;

  // Get the pool's current total liquidity and totalSwapFee
  const poolDataNow = getGraphQLSync(`
    {
      pool(id: "${poolId}") {
        totalLiquidity
        totalSwapFee
      }
    }`);

  const totalLiquidityNow = poolDataNow.totalLiquidity;
  const totalSwapFeeNow = poolDataNow.totalSwapFee;

  // Calculate the fees earned in the past year
  const feesEarned = totalSwapFeeNow - totalSwapFeeYearAgo;

  // Calculate APR based on the average liquidity over the past year
  const averageLiquidity = (totalLiquidityNow + totalLiquidityYearAgo) / 2;

  const apr = (feesEarned / averageLiquidity) * 100;

  return apr;
}

function calculatePoolData(poolId) {
  const pool = getGraphQLSync(`
    {
      pool(id: "${poolId}") {
        totalLiquidity
        tokens {
          id
          balance
        }
      }
    }`);

  let poolValueUSD = 0;
  for (const token of pool.tokens) {
    const tokenData = getGraphQLSync(`
      {
        token(id: "${token.id}") {
          latestUSDPrice
        }
      }`);

    poolValueUSD += token.balance * tokenData.latestUSDPrice;
  }

  const currentTime = getCurrentTimestamp();
  const oneDayAgo = currentTime - 24 * 60 * 60;
  const swaps = getGraphQLSync(`
    {
      swaps(first: 100, orderBy: timestamp, orderDirection: desc, where: { poolId: "${poolId}", timestamp_gte: ${oneDayAgo} }) {
        valueUSD
      }
    }`);

  let volume24hUSD = 0;
  for (const swap of swaps) {
    volume24hUSD += swap.valueUSD;
  }

  const apr = calculateAPR(poolId);

  return {
    poolValueUSD,
    volume24hUSD,
    apr,
  };
}

function calculatePoolDataForAllPools() {
  const pools = getGraphQLSync(`
    {
      pools(first: 100) {
        id
      }
    }`);

  const poolData = [];
  for (const pool of pools) {
    const data = calculatePoolData(pool.id);
    poolData.push({
      id: pool.id,
      poolValueUSD: data.poolValueUSD,
      volume24hUSD: data.volume24hUSD,
      apr: data.apr,
    });
  }

  return poolData;
}

const poolData = calculatePoolDataForAllPools();
console.log(poolData);
