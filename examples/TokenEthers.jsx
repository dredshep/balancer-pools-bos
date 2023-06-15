State.init({
  provider: "unfetched",
});

const genericERC20ABIUrl =
  "https://raw.githubusercontent.com/dredshep/dev/main/abi.json";
try {
  const genericERC20ABI = fetch(genericERC20ABIUrl);
  const genericERC20Contract = new ethers.Contract(
    "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
    genericERC20ABI.body,
    Ethers.provider()
  );
  genericERC20Contract.symbol().then((a) => console.log("symbol", a));
  genericERC20Contract.name().then((a) => console.log("name", a));
  genericERC20Contract
    .balanceOf("0x8ef643871b7cf59c8f5913e253bf3a9f346883a6")
    .then((bigBalance) => {
      genericERC20Contract
        .decimals()
        .then((decimals) =>
          console.log(
            "balance processed",
            ethers.utils.formatUnits(bigBalance, decimals)
          )
        );
    });
} catch (e) {
  console.log("GENERIC ERRRORR", e);
}

// try {
//   // const tokenAddress = "0x120ef59b80774f02211563834d8e3b72cb1649d6";
//   const tetherAddress = "0x1e4a5963abfd975d8c9021ce480b42188849d41d";
//   const contract = new ethers.Contract(
//     tetherAddress,
//     tetherABI,
//     Ethers.provider()
//   );
//   const tetherDecimals = contract.decimals();
//   contract.symbol().then((a) => console.log("symbol", a));
//   contract.name().then((a) => console.log("name", a));
//   contract
//     .balanceOf("0x8ef643871b7cf59c8f5913e253bf3a9f346883a6")
//     .then((bigBalance) => {
//       tetherDecimals.then((decimals) =>
//         console.log(
//           "balance processed",
//           ethers.utils.formatUnits(bigBalance, decimals)
//         )
//       );
//     });
// } catch (e) {
//   console.log("ERRRORR", e);
// }

return <></>;
