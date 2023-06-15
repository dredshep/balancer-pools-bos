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

State.init({
  pools: [],
});

function getPoolData() {
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
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      State.update({
        pools: res.data.pools,
      });
      console.log(JSON.stringify(res, null, 2));
    });
}

fetch(
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zkevm-v2/v0.0.2",
  {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="96", "Google Chrome";v="96", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    },
    body: '{"query":"{\\n  balancers(first: 3) {\\n    id\\n    poolCount\\n    totalLiquidity\\n  }\\n  pools(first: 10) {\\n    id\\n    tokens {\\n      id\\n      balance\\n    }\\n  }\\n}","variables":null,"extensions":{"headers":null}}',
    method: "POST",
    mode: "cors",
  }
)
  .then((response) => {
    console.log("got a response");
    console.log(response.json());
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

return <></>;

// const Pool = ({ pool }) => {
//   const [token0, token1] = pool.tokens;
//   return (
//     <div className="card mb-4">
//       <div className="card-body">
//         <h5 className="card-title">{pool.id}</h5>
//         <p className="card-text">
//           {token0.id}: {token0.balance}
//           <br />
//           {token1.id}: {token1.balance}
//         </p>
//       </div>
//     </div>
//   );
// };

// if (!state.pools.length) {
//   getPoolData();
//   return <div>Loading...</div>;
// } else {
//   return (
//     <div className="container">
//       <h1 className="my-4">Balancer Pools on zkEVM</h1>
//       {state.pools.map((pool) => (
//         <Pool pool={pool} />
//       ))}
//     </div>
//   );
// }
