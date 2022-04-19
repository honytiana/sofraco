import axios from 'axios';
require('dotenv').config();

class CorrespondanceService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCorrespondance(role, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/${role}`, {
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

    getCorrespondances(token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance`, {
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

    getCorrespondance(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/${id}`, {
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

    getCorrespondanceByCourtier(courtier, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/courtier/${courtier}`, {
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

    updateCorrespondance(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/${id}`, data, {
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

    addCodeCourtier(courtier, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/code/courtier/${courtier}`, data, {
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

    editCodeCourtier(courtier, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/code/courtier/edit/${courtier}`, data, {
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

    deleteAllCorrespondances(token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance`, {
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

    deleteCodeCourtier(courtier, code, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/code/courtier/${courtier}/code/${code}`, {
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

    deleteCorrespondance(id, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/correspondance/${id}`, {
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

export default CorrespondanceService;