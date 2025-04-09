// worker.js
self.onmessage = function (event) {
  const { data } = event;
  console.log("worker", data);
  postMessage("1");
};
