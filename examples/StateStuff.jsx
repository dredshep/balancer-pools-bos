State.init({ greeting: "Have a great day", tokenName: "still unfetched" });

const onChange = ({ target }) => {
  State.update({ greeting: target.value });
};

// set a waiter to wait 3000 ms and then change the greeting to "Waited"

const waiter = () => {
  setTimeout(() => {
    State.update({ greeting: "Waited" });
    console.log("waited2");
  }, 3000);
};

const res = fetch(
  "https://raw.githubusercontent.com/solace-fi/solace-client/ce6c116925365b6924b8449145161eb517550a86/src/constants/abi/IERC20MetadataAlt.json"
);
console.log("PROVIDER, SIGNER", {
  provider: typeof Ethers.contract(),
  // signer: Ethers.provider().getSigner(),
});

return <></>;
// const getTokenName = async (tokenAddress) => {
//   const abi = JSON.parse(res.body).abi;
//   // console.log({ abi });
//   try {
//     const contract = new ethers.Contract(tokenAddress, abi, Ethers.provider());
//     console.log({ contract });
//     // const name = await contract.name();
//     // State.update({ tokenName: name });
//     // return name; // Promise<string>
//   } catch (e) {
//     // return e.message;
//     console.log(e);
//   }
// };

// getTokenName(
//   "0x02c9dcb975262719a61f9b40bdf0987ead9add3a000000000000000000000006"
// );
// waiter();

// return (
//   <>
//     <div class="container border border-info p-3 min-vw-100">
//       <p>
//         <b> Greeting: </b> {state.greeting}{" "}
//       </p>
//       <p>
//         <b> Token Name: </b> {state.tokenName}{" "}
//       </p>

//       <label class="text-left">Change the Greeting</label>
//       <input onChange={onChange} />
//     </div>
//   </>
// );
