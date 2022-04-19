import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody
} from '@coreui/react';

import '../styles/Administration.css';
import TokenService from '../services/token';
import CabinetService from '../services/cabinet';
import ClientService from '../services/client';

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
        this.fetchClients = this.fetchClients.bind(this);
        this.ajouterClients = this.ajouterClients.bind(this);
        this.editClient = this.editClient.bind(this);

        this.tokenService = new TokenService();
        this.clientService = new ClientService();
        this.cabinetService = new CabinetService();
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCourtiers();
        this._isMounted && this.fetchCabinets();
        this._isMounted && this.fetchClients();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCourtiers() {
        this.courtierService.getCourtiersByRole('courtier', this.state.token)
            .then((res) => {
                const courtiers = res;
                this.setState({
                    courtiers
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    fetchCabinets() {
        this.cabinetService.getCabinets(this.state.token)
            .then((res) => {
                const cabinets = res;
                this.setState({
                    cabinets
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    fetchClients() {
        this.clientService.getClients(this.state.token)
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

    ajouterClients(event) {
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
            this.clientService.createClient(options, this.state.token)
                .then((res) => {
                    let courtiers = this.state.courtiers;
                    courtiers.push(res);
                    this.setState({
                        courtiers: courtiers,
                        toast: true,
                        messageToast: { header: 'SUCCESS', color: 'success', message: `Le client à été ajouté au cabinet` }
                    });
                    this.activerAjoutClient();
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

    editClient(event, item) {
        event.preventDefault();
        const options = {
            numeroContrat: event.target['sofraco-contrat-edit'].value,
            lastName: event.target['sofraco-nom-edit'].value,
            firstName: event.target['sofraco-prenom-edit'].value,
            cabinet: event.target['sofraco-cabinet-edit'].value,
            versementCommissions: event.target['sofraco-versement-commission-edit'].value
        };
        this.clientService.updateClient(item._id, options, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le client à été modifié` }
                });
                this._isMounted && this.fetchClients();
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
