declare const State: {
  init(obj: State): void;
  update(obj: Partial<State>): void;
};

declare const Web3Connect: any;
declare const Ethers: any;
declare const ethers: any;
declare const DropdownMenu: any;
declare const RadioGroup: any;
declare const styled: any;
declare const Popover: any;
declare const Dialog: any;

declare const state: State;
declare const Widget: any;

interface ChainInfo {
  name: string;
  chainId: string;
  shortName: string;
  chain: string;
  network: string;
  networkId: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  faucets: string[];
  explorers: string[];
  vaultAddress: string;
  balancerQueriesAddress: string;
  balancerSubgraphUrl: string;
}

interface ChainInfoObject {
  [key: string]: ChainInfo;
}

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
