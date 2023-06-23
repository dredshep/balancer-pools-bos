State.init([]);
function zSetState(key, value) {
  State.update({ [key]: value });
}
function zUseState(initialValue) {
  const len = state.length;
  State.update({ [len]: initialValue });
  const getState = () => state[len];
  const setState = (value) => zSetState(len, value);
  return [getState, setState];
  // return [state[len - 1], (value) => metState(len - 1, value)];
}

function A() {
  const [getCount, setCount] = zUseState(0);

  const handleAdd = () => {
    setCount(getCount() + 1);
  };

  const handleMinus = () => {
    setCount(getCount() - 1);
  };

  return (
    <div>
      <button onClick={handleAdd}>+</button>
      <span>counts: {getCount()}</span>
      <button onClick={handleMinus}>-</button>
    </div>
  );
}

return <A />;
