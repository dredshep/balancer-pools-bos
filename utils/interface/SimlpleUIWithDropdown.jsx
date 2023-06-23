//@ts-check

State.init({
  bookmarksChecked: true,
  urlsChecked: false,
});

function getGraphQlQuerySync(query) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  // @ts-ignore
  const { body } = fetch(url, options);
  return body.data;
}

/**
 * @name runAllInOneQuery
 * @description Get the pool data from the Balancer subgraph
 * @returns {SBalancerGQLResponse}
 * @example const data = runAllInOneQuery();
 */
function runAllInOneQuery() {
  // @ts-ignore
  const query = `{
    balancers(first: 5) {
      id
      poolCount
      totalLiquidity
    }
    pools(first: 5) {
      id
      address
      tokensList
      totalWeight
      totalShares
      holdersCount
      poolType
      poolTypeVersion
      tokens {
        token {
          name
          symbol
          address
          decimals
          totalBalanceUSD
          totalBalanceNotional
          totalVolumeUSD
          totalVolumeNotional
          latestUSDPrice
          latestPrice {
            pricingAsset
            price
            poolId {
              totalWeight
            }
          }
        }
      }
    }
  }`;
  return getGraphQlQuerySync(query);
}

function setBookmarksChecked(value) {
  State.update({ bookmarksChecked: value });
}

function setUrlsChecked(value) {
  State.update({ urlsChecked: value });
}

function MainExport() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>My Menu</DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={5}>
        <DropdownMenu.CheckboxItem
          checked={state.bookmarksChecked}
          onCheckedChange={setBookmarksChecked}
        >
          <DropdownMenu.ItemIndicator>
            <i className="bi bi-check-circle-fill"></i>
          </DropdownMenu.ItemIndicator>
          Show Bookmarks
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          checked={state.urlsChecked}
          onCheckedChange={setUrlsChecked}
        >
          <DropdownMenu.ItemIndicator>
            <i className="bi bi-check-circle-fill"></i>
          </DropdownMenu.ItemIndicator>
          Show Full URLs
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

// @ts-ignore
return <MainExport />;
