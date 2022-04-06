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
    CInput,
    CDataTable
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
            cabinets: [],
            clients: [],
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
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.fetchClients = this.fetchClients.bind(this);
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
            ]
        });
        this._isMounted && this.fetchCourtiers();
        this._isMounted && this.fetchCabinets();
        this._isMounted && this.fetchClients();
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

    fetchCabinets() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, {
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

    fetchClients() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/client`, {
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

    toggleDetails(index) {
        const position = this.state.details.indexOf(index);
        let newDetails = this.state.details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...this.state.details, index];
        }
        this.setState({
            details: newDetails,
            num: index
        });
        this._isMounted && this.fetchCourtiers();
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
        axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/client/${item._id}`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then((res) => {
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
                                <CLabel className="col-sm-3" htmlFor={`sofraco-contrat-client${this.props.sIndex}`}>Numéro de contrat</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-contrat-client${this.props.sIndex}`}
                                    name={`sofraco-contrat`}
                                    autoComplete="contrat"
                                    className={"sofraco-input col-sm-7"}
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-3" htmlFor={`sofraco-nom-client${this.props.sIndex}`}>Nom</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-nom-courtier-client${this.props.sIndex}`}
                                    name={`sofraco-nom`}
                                    autoComplete="nom"
                                    className={"sofraco-input col-sm-7"}
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-3" htmlFor={`sofraco-prenom-client${this.props.sIndex}`}>Prénoms</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-prenom-client${this.props.sIndex}`}
                                    name={`sofraco-prenom`}
                                    autoComplete="prenom"
                                    className={"sofraco-input col-sm-7"}
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-3" htmlFor={`sofraco-cabinet-client${this.props.sIndex}`}>Cabinet</CLabel>
                                <CSelect
                                    label="Cabinet"
                                    className="sofraco-select-filtre col-sm-7"
                                    style={{ display: "inline-block" }}
                                    name={`sofraco-cabinet`}
                                >
                                    <option>Selectionnez un cabinet</option>
                                    {this.state.cabinets.map((cabinet, index) => {
                                        return (
                                            <option key={`cabinetOption${index}`} value={cabinet._id}>{cabinet.cabinet}</option>
                                        )
                                    })}
                                </CSelect>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-3" htmlFor={`sofraco-versement-commission-client${this.props.sIndex}`}>Versement des commissions</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-versement-commission-client${this.props.sIndex}`}
                                    name={`sofraco-versement-commission`}
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
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={() => { this.activerAjoutClient() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                <CDataTable
                    items={this.state.clients}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Recherche', placeholder: '...' }}
                    itemsPerPageSelect={{ label: 'Nombre de clients par page' }}
                    itemsPerPage={15}
                    hover
                    sorter
                    border
                    size={'sm'}
                    pagination={{
                        className: 'sofraco-pagination'
                    }}
                    scopedSlots={{
                        'cabinet':
                            (item, index) => {
                                return (
                                    <td className="text-center">
                                        {this.state.cabinets.map((cabinet, index) => {
                                            if(cabinet._id === item.cabinet) {
                                                return cabinet.cabinet;
                                            }
                                        })}
                                    </td>
                                )
                            },
                        'show_details':
                            (item, index) => {
                                return (
                                    <td className="text-center">
                                        <CIcon
                                            className={'sofraco-icon-edit'}
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                            icon={icon.cilPencil} />
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CModal
                                        show={this.state.details.includes(index)}
                                        onClose={() => { this.toggleDetails(index) }}
                                        centered={true}
                                        className="sofraco-modal"
                                    >
                                        <CModalHeader closeButton>{item.cabinet}</CModalHeader>
                                        <CModalBody className="sofraco-modal-body">
                                            <CForm action="" method="post" onSubmit={(e) => this.editClient(e, item)}>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-3" htmlFor={`sofraco-contrat-client${item._id}`}>Numéro de contrat</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-contrat-client${item._id}`}
                                                        name={`sofraco-contrat-edit`}
                                                        defaultValue={item.numeroContrat}
                                                        autoComplete="contrat"
                                                        className={"sofraco-input col-sm-7"}
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-3" htmlFor={`sofraco-nom-client${item._id}`}>Nom</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-nom-courtier-client${item._id}`}
                                                        name={`sofraco-nom-edit`}
                                                        defaultValue={item.lastName}
                                                        autoComplete="nom"
                                                        className={"sofraco-input col-sm-7"}
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-3" htmlFor={`sofraco-prenom-client${item._id}`}>Prénoms</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-prenom-client${item._id}`}
                                                        name={`sofraco-prenom-edit`}
                                                        defaultValue={item.firstName}
                                                        autoComplete="prenom"
                                                        className={"sofraco-input col-sm-7"}
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-3" htmlFor={`sofraco-cabinet-client${item._id}`}>Cabinet</CLabel>
                                                    <CSelect
                                                        label="Cabinet"
                                                        className="sofraco-select-filtre col-sm-7"
                                                        style={{ display: "inline-block" }}
                                                        name={`sofraco-cabinet-edit`}
                                                        defaultValue={item.cabinet}
                                                    >
                                                        <option>Selectionnez un cabinet</option>
                                                        {this.state.cabinets.map((cabinet, index) => {
                                                            return (
                                                                <option key={`yearoption${index}`} value={cabinet._id}>{cabinet.cabinet}</option>
                                                            )
                                                        })}
                                                    </CSelect>
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-3" htmlFor={`sofraco-versement-commission-client${item._id}`}>Versement des commissions</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-versement-commission-client${item._id}`}
                                                        name={`sofraco-versement-commission-edit`}
                                                        defaultValue={item.versementCommissions}
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
                                        </CModalBody>
                                        <CModalFooter>
                                            <CButton
                                                className={'sofraco-button-anuler'}
                                                onClick={() => { this.toggleDetails(index) }}
                                            >Annuler</CButton>
                                        </CModalFooter>
                                    </CModal>
                                )
                            },
                        'emailCopie':
                            (item, index) => {
                                return (
                                    <td className="text-center" >
                                        {item.emailCopie.map(ec => {
                                            return <span href="#" key={`${ec}-${index}`}>{ec}, </span>
                                        })}
                                    </td>
                                )
                            },
                        'delete':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CIcon
                                            className={'sofraco-icon-del text-danger'}
                                            color='danger'
                                            size="sm"
                                            icon={icon.cilTrash} />
                                    </td>
                                )
                            }
                    }
                    }
                />
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
