import axios from 'axios';
import config from '../config.json';

class CabinetService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCabinet(data, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, data, {
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
        axios.get(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet/${id}`, {
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
            axios.get(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, {
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

    getCabinetByName (cabinet, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet/cabinet/${cabinet}`, {
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
        axios.put(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .catch((err) => {
                console.log(err)
            });
    }

    deleteCabinet(id, token) {
        axios.delete(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .catch((err) => {
                console.log(err)
            });
    }

    deleteAllCabinets(token) {
        axios.delete(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .catch((err) => {
                console.log(err)
            });
    }

}

export default CabinetService;