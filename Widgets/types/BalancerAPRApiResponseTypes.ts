//source: https://app.quicktype.io/?l=ts

interface APRApiResponse {
  feesSnapshot:          string;
  c:                     null;
  apr:                   Apr;
  holdersCount:          string;
  isNew:                 boolean;
  root3Alpha:            null;
  protocolYieldFeeCache: null | string;
  epsilon:               null;
  s:                     null;
  maxApr:                string;
  u:                     null;
  v:                     null;
  sqrtAlpha:             null;
  w:                     null;
  priceRateProviders:    PriceRateProvider[];
  z:                     null;
  totalShares:           string;
  tauBetaX:              null;
  mainIndex:             number | null;
  tauBetaY:              null;
  factory:               Factory;
  symbol:                string;
  wrappedIndex:          number | null;
  sqrtBeta:              null;
  address:               string;
  createTime:            number;
  isInRecoveryMode:      boolean | null;
  tokenAddresses:        string[];
  swapsCount:            string;
  totalSwapFee:          string;
  delta:                 null;
  lambda:                null;
  swapFee:               string;
  upperTarget:           null | string;
  dSq:                   null;
  alpha:                 null;
  lowerTarget:           null | string;
  swapEnabled:           boolean;
  volumeSnapshot:        string;
  tauAlphaX:             null;
  tauAlphaY:             null;
  strategyType:          number;
  beta:                  null;
  name:                  string;
  poolTypeVersion:       number;
  owner:                 Owner | null;
  id:                    string;
  protocolSwapFeeCache:  null | string;
  totalSwapVolume:       string;
  tokensList:            string[];
  isPaused:              boolean;
  poolType:              PoolType;
  lastUpdate:            number;
  totalWeight:           string;
  chainId:               number;
  totalLiquidity:        string;
  graphData:             GraphData;
  tokens:                ResultToken[];
  amp?:                  string;
}

interface Apr {
  protocolApr: number;
  min:         number;
  max:         number;
  rewardAprs:  Aprs;
  stakingApr:  StakingApr;
  swapFees:    number;
  tokenAprs:   Aprs;
}

interface Aprs {
  total:     number;
  breakdown: { [key: string]: number };
}

interface StakingApr {
  max: number;
  min: number;
}

enum Factory {
  The0X03F3Fb107E74F2Eac9358862E91Ad3C692712054 = "0x03f3fb107e74f2eac9358862e91ad3c692712054",
  The0X6B1Da720Be2D11D95177Ccfc40A917C2688F396C = "0x6b1da720be2d11d95177ccfc40a917c2688f396c",
  The0X8Ea89804145C007E7D226001A96955Ad53836087 = "0x8ea89804145c007e7d226001a96955ad53836087",
}

interface GraphData {
  totalLiquidity: string;
}

enum Owner {
  The0Xba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1Ba1B = "0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b",
  The0Xc41A3Cf9Fd19896Adaf64Fca71E905E8802Ebdb1 = "0xc41a3cf9fd19896adaf64fca71e905e8802ebdb1",
}

enum PoolType {
  ComposableStable = "ComposableStable",
  ERC4626Linear = "ERC4626Linear",
  Weighted = "Weighted",
}

interface PriceRateProvider {
  address: string;
  token:   PriceRateProviderToken;
}

interface PriceRateProviderToken {
  address: string;
}

interface ResultToken {
  symbol:                       string;
  address:                      string;
  priceRate:                    string;
  balance:                      string;
  isExemptFromYieldProtocolFee: boolean | null;
  decimals:                     number;
  name:                         string;
  weight:                       null | string;
  id:                           string;
  managedBalance:               string;
  token:                        PurpleToken;
}

interface PurpleToken {
  pool:           PurplePool | null;
  latestUSDPrice: null | string;
  latestFXPrice?: null;
}

interface IndigoToken {
  pool:           PurplePool | null;
  latestUSDPrice: string;
}

interface StickyToken {
  symbol:                        string;
  address:                       string;
  priceRate:                     string;
  balance:                       string;
  isExemptFromYieldProtocolFee?: boolean | null;
  decimals:                      number;
  weight:                        null;
  token:                         IndigoToken;
}

interface FluffyPool {
  mainIndex:   number | null;
  tokens:      StickyToken[];
  id:          string;
  address:     Address;
  poolType:    PoolType;
  totalShares: string;
}

interface TentacledToken {
  pool:           FluffyPool | null;
  latestUSDPrice: string;
}

interface FluffyToken {
  symbol:                        string;
  address:                       string;
  priceRate:                     string;
  balance:                       string;
  isExemptFromYieldProtocolFee?: boolean | null;
  decimals:                      number;
  weight:                        null;
  token:                         TentacledToken;
}

interface PurplePool {
  mainIndex:   number | null;
  tokens?:     FluffyToken[];
  id:          string;
  address:     Address;
  poolType:    PoolType;
  totalShares: string;
}

enum Address {
  The0X16C9A4D841E88E52B51936106010F27085A529Ec = "0x16c9a4d841e88e52b51936106010f27085a529ec",
  The0X1D0A8A31Cdb04Efac3153237526Fb15Cc65A2520 = "0x1d0a8a31cdb04efac3153237526fb15cc65a2520",
  The0X4B718E0E2Fea1Da68B763Cd50C446Fba03Ceb2Ea = "0x4b718e0e2fea1da68b763cd50c446fba03ceb2ea",
  The0Xdf725Fde6E89981Fb30D9Bf999841Ac2C160B512 = "0xdf725fde6e89981fb30d9bf999841ac2c160b512",
  The0Xe1F2C039A68A216De6Dd427Be6C60Decf405762A = "0xe1f2c039a68a216de6dd427be6c60decf405762a",
  The0Xe274C9Deb6Ed34Cfe4130F8D0A8A948Dea5Bb286 = "0xe274c9deb6ed34cfe4130f8d0a8a948dea5bb286",
}