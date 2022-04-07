import axios from 'axios';
import config from '../config.json';

class CabinetService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCabinet(token, data) {
        axios.post(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => {
            console.log(err);
        }).finally(() => {

        });

    }

    getCabinet(id, token) {
        axios.get(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet/${id}`, {
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

    getCabinets(token) {
        axios.get(`${(this.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, {
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