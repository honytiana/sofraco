const express = require('express');
const cluster = require('cluster');
const os = require('os');
const process = require('process');
const load = require('./src/loaders/loader');
const config = require('./config.json');
const workerThreadLoader = require('./src/loaders/workerThreadLoader');
const { GPU } = require('gpu.js');

const startServer = async () => {
    const numCPUs = os.cpus().length;
    // await workerThreadLoader();

    if (cluster.isPrimary || cluster.isMaster) {
        console.log(`Primary ${process.pid} is running`);

        // Fork workers.
        // for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        // }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server

        const app = express();
        await load({ app: app });

        const port = config.nodePort;
        if (require.main === module) {
            app.listen(port, () => {
                console.info(`Server is listen on port : ${port}`);
                console.log(`Worker ${process.pid} started`);
            });
        }
    }
}

// const gpu = new GPU({ mode: 'dev' });
// const multiplyMatrix = gpu.createKernel(function (a, b) {
//     let sum = 0;
//     for (let i = 0; i < 512; i++) {
//         sum += a[this.thread.y][i] * b[i][this.thread.x];
//     }
//     return sum;
// }).setOutput([512, 512]);

// const kernel = gpu.createKernel(function (x) {
//     return x;
// }).setOutput([100]);

// const add = gpu.createKernel(function (a, b) {
//     return a[this.thread.x] + b[this.thread.x];
// }).setOutput([20]);

// const multiply = gpu.createKernel(function (a, b) {
//     return a[this.thread.x] * b[this.thread.x];
// }).setOutput([20]);

// const superKernel = gpu.combineKernels(add, multiply, function (a, b, c) {
//     return multiply(add(a, b), c);
// });

// console.log('superkernel : ' + superKernel(5, 6, 2));
// console.log('superkernel 22');

// kernel([1, 2, 3]);

// const c = multiplyMatrix(512, 512);

// const megaKernel = gpu.createKernelMap({
//     addResult: function add(a, b) {
//         return a + b;
//     },
//     multiplyResult: function multiply(a, b) {
//         return a * b;
//     },
// }, function (a, b, c) {
//     return multiply(add(a[this.thread.x], b[this.thread.x]), c[this.thread.x]);
// }, { output: [10] });

// megaKernel(2, 4, 6);

startServer();

