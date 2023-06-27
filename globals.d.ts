declare const State: {
  init(obj: object): void;
  update(obj: object): void;
};

declare const Web3Connect: any;
declare const Ethers: any;
declare const ethers: any;
declare const state: any;
declare const DropdownMenu: any;
declare const RadioGroup: any;
declare const styled: any;
declare const Popover: any;

declare module "Widget" {
  import { ReactNode } from "react";

  interface WidgetProps {
    src: string;
    props: {
      userAddress: string;
      poolAddress: string;
      onError: (errorHandler: () => void) => void;
      onSuccess: (successHandler: () => void) => void;
      requestConnect: () => void;
      decimals: number;
    };
  }

  export default function Widget(props: WidgetProps): ReactNode;
}

// declare const RadioItem: any;
// declare const ButtonGroup: any;

// interface SBalancer {
//   id: string;
//   poolCount: number;
//   totalLiquidity: string;
// }

// interface SToken {
//   name: string;
//   symbol: string;
//   address: string;
//   decimals: number;
//   totalBalanceUSD: string;
//   totalBalanceNotional: string;
//   totalVolumeUSD: string;
//   totalVolumeNotional: string;
//   latestUSDPrice: string | null;
//   latestPrice: SLatestPrice | null;
// }

// interface SLatestPrice {
//   pricingAsset: string;
//   price: string;
//   poolId: SPoolId;
// }

// interface SPoolId {
//   totalWeight: string;
// }

// interface SPool {
//   id: string;
//   address: string;
//   tokensList: string[];
//   totalWeight: string;
//   totalShares: string;
//   holdersCount: string;
//   poolType: string;
//   poolTypeVersion: number;
//   tokens: { token: SToken }[];
// }

// interface SBalancerGQLResponse {
//   balancers: SBalancer[];
//   pools: SPool[];
// }

// interface TokenWeights {
//   address: string;
//   weight: string;
// }

// interface TransformedPool {
//   totalValueLocked: string;
//   tokenWeights: TokenWeights[];
//   id: string;
//   address: string;
//   tokensList: string[];
//   totalWeight: string;
//   totalShares: string;
//   holdersCount: string;
//   poolType: string;
//   poolTypeVersion: number;
//   tokens: SToken[];
// }

// interface TransformedData {
//   balancers: SBalancer[];
//   pools: TransformedPool[];
// }

// interface StatePool {
//   id: string;
//   approved: boolean;
//   depositing: boolean;
//   withdrawing: boolean;
//   approving: boolean;
//   loading: boolean;
// }

// interface ChainInfo {
//   name: string;
//   chainId: string;
//   shortName: string;
//   chain: string;
//   network: string;
//   networkId: string;
//   nativeCurrency: {
//     name: string;
//     symbol: string;
//     decimals: number;
//   };
//   rpc: string[];
//   faucets: string[];
//   explorers: {
//     name: string;
//     url: string;
//     standard: string;
//   }[];
// }

// interface ChainInfoObject {
//   [chainId: string]: ChainInfo;
// }

// declare generic react component <Web3Connect />
