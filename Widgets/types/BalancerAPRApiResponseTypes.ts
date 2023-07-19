// API Response Types

interface APRApiResponse {
  feesSnapshot:          string;
  c:                     null;
  apr:                   APR;
  holdersCount:          string;
  isNew:                 boolean;
  root3Alpha:            null;
  protocolYieldFeeCache: string;
  epsilon:               null;
  s:                     null;
  maxApr:                string;
  u:                     null;
  v:                     null;
  sqrtAlpha:             null;
  w:                     null;
  priceRateProviders:    any[];
  z:                     null;
  totalShares:           string;
  tauBetaX:              null;
  mainIndex:             null;
  tauBetaY:              null;
  factory:               string;
  symbol:                string;
  wrappedIndex:          null;
  sqrtBeta:              null;
  address:               string;
  createTime:            number;
  isInRecoveryMode:      null;
  tokenAddresses:        string[];
  swapsCount:            string;
  totalSwapFee:          string;
  delta:                 null;
  lambda:                null;
  swapFee:               string;
  upperTarget:           null;
  dSq:                   null;
  alpha:                 null;
  lowerTarget:           null;
  swapEnabled:           boolean;
  volumeSnapshot:        string;
  tauAlphaX:             null;
  tauAlphaY:             null;
  strategyType:          number;
  beta:                  null;
  name:                  string;
  poolTypeVersion:       number;
  owner:                 string;
  id:                    string;
  protocolSwapFeeCache:  string;
  totalSwapVolume:       string;
  tokensList:            string[];
  isPaused:              boolean;
  poolType:              string;
  lastUpdate:            number;
  totalWeight:           string;
  chainId:               number;
  totalLiquidity:        string;
  graphData:             GraphData;
  tokens:                TokenElement[];
}

interface APR {
  protocolApr: number;
  min:         number;
  max:         number;
  rewardAprs:  Aprs;
  stakingApr:  StakingAPR;
  swapFees:    number;
  tokenAprs:   Aprs;
}

interface Aprs {
  total:     number;
  breakdown: Breakdown;
}

interface Breakdown {
}

interface StakingAPR {
  max: number;
  min: number;
}

interface GraphData {
  totalLiquidity: string;
}

interface TokenElement {
  symbol:                       string;
  address:                      string;
  priceRate:                    string;
  balance:                      string;
  isExemptFromYieldProtocolFee: boolean;
  decimals:                     number;
  name:                         string;
  weight:                       string;
  id:                           string;
  managedBalance:               string;
  token:                        TokenToken;
}

interface TokenToken {
  pool:           null;
  latestUSDPrice: null | string;
  latestFXPrice:  null;
}