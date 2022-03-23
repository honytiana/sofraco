import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CButton,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSelect,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CForm,
    CFormGroup,
    CLabel,
    CInput
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Client.css';
import config from '../config.json';

class Client extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            ajoutClient: false,
            courtierToDel: null,
            visibleAlert: false,
            interne: false
        }
        this._isMounted = false;
        this.fetchCourtiers = this.fetchCourtiers.bind(this);
        this.activerAjoutClient = this.activerAjoutClient.bind(this);
        this.ajouterClient = this.ajouterClient.bind(this);
        this.handleClientCallback = this.handleClientCallback.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCourtiers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCourtiers() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/role/courtier?limit=0&skip=0`, {
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

    activerAjoutClient() {
        let activer = this.state.ajoutClient;
        this.setState({
            ajoutClient: !activer
        });
    }

    ajouterClient(event) {
        event.preventDefault();
        const options = {
            courtier: event.target['sofraco-cabinet'].value,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            email: event.target['sofraco-email'].value,
            phone: event.target['sofraco-phone'].value
        };
        if (options.courtier !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.email !== '' ||
            options.phone !== '') {
            axios.post(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/client/`, options, {
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
                this.activerAjoutClient();
                event.target['sofraco-cabinet'].value = '';
                event.target['sofraco-nom'].value = '';
                event.target['sofraco-prenom'].value = '';
                event.target['sofraco-email'].value = '';
                event.target['sofraco-phone'].value = '';
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

    openDeletePopup(e, courtier) {
        this.setState({
            courtierToDel: courtier,
            visibleAlert: true
        });
    }

    deleteCourtier(e) {
        e.preventDefault();
        this.setState({ visibleAlert: false });
        axios.delete(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/${this.state.courtierToDel._id}`, {
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

    closeDeletePopup(e) {
        this.setState({
            visibleAlert: false,
            courtierToDel: null
        });
    }

    handleClientCallback() {
        this._isMounted && this.fetchCourtiers();
    }

    render() {
        return (
            <div>
                <CModal
                    show={this.state.ajoutClient}
                    onClose={() => { this.activerAjoutClient() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Créer un client</CModalHeader>
                    <CModalBody className="sofraco-modal-body">
                            <CForm action="" method="post" onSubmit={(e) => this.ajouterClient(e)}>
                                <CFormGroup row>
                                    <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-courtier${this.props.sIndex}`}>Cabinet</CLabel>
                                    <CSelect
                                        label="Cabinet"
                                        className="sofraco-select-filtre col-sm-8"
                                        style={{ display: "inline-block" }}
                                        name={`sofraco-cabinet`}
                                    >
                                        <option>Selectionnez un cabinet</option>
                                        {this.state.courtiers.map((courtier, index) => {
                                            return (
                                                <option key={`yearoption${index}`} value={courtier._id}>{courtier.cabinet}</option>
                                            )
                                        })}
                                    </CSelect>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CLabel className="col-sm-2" htmlFor={`sofraco-nom-courtier_${this.props.sIndex}`}>Nom</CLabel>
                                    <CInput
                                        type="text"
                                        id={`sofraco-nom-courtier-courtier_${this.props.sIndex}`}
                                        name={`sofraco-nom`}
                                        autoComplete="nom"
                                        className={"sofraco-input col-sm-8"}
                                    />
                                </CFormGroup>
                                <CFormGroup row>
                                    <CLabel className="col-sm-2" htmlFor={`sofraco-prenom-courtier_${this.props.sIndex}`}>Prénoms</CLabel>
                                    <CInput
                                        type="text"
                                        id={`sofraco-prenom-courtier_${this.props.sIndex}`}
                                        name={`sofraco-prenom`}
                                        autoComplete="prenom"
                                        className={"sofraco-input col-sm-8"}
                                    />
                                </CFormGroup>
                                <CFormGroup row>
                                    <CLabel className="col-sm-2" htmlFor={`sofraco-email-courtier_${this.props.sIndex}`}>Email</CLabel>
                                    <CInput
                                        type="text"
                                        id={`sofraco-email-courtier_${this.props.sIndex}`}
                                        name={`sofraco-email`}
                                        autoComplete="email"
                                        className={"sofraco-input col-sm-8"}
                                    />
                                </CFormGroup>
                                <CFormGroup row>
                                    <CLabel className="col-sm-2" htmlFor={`sofraco-phone-courtier_${this.props.sIndex}`}>Téléphone</CLabel>
                                    <CInput
                                        type="text"
                                        id={`sofraco-phone-courtier_${this.props.sIndex}`}
                                        name={`sofraco-phone`}
                                        autoComplete="phone"
                                        className={"sofraco-input col-sm-8"}
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
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={() => { this.activerAjoutClient() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>

                <CButton className="sofraco-button" onClick={this.activerAjoutClient}>Ajouter un client</CButton>
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
