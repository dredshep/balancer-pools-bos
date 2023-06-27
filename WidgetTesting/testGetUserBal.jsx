State.init({
  userAddress: undefined,
  disconnected: true,
  balance: undefined,
});

const userAddress = Ethers.send("eth_requestAccounts", [])[0];
if (userAddress) State.update({ userAddress, disconnected: false });
if (state.disconnected || !state.userAddress)
  return <Web3Connect connectLabel="Connect with Web3" />;

const props = {
  userAddress: state.userAddress,
  poolAddress: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a9",
  onError: (e) =>
    typeof e === "string" &&
    e.includes("unknown account") &&
    State.update({ disconnected: true, userAddress: undefined }),
  onSuccess: (balance) => State.update({ balance }),
  requestConnect: () => console.log("requestConnect:", "requestConnect"),
  decimals: 18,
};

return (
  <>
    <h1>
      Balance: (type:{typeof balance}) - (value:{balance})
    </h1>
    <h1>
      Widget:
      <Widget
        src="c74edb82759f476010ce8363e6be15fcb3cfebf9be6320d6cdc3588f1a5b4c0e/widget/GetUserBalanceTest"
        props={props}
      />
    </h1>
  </>
);
