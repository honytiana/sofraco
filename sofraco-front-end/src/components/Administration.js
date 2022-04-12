import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody
} from '@coreui/react';
import axios from 'axios';

import '../styles/Administration.css';

require('dotenv').config();

class Administration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            cabinets: [],
            clients: [],
            fields: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            ajoutAdministration: false,
            courtierToDel: null,
            visibleAlert: false,
            interne: false
        }
        this._isMounted = false;
        this.fetchCourtiers = this.fetchCourtiers.bind(this);
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.fetchAdministrations = this.fetchAdministrations.bind(this);
        this.ajouterAdministration = this.ajouterAdministration.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCourtiers();
        this._isMounted && this.fetchCabinets();
        this._isMounted && this.fetchAdministrations();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCourtiers() {
        axios.get(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/role/courtier?limit=0&skip=0`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((data) => {
                const courtiers = data;
                this.setState({
                    courtiers
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    fetchCabinets() {
        axios.get(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/cabinet`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((data) => {
                const cabinets = data;
                this.setState({
                    cabinets
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    fetchAdministrations() {
        axios.get(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/client`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((data) => {
                const clients = data;
                this.setState({
                    clients
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    ajouterAdministration(event) {
        event.preventDefault();
        const options = {
            numeroContrat: event.target['sofraco-contrat'].value,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            cabinet: event.target['sofraco-cabinet'].value,
            versementCommissions: event.target['sofraco-versement-commission'].value
        };
        if (options.numeroContrat !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.cabinet !== '' ||
            options.versementCommissions !== '') {
            axios.post(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/client/`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.token}`
                }
            }).then((res) => {
                let courtiers = this.state.courtiers;
                courtiers.push(res.data);
                this.setState({
                    courtiers: courtiers,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le client à été ajouté au cabinet` }
                });
                this.activerAjoutAdministration();
                event.target['sofraco-contrat'].value = '';
                event.target['sofraco-nom'].value = '';
                event.target['sofraco-prenom'].value = '';
                event.target['sofraco-cabinet'].value = '';
                event.target['sofraco-versement-commission'].value = '';
                this._isMounted && this.fetchCourtiers();
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
        }
    }

    editAdministration(event, item) {
        event.preventDefault();
        const options = {
            numeroContrat: event.target['sofraco-contrat-edit'].value,
            lastName: event.target['sofraco-nom-edit'].value,
            firstName: event.target['sofraco-prenom-edit'].value,
            cabinet: event.target['sofraco-cabinet-edit'].value,
            versementCommissions: event.target['sofraco-versement-commission-edit'].value
        };
        axios.put(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/client/${item._id}`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: `Le client à été modifié` }
            });
            this._isMounted && this.fetchAdministrations();
        }).catch((err) => {
            this.setState({
                toast: true,
                messageToast: { header: 'ERROR', color: 'danger', message: err }
            })
        }).finally(() => {
            setTimeout(() => {
                this.setState({
                    toast: false,
                    messageToast: {}
                });
            }, 6000);
        });
    }

    openDeletePopup(e, courtier) {
        this.setState({
            courtierToDel: courtier,
            visibleAlert: true
        });
    }

    deleteCourtier(e) {
        e.preventDefault();
        this.setState({ visibleAlert: false });
        axios.delete(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${this.state.courtierToDel._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le courtier ${this.state.courtierToDel.cabinet} à été supprimé` }
                });
                this._isMounted && this.fetchCourtiers();
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                this.setState({
                    courtierToDel: null
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    render() {
        return (
            <div>

                {
                    (this.state.toast === true &&
                        this.state.messageToast !== null) &&
                    <CToaster position="bottom-right" >
                        <CToast
                            show={true}
                            fade={true}
                            autohide={5000}
                            color={this.state.messageToast.color}
                        >
                            <CToastHeader closeButton>
                                {this.state.messageToast.header}
                            </CToastHeader>
                            <CToastBody>
                                {`${this.state.messageToast.message}`}
                            </CToastBody>
                        </CToast>
                    </CToaster>
                }
            </div>
        );
    }

}

export default Administration;
