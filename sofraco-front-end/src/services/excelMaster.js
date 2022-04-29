import axios from 'axios';
require('dotenv').config();

class ExcelMasterService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createExcelMaster(data, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            }).finally(() => {

            });
        });
    }

    getExcelMaster(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            }).finally(() => {

            });
        });
    }

    getExcelMasters(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            }).finally(() => {

            });
        });
    }

    getExcelMastersByCourtier(courtier, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/courtier/${courtier}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getExcelMastersZip(token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/zip/excels`, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getExcelMasterXlsx(excel, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/xlsx/${excel}`, {
                headers: {
                    'Application': 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getExcelMastersByYearMonth(year, month, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/year/${year}/month/${month}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getExcelMastersCourtierByYearMonth(courtier, year, month, type, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/courtier/${courtier}/year/${year}/month/${month}/type/${type}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getExcelMastersByYearMonthV2(courtier, type, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/courtier/${courtier}/year/month/type/${type}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    updateExcelMaster(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    deleteExcelMaster(id, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    deleteAllExcelMaster(token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/excelMaster`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

}

export default ExcelMasterService;