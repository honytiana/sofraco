import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSelect,
    CForm,
    CFormGroup,
    CLabel,
    CInput
} from '@coreui/react';

import '../styles/Client.css';
import CabinetService from '../services/cabinet';
import ClientService from '../services/client';

require('dotenv').config();

class Client extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cabinets: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            visibleAlert: false,
            interne: false
        }
        this._isMounted = false;
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.editClient = this.editClient.bind(this);

        this.cabinetService = new CabinetService();
        this.clientService = new ClientService();
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.setState({
            fields: [
                {
                    key: 'numeroContrat',
                    label: 'Numéro contrat',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Prénom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '30%' },
                    _classes: ['text-center']
                },
                {
                    key: 'versementCommissions',
                    label: 'Versement des commissions',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                },
                {
                    key: 'delete',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ]
        });
        this._isMounted && this.fetchCabinets();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCabinets() {
        this.cabinetService.getCabinets(this.state.token)
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

    editClient(event, client) {
        event.preventDefault();
        const options = {
            numeroContrat: event.target['sofraco-contrat-edit'].value,
            lastName: event.target['sofraco-nom-edit'].value,
            firstName: event.target['sofraco-prenom-edit'].value,
            cabinet: event.target['sofraco-cabinet-edit'].value,
            versementCommissions: event.target['sofraco-versement-commission-edit'].value
        };
        this.clientService.updateClient(this.props.client._id, options)
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

    render() {
        return (
            <div>
                <CForm action="" method="post" id={`detail_form-${this.props.client._id}`} onSubmit={(e) => this.editClient(e, this.props.client)}>
                    <CFormGroup row>
                        <CLabel className="col-sm-3" htmlFor={`sofraco-contrat-client${this.props.client._id}`}>Numéro de contrat</CLabel>
                        <CInput
                            type="text"
                            id={`sofraco-contrat-client${this.props.client._id}`}
                            name={`sofraco-contrat-edit`}
                            defaultValue={this.props.client.numeroContrat}
                            autoComplete="contrat"
                            className={"sofraco-input col-sm-7"}
                        />
                    </CFormGroup>
                    <CFormGroup row>
                        <CLabel className="col-sm-3" htmlFor={`sofraco-nom-client${this.props.client._id}`}>Nom</CLabel>
                        <CInput
                            type="text"
                            id={`sofraco-nom-courtier-client${this.props.client._id}`}
                            name={`sofraco-nom-edit`}
                            defaultValue={this.props.client.lastName}
                            autoComplete="nom"
                            className={"sofraco-input col-sm-7"}
                        />
                    </CFormGroup>
                    <CFormGroup row>
                        <CLabel className="col-sm-3" htmlFor={`sofraco-prenom-client${this.props.client._id}`}>Prénoms</CLabel>
                        <CInput
                            type="text"
                            id={`sofraco-prenom-client${this.props.client._id}`}
                            name={`sofraco-prenom-edit`}
                            defaultValue={this.props.client.firstName}
                            autoComplete="prenom"
                            className={"sofraco-input col-sm-7"}
                        />
                    </CFormGroup>
                    <CFormGroup row>
                        <CLabel className="col-sm-3" htmlFor={`sofraco-cabinet-client${this.props.client._id}`}>Cabinet</CLabel>
                        <CSelect
                            label="Cabinet"
                            className="sofraco-select-filtre col-sm-7"
                            style={{ display: "inline-block" }}
                            name={`sofraco-cabinet-edit`}
                            defaultValue={this.props.client.cabinet}
                        >
                            {this.state.cabinets.map((cabinet, index) => {
                                return (
                                    <option key={`yearoption${index}`} value={cabinet._id} selected={this.props.client.cabinet === cabinet._id}>{cabinet.cabinet}</option>
                                )
                            })}
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup row>
                        <CLabel className="col-sm-3" htmlFor={`sofraco-versement-commission-client${this.props.client._id}`}>Versement des commissions</CLabel>
                        <CInput
                            type="text"
                            id={`sofraco-versement-commission-client${this.props.client._id}`}
                            name={`sofraco-versement-commission-edit`}
                            defaultValue={this.props.client.versementCommissions}
                            autoComplete="versement-commission"
                            className={"sofraco-input col-sm-7"}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CInput
                            type="submit"
                            name="sofraco-submit"
                            value="Sauvegarder"
                            className="sofraco-button"
                        />
                    </CFormGroup>
                </CForm>
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

export default Client;
