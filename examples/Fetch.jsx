const data = fetch(
  "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest",
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
);

// example response: {"data":{"ok":true,"status":200,"contentType":"application/json","body":{"data":{"balancers":[{"id":"2","poolCount":10,"totalLiquidity":"66.347125313864407829"}],"pools":[{"id":"0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006","tokens":[{"id":"0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0x02c9dcb975262719a61f9b40bdf0987ead9add3a","balance":"5192296858534827.628530496329220095"},{"id":"0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"},{"id":"0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006-0xdbf7b9f1d2bfba14e42709f84dda3187ee410e38","balance":"0"}]},{"id":"0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a","tokens":[{"id":"0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0x120ef59b80774f02211563834d8e3b72cb1649d6","balance":"6.317619362716334168"},{"id":"0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0x1e4a5963abfd975d8c9021ce480b42188849d41d","balance":"14.807211"},{"id":"0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a-0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035","balance":"16"}]},{"id":"0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005","tokens":[{"id":"0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x32f03464fdf909fdf3798f87ff3712b10c59bd86","balance":"5192296858534827.628530496329220095"},{"id":"0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"},{"id":"0x32f03464fdf909fdf3798f87ff3712b10c59bd86000000000000000000000005-0x698caed853be9cea96c268f565e2b61d3b2bcda4","balance":"0"}]},{"id":"0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000","tokens":[{"id":"0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000-0x120ef59b80774f02211563834d8e3b72cb1649d6","balance":"0"},{"id":"0x3c87ff3e9307dbebfae720e04c6439e49f79bf9b000200000000000000000000-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"}]},{"id":"0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008","tokens":[{"id":"0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008-0x120ef59b80774f02211563834d8e3b72cb1649d6","balance":"5.519882301934390094"},{"id":"0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008-0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4","balance":"15.881457045241895678"}]},{"id":"0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002","tokens":[{"id":"0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x120ef59b80774f02211563834d8e3b72cb1649d6","balance":"0"},{"id":"0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"},{"id":"0x6f5f794a3cef904b8517c4c311de2fa837ff24a0000000000000000000000002-0x6f5f794a3cef904b8517c4c311de2fa837ff24a0","balance":"0"}]},{"id":"0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001","tokens":[{"id":"0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001-0x120ef59b80774f02211563834d8e3b72cb1649d6","balance":"0"},{"id":"0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"}]},{"id":"0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009","tokens":[{"id":"0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0.009071580559576606"},{"id":"0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009-0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4","balance":"19.658457268622512151"}]},{"id":"0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003","tokens":[{"id":"0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0x0c6052254551eae3ecac77b01dfcf1025418828f","balance":"0"},{"id":"0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"},{"id":"0xac4b72c01072a52b73ca71105504f1372efcce0d000000000000000000000003-0xac4b72c01072a52b73ca71105504f1372efcce0d","balance":"5192296858534827.628530496329220095"}]},{"id":"0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004","tokens":[{"id":"0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0x4638ab64022927c9bd5947607459d13f57f1551c","balance":"0"},{"id":"0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9","balance":"0"},{"id":"0xbfd65c6160cfd638a85c645e6e6d8acac5dac935000000000000000000000004-0xbfd65c6160cfd638a85c645e6e6d8acac5dac935","balance":"5192296858534827.628530496329220095"}]}]}}}}

// return <pre>{JSON.stringify(data.body.data.pools, null, 2)}</pre>;

// const erc20Abi = fetch(
//   "https://raw.githubusercontent.com/solace-fi/solace-client/ce6c116925365b6924b8449145161eb517550a86/src/constants/abi/IERC20MetadataAlt.json"
// );

// const getTokenName = (tokenAddress) => {
//   const contract = new ethers.Contract(tokenAddress, abi, provider);
//   return contract.name();
// };

// console.log({
//   "TOKEN NAME": getTokenName("0x2791bca1f2de4661ed88a30c99a7a9449aa84174"),
// });

return (
  <table className="table table-dark table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Tokens</th>
      </tr>
    </thead>
    <tbody>
      {data.body.data.pools.map((pool) => (
        <tr key={pool.id}>
          <td>{pool.id}</td>
          <td>
            {/* {pool.tokens.map((token) => (
              <div key={token.id}>
                {token.id}: {token.balance}
              </div>
            ))} */}
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {pool.tokens.map((token) => (
                  <tr key={token.id}>
                    <td>{token.id}</td>
                    <td>{token.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
