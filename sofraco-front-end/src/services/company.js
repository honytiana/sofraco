import axios from 'axios';
require('dotenv').config();

class CompanyService {
    constructor() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.interne = window.location.hostname.match(regInterne) ? true : false
    }

    createCompany(data, token) {
        return new Promise((resolve, reject) => {
            axios.post(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company`, data, {
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

    getCompanies(token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company`, {
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

    getCompany(id, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/${id}`, {
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

    getCompanyByName(name, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/name/${name}`, {
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

    getCompaniesLike(name, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/search/${name}`, {
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

    getCompanyByCompanySurco(companySurco, token) {
        return new Promise((resolve, reject) => {
            axios.get(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/companySurco/${companySurco}`, {
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

    updateCompany(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/${id}`, data, {
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
    
    deleteCompany(id, token) {
        return new Promise((resolve, reject) => {
            axios.delete(`${(this.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/company/${id}`, {
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

export default CompanyService;