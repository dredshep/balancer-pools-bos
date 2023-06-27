State.init({
  userAddress: undefined,
  disconnected: true,
  balance: undefined,
  getUserBalance: undefined,
});

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
if (userAddress) State.update({ userAddress, disconnected: false });
if (state.disconnected || !state.userAddress)
  return <Web3Connect connectLabel="Connect with Web3" />;

let getUserBalance;

const props = {
  userAddress: state.userAddress,
  poolAddress: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a9",
  onError: (e) =>
    typeof e === "string" &&
    e.includes("unknown account") &&
    State.update({ disconnected: true, userAddress: undefined }),
  onSuccess: (balance) => console.log("first balance", balance),
  requestConnect: () => console.log("requestConnect:", "requestConnect"),
  decimals: 18,
  // getGetUserBalance: (getUserBalance) => {
  //   // const balance = getUserBalance(
  //   //   "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a9",
  //   //   state.userAddress
  //   // );
  //   State.update({ getUserBalance });
  // },
  getGetUserBalance: (_getUserBalance) => {
    // State.update({ getUserBalance });
    getUserBalance = _getUserBalance;
  },
};

if (getUserBalance) {
  const balance = getUserBalance(
    "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a9",
    state.userAddress
  );
  console.log(balance);
  State.update({ balance });
} else {
  console.log("no getUserBalance");
}
return (
  <>
    <h1>
      Balance: (type:{typeof balance}) - (value:{balance})
    </h1>
    <h1>
      Widget:
      <Widget
        src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/GetGetUserBalanceTest"
        props={props}
      />
    </h1>
  </>
);
