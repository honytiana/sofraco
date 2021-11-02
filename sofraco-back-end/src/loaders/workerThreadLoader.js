const { Worker } = require('worker_threads');
const path = require('path');

const apicilService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentAPICIL.js'), { WorkerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`stopped with  ${code} exit code`));
        });

    })
}


module.exports = async function () {
    try {
        const result = await apicilService('hello John Doe');
        console.log(result);
    } catch (err) {
        console.log(`Error APICIL Worker : \n ${err}`);
    }
};
