const WrapperWidget = ({ children, id, storageType }) => {
  // This function handles the state change for the children widgets
  const handleStateChange = (key, value) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    if (storageType === "local") {
      // Update the local storage with the new state
      Storage.set(storageKey, JSON.stringify(value));
    }
  };

  // This function initializes the state of the children widgets
  const initState = (key, defaultValue) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    let storedValue;
    if (storageType === "local") {
      storedValue = Storage.get(storageKey);
    }

    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return defaultValue;
  };

  // Render the children widgets and pass the state management functions as props
  // return React.Children.map(children, (child) =>
  //   React.cloneElement(child, { handleStateChange, initState })
  // );
  console.log(React.cloneElement);

  return children.map((child) => child);
};

// This function handles the state change for the children widgets
const handleStateChange = (key, value) => {
  // Use the unique identifier to create a unique storage key
  const storageKey = `${key}`;

  // if (storageType === "local") {
  // Update the local storage with the new state
  Storage.set(storageKey, JSON.stringify(value));
  // }
};

// This function initializes the state of the children widgets
const initializeState = (key, defaultValue) => {
  // Use the unique identifier to create a unique storage key
  const storageKey = `${key}`;

  let storedValue;
  // if (storageType === "local") {
  storedValue = Storage.get(storageKey);
  // }

  if (storedValue) {
    return JSON.parse(storedValue);
  }
  return defaultValue;
};

State.init({ name: "" });
State.update({ name: initializeState("name", "") });
return (
  <div className="col-lg-12  mb-2">
    Name:
    <input
      type="text"
      value={state.name}
      onChange={(event) => {
        console.log("aaaaaa");
        State.update({ name: event.target.value });
        handleStateChange("name", event.target.value);
      }}
    />
    <br />
    {state.name}
  </div>
);
