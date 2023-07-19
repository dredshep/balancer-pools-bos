const graphqlUrl =
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest";
const query = `
{
  balancers {
    id
    poolCount
    totalLiquidity
  }
  pools(orderBy: totalLiquidity, orderDirection: desc) {
    id
    address
    symbol
    name
    totalLiquidity
    tokens {
      address
      symbol
    }
  }

}`;

function hexToNumString(hex) {
  return ethers.BigNumber.from(hex).toString();
}
// returns APRApiResponse | undefined
/**
 * @param {string} chainId
 * @param {string} poolId
 * @returns {APRApiResponse | undefined}
 */
const getApr = (chainId, poolId) => {
  console.log("poolId", poolId);
  console.log("chainId", chainId);
  // const url = `https://api.balancer.fi/pools/${hexToNumString(
  //   chainId
  // )}/${poolId}`;
  const url = `https://api.balancer.fi/pools/1101/${poolId}`;
  // @ts-ignore
  const res = fetch(url).body;
  return res;
};
const pools = fetch(graphqlUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
}).body.data.pools;

const ids = pools.map((pool) => pool.id);
const names = pools.map((pool) => pool.name);
const totalLiquidities = pools.map((pool) => pool.totalLiquidity);

function convertObjectToYaml(obj) {
  let yaml = "";

  function processObject(obj, indentLevel) {
    const indent = "  ".repeat(indentLevel);
    if (!obj) return;

    // for (const key in obj) {
    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === "object") {
          yaml += `${indent}${key}:\n`;
          processObject(value, indentLevel + 1);
        } else {
          yaml += `${indent}${key}: ${value}\n`;
        }
      }
    });
  }

  processObject(obj, 0);

  // This removes the initial newline character from the string.
  return yaml.startsWith("\n") ? yaml.slice(1) : yaml;
}

function commaifyStringifiedInt(str) {
  const strArr = str.split("");
  let count = 0;
  for (let i = strArr.length - 1; i >= 0; i--) {
    if (count % 3 === 0 && count !== 0) {
      strArr.splice(i + 1, 0, ",");
    }
    count++;
  }
  return strArr.join("");
}

function APRTable({ ids, getApr }) {
  return (
    <div className="container bg-dark text-white p-5 mt-5 rounded shadow border border-white border-5">
      <h1
        className="text-center"
        style={{ fontFamily: "monospace", color: "#0dcaf0" }}
      >
        APR
      </h1>
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Pool Name</th>
            <th scope="col">Pool Value</th>
            <th scope="col">APR</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            /**@type {APRApiResponse} */
            const aprRes = getApr("1101", id);
            const total = aprRes?.apr.tokenAprs.total;
            const apr =
              typeof total === "number" || typeof total === "string"
                ? parseInt(total) / 100 + "%"
                : typeof total === "object"
                ? JSON.stringify(total)
                : typeof total === "undefined"
                ? "undefined"
                : "unknown";
            return (
              <tr key={id}>
                <th scope="row">{names[ids.indexOf(id)]}</th>
                <td>
                  $
                  {commaifyStringifiedInt(
                    parseFloat(totalLiquidities[ids.indexOf(id)]).toFixed(0)
                  )}
                </td>
                <td>{apr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

return (
  <APRTable
    ids={ids}
    getApr={(chainId, poolId) => {
      const url = `https://api.balancer.fi/pools/1101/${poolId}`;
      // @ts-ignore
      const res = fetch(url).body;
      return res;
    }}
  />
);
