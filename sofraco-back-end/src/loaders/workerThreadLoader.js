const { Worker, isMainThread } = require('worker_threads');
const path = require('path');

const apicilService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentAPICIL.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const apiviaService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentAPIVIA.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const aprepService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentAPREP.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const avivaService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentAVIVA.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const cardifService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentCARDIF.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const cegemaService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentCEGEMA.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const eresService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentERES.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const generaliService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentGENERALI.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const hodevaService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentHODEVA.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const lourmelService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentLOURMEL.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const metlifeService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentMETLIFE.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const mieService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentMIE.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const mielService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentMIEL.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const miltisService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentMILTIS.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const mmaService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentMMA.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const pavillonService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentPAVILLON.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const smatisService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentSMATIS.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const spvieService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentSPVIE.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const swisslifeService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentSWISSLIFE.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};

const uafLifeService = (WorkerData) => {
    return new Promise((resolve, reject) => {
    
        if (isMainThread) {
            const worker = new Worker(path.join(__dirname, '..', 'services', 'document', 'documentUAFLIFE.js'), { workerData: WorkerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            });
        }

    })
};


module.exports = async function () {
    try {
        const resultAPICIL = await apicilService('APICIL Worker thread');
        console.log(resultAPICIL);
    } catch (err) {
        console.log(`Error APICIL Worker : \n ${err}`);
    }
    try {
        const resultAPIVIA = await apiviaService('APIVIA Worker thread');
        console.log(resultAPIVIA);
    } catch (err) {
        console.log(`Error APIVIA Worker : \n ${err}`);
    }
    try {
        const resultAPREP = await aprepService('APICIL Worker thread');
        console.log(resultAPREP);
    } catch (err) {
        console.log(`Error APREP Worker : \n ${err}`);
    }
    try {
        const resultAVIVA = await avivaService('AVIVA Worker thread');
        console.log(resultAVIVA);
    } catch (err) {
        console.log(`Error AVIVA Worker : \n ${err}`);
    }
    try {
        const resultCARDIF = await cardifService('CARDIF Worker thread');
        console.log(resultCARDIF);
    } catch (err) {
        console.log(`Error CARDIF Worker : \n ${err}`);
    }
    try {
        const resultCEGEMA = await cegemaService('CEGEMA Worker thread');
        console.log(resultCEGEMA);
    } catch (err) {
        console.log(`Error CEGEMA Worker : \n ${err}`);
    }
    try {
        const resultERES = await eresService('ERES Worker thread');
        console.log(resultERES);
    } catch (err) {
        console.log(`Error ERES Worker : \n ${err}`);
    }
    try {
        const resultGENERALI = await generaliService('GENERALI Worker thread');
        console.log(resultGENERALI);
    } catch (err) {
        console.log(`Error GENERALI Worker : \n ${err}`);
    }
    try {
        const resultHODEVA = await hodevaService('HODEVA Worker thread');
        console.log(resultHODEVA);
    } catch (err) {
        console.log(`Error HODEVA Worker : \n ${err}`);
    }
    try {
        const resultLOURMEL = await lourmelService('LOURMEL Worker thread');
        console.log(resultLOURMEL);
    } catch (err) {
        console.log(`Error LOURMEL Worker : \n ${err}`);
    }
    try {
        const resultMETLIFE = await metlifeService('METLIFE Worker thread');
        console.log(resultMETLIFE);
    } catch (err) {
        console.log(`Error METLIFE Worker : \n ${err}`);
    }
    try {
        const resultMIE = await mieService('MIE Worker thread');
        console.log(resultMIE);
    } catch (err) {
        console.log(`Error MIE Worker : \n ${err}`);
    }
    try {
        const resultMIEL = await mielService('MIEL Worker thread');
        console.log(resultMIEL);
    } catch (err) {
        console.log(`Error MIEL Worker : \n ${err}`);
    }
    try {
        const resultMILTIS = await miltisService('MILTIS Worker thread');
        console.log(resultMILTIS);
    } catch (err) {
        console.log(`Error MILTIS Worker : \n ${err}`);
    }
    try {
        const resultMMA = await mmaService('MMA Worker thread');
        console.log(resultMMA);
    } catch (err) {
        console.log(`Error MMA Worker : \n ${err}`);
    }
    try {
        const resultPAVILLON = await pavillonService('PAVILLON Worker thread');
        console.log(resultPAVILLON);
    } catch (err) {
        console.log(`Error PAVILLON Worker : \n ${err}`);
    }
    try {
        const resultSMATIS = await smatisService('SMATIS Worker thread');
        console.log(resultSMATIS);
    } catch (err) {
        console.log(`Error SMATIS Worker : \n ${err}`);
    }
    try {
        const resultSPVIE = await spvieService('SPVIE Worker thread');
        console.log(resultSPVIE);
    } catch (err) {
        console.log(`Error SPVIE Worker : \n ${err}`);
    }
    try {
        const resultSWISSLIFE = await swisslifeService('SWISSLIFE Worker thread');
        console.log(resultSWISSLIFE);
    } catch (err) {
        console.log(`Error SWISS LIFE Worker : \n ${err}`);
    }
    try {
        const resultUAFLIFE = await uafLifeService('UAFLIFE Worker thread');
        console.log(resultUAFLIFE);
    } catch (err) {
        console.log(`Error UAFLIFE Worker : \n ${err}`);
    }
};
