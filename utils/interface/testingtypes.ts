export interface Forms {
  forms: { [key: string]: Form };
}

export interface Form {
  allOrOne: string;
  allForm: AllForm;
  oneForms: { [key: string]: OneForm };
  tokenSelectorIsOpen: boolean;
  tokenAddresses: string[];
}

export interface AllForm {
  totalAmount: string;
}

export interface OneForm {
  inputAmount: string;
  symbol: string;
  isSelected: boolean;
  address: string;
}

const sampleForms: Forms = {
  forms: {
    "0": {
      allOrOne: "all",
      allForm: {
        totalAmount: "0",
      },
      oneForms: {
        "0": {
          inputAmount: "0",
          symbol: "ETH",
          isSelected: true,
          address: "0x000",
        },
      },
      tokenSelectorIsOpen: false,
      tokenAddresses: ["0x000"],
    },
  },
};

sampleForms.forms["0"].tokenAddresses.push("0x001");
// get the input amount of a token, get only the selected token by looking for it in the oneForms object
const inputAmount = sampleForms.forms["0"].oneForms["0"].inputAmount;
