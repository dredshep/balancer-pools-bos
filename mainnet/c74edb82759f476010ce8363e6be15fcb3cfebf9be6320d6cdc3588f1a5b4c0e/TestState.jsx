State.init({
  data: null,
  bird: "miaow",
});

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepCallback = (ms, callback) => setTimeout(callback, ms);

const loading = () => {
  return <div className="d-flex justify-content-center">loading</div>;
};

const loadData = () => {
  // return sleep(1000).then(() => {
  //   State.update({ data: "Hello World!" });
  // });
  // return sleepCallback(1000, () => {
  //   State.update({ data: "Hello World!" });
  // });
  State.update({ data: "Hello World!" });
};

const { data } = State;

if (!data) {
  loadData();
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>state: {JSON.stringify(Object.entries(State || {}), null, 2)}</div>
    </div>
  );
}

return (
  <div>
    data:
    {data}
  </div>
);
