import axios from 'axios';
require('dotenv').config();

class CabinetService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCabinet(data, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet`, data, {
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

    getCabinet(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/${id}`, {
                headers: {
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

    getCabinets(token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet`, {
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

    getCabinetByName(cabinet, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/cabinet/${cabinet}`, {
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

    updateCabinet(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/${id}`, data, {
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

    addCabinetName(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/cabinet/${id}/name`, data, {
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

    editCabinetName(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/cabinet/${id}/name/edit`, data, {
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

    deleteCabinetName(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/cabinet/${id}/name/delete`, data, {
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

    deleteCabinet(id, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet/${id}`, {
                headers: {
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

    deleteAllCabinets(token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet`, {
                headers: {
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

export default CabinetService;