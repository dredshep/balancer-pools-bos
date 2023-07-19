function hexToNumString(hex) {
  return ethers.BigNumber.from(hex).toString();
}
/**
 * @param {string} chainId
 * @param {string} poolId
 * @returns {APRApiResponse | undefined}
 */
const getApr = (chainId, poolId) => {
  console.log("poolId", poolId);
  console.log("chainId", chainId);
  const url = `https://api.balancer.fi/pools/${chainId}/${poolId}`;
  const res = fetch(url).body;
  return res;
};
const pools = fetch(graphqlUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
}).body.data.pools;

function formatAPR(aprRes) {
  const total = aprRes?.apr.tokenAprs.total;
  const apr =
    typeof total === "number" || typeof total === "string"
      ? parseInt(total) / 100 + "%"
      : "N/A";
  return apr;
}

const missingProps = [];
if (!props.poolId) missingProps.push("poolId (string)");
if (!props.chainId) missingProps.push("chainId (string)");
if (missingProps.length > 0) {
  return (
    <pre className="card text-white bg-danger pt-3 px-3">
      {`APR missing props:

- ${missingProps.join("\n- ")}`}
    </pre>
  );
}

const _chainId = props.chainId;
// if it starts with 0x, dehex it, otherwise pass it raw
const chainId =
  typeof _chainId === "string"
    ? _chainId.startsWith("0x")
      ? hexToNumString(_chainId)
      : _chainId
    : _chainId;
const poolId = props.poolId;
const aprRes = getApr(chainId, poolId);
const apr = formatAPR(aprRes);

return <>{apr}</>;
