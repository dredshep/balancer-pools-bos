import { BigNumber, ethers } from "ethers";

const ONE = ethers.BigNumber.from(10).pow(18);
const ZERO = ethers.BigNumber.from(0);

interface JoinPoolArgs {
  poolId: string;
  sender: string;
  recipient: string;
  sortedTokenAddresses: string[];
  maxAmountsIn: BigNumber[];
  userData: string;
  fromInternalBalance: boolean;
}

ethers.constants.MaxUint256;
ethers.utils.formatBytes32String;

function joinPool(props: JoinPoolArgs) {
  const vault = new ethers.Contract(
    sepoliaVaultAddress,
    vaultAbi,
    Ethers.provider().getSigner()
  );
  // vault takes 4 args: poolId, sender, recipient, JoinPoolRequest
  // joinPoolRequest is an array with 4 args: assets, maxAmountsIn, userData, fromInternalBalance
  // userData is a bytes array with 2 args: init, exactTokensIn
  const txPromise = vault.joinPool(
    props.poolId,
    props.sender,
    props.recipient,
    [
      props.sortedTokenAddresses,
      props.maxAmountsIn,
      props.userData,
      props.fromInternalBalance,
    ],
    { gasLimit: 6000000 }
  );
  if (!txPromise.then)
    return console.log("joinPool() txPromise.then is undefined");

  txPromise
    .then((tx: ethers.providers.TransactionResponse) => {
      console.log("joinPool() transaction emitted TX.then: tx:", tx);
      tx.wait()
        .then((receipt) => {
          console.log(
            "joinPool() transaction mined TX.wait.then: receipt:",
            receipt
          );
        })
        .catch((e) => {
          console.log("joinPool() transaction mined TX.wait.catch: e:", e);
        });
    })
    .catch((e: any) => {
      console.log("joinPool() inner error on TX.catch: e:", e);
    });
}

/**
 * Encodes a value array into bytes according to the provided types using the defaultAbiCoder of ethers.
 * @param {string[]} types - An array of strings representing the types of the values to encode.
 * @param {any[]} values - An array of values to encode.
 * @returns {string} - The encoded values as a hexadecimal string.
 */
const encode = (types: string[], values: any[]): string =>
  ethers.utils.defaultAbiCoder.encode(types, values);

function processArgs(
  /** @type {JoinPoolArgs} */ args: JoinPoolArgs,
  decimals: number
) {
  const unsortedTokenAddresses = args.sortedTokenAddresses;
  const sortedTokenAddresses = args.sortedTokenAddresses.sort();
  const matchingSortAmounts = unsortedTokenAddresses.map((tokenAddress) => {
    const index = sortedTokenAddresses.indexOf(tokenAddress);
    return args.maxAmountsIn[index];
  });
  const userData = encode(
    ["uint256", "uint256[]"],
    [ZERO, matchingSortAmounts]
  );
  return {
    ...args,
    sortedTokenAddresses,
    matchingSortAmounts,
    userData,
  };
}

enum AcceptedJoinTypes {
  "INIT",
  "EXACT_TOKENS_IN",
}

const makeUserData = (type: AcceptedJoinTypes, amounts: BigNumber[]) => {
  switch (type) {
    case AcceptedJoinTypes.INIT:
      return encode(["uint256", "uint256[]"], [ZERO, amounts]);
    case AcceptedJoinTypes.EXACT_TOKENS_IN:
      return encode(["uint256", "uint256[]", "uint256"], [ONE, amounts, ZERO]);
    default:
      throw new Error("Invalid join type");
  }
};

const amounts = [ONE, ONE];
/** @type {JoinPoolArgs} */
const args: JoinPoolArgs = {
  poolId: "0x1002b479766d0f7977ab06473e03f0cd5ee3c54b000200000000000000000014",
  sender: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  recipient: "0x83ABeaFE7bA5bE9b173149603e13550DCC2ffE57",
  sortedTokenAddresses: [
    "0x88267177EC1420648Ba7CBFef824f14B9F637985",
    "0x6A1Ab80d1B161844948CC75C965C0D0242dbc630",
  ].sort(),
  maxAmountsIn: amounts,
  userData: makeUserData(AcceptedJoinTypes.INIT, amounts),
  // fromInternalBalance means that the tokens are already in the vault, which they are not
  fromInternalBalance: false,
};

joinPool(processArgs(args, 18));

// const joinPromise = joinPool(args);

// // @ts-ignore
// return <pre>{JSON.stringify(args, null, 2)}</pre>;
