const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");

const { memory, config, num_threads, rank } = workerData.data;

console.log(`number_of_workers = ${num_threads}, rank = ${rank}`);
const bytes = fs.readFileSync("mandelbrot.wasm");
let offset = 0;

WebAssembly.instantiate(bytes, {
  env: {
    memory,
  },
}).then((Module) => {
  Module.instance.exports.mandelbrot_thread(
    config.iterations,
    num_threads,
    rank,
    config.x,
    config.y,
    config.d
  );

  parentPort.postMessage(Module.instance.exports.getImage());
});
