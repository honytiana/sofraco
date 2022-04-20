import axios from 'axios';
require('dotenv').config();

class CourtierService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCourtier(data, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier`, data, {
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

    getCourtiers(token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier`, {
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

    getCourtier(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${id}`, {
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

    getGlobalCourtierMandataireCodeLike(name, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/search/${name}`, {
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

    getCourtiersByRole(role, token, limit=0, skip=0) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/role/${role}?limit=${limit}&skip=${skip}`, {
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

    getMandatairesOfCourtier(courtier, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/mandataires/${courtier}`, {
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

    getCourtierOfMandataire(mandataire, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/courtier/${mandataire}`, {
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

    updateCourtier(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${id}`, data, {
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

    updateAllCourtier(token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier`, {
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

    updateCourtierSetCabinets(token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/add/cabinet`, {
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

    addEmailCopieCourtier(courtier, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/courtier/${courtier}/emailCopie`, data, {
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

    editEmailCopieCourtier(courtier, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/courtier/${courtier}/emailCopie/edit`, data, {
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

    deleteEmailCopieCourtier(courtier, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/courtier/${courtier}/emailCopie/delete`, data, {
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

    deleteCourtier(id, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${id}`, {
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

    deleteAllCourtiers(token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier`, {
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

export default CourtierService;