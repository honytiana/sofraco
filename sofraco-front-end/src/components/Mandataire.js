import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CButton,
    CDataTable,
    CBadge,
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

import '../styles/Mandataire.css';
import config from '../config.json';

class Mandataire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mandataires: [],
            details: [],
            courtier: null,
            loader: false,
            toast: false,
            messageToast: {},
            fields: [],
            ajoutMandataire: false
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.activerAjoutMandataire = this.activerAjoutMandataire.bind(this);
    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('token'));
        const courtier = this.props.courtier;
        this.setState({
            courtier,
            toast: false,
            messageToast: {}
        });
        axios.get(`${config.nodeUrl}/api/courtier/mandataires/${courtier._id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then((res) => {
                this.setState({
                    mandataires: res.data
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            })
            .finally(() => {
                this.setState({
                    loader: false
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
        this.setState({
            fields: [
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Prénom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'email',
                    label: 'Email',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'phone',
                    label: 'Telephone',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'status',
                    label: 'Status',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'edit',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center']
                },
                {
                    key: 'delete',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center']
                }
            ],
            toast: false,
            messageToast: []
        });
    }

    componentDidUpdate() {

    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    onSubmitHandler(event, mandataire) {
        event.preventDefault();
        const token = JSON.parse(localStorage.getItem('token'));
        this.setState({
            loader: true
        });
        const options = {
            cabinet: event.target['sofraco-cabinet'].value,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            email: event.target['sofraco-email'].value,
            phone: event.target['sofraco-phone'].value
        };
        if (options.cabinet !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.email !== '' ||
            options.phone !== '') {
            axios.put(`${config.nodeUrl}/api/courtier/${mandataire._id}`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            }).then((res) => {
                let mandataires = this.state.mandataires;
                for (let m of mandataires) {
                    if (m._id === res.data._id) {
                        mandataires.splice(mandataires.indexOf(m), 1, res.data);
                    }
                }
                this.setState({
                    mandataires: mandataires,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le mandataire ${mandataire.cabinet} à été modifié` }
                });
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                this.setState({
                    loader: false
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
        }
    }

    deleteMandataire(e, mandataire) {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token'));
        axios.delete(`${config.nodeUrl}/api/courtier/${mandataire._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then((res) => {
                let mandataires = this.state.mandataires;
                for (let m of mandataires) {
                    if (m._id === res.data._id) {
                        mandataires.splice(mandataires.indexOf(m), 1, res.data);
                    }
                }
                this.setState({
                    mandataires: mandataires,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le mandataire ${res.data.cabinet} à été désactivé` }
                });
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                this.setState({
                    loader: false
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });

    }

    toggleDetails(index) {
        const position = this.state.details.indexOf(index)
        let newDetails = this.state.details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...this.state.details, index]
        }
        this.setState({
            details: newDetails
        })
    }

    activerAjoutMandataire() {
        let activer = this.state.ajoutMandataire;
        this.setState({
            ajoutMandataire: !activer
        });
    }

    ajouterMandataire(event) {
        event.preventDefault();
        const token = JSON.parse(localStorage.getItem('token'));
        this.setState({
            loader: true
        });
        const options = {
            cabinet: this.props.courtier.cabinet,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            email: event.target['sofraco-email'].value,
            phone: event.target['sofraco-phone'].value,
            role: 'mandataire'
        };
        if (options.cabinet !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.email !== '' ||
            options.phone !== '') {
            axios.post(`${config.nodeUrl}/api/courtier/`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            }).then((res) => {
                let mandataires = this.state.mandataires;
                mandataires.push(res.data);
                this.setState({
                    mandataires: mandataires,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le mandataire ${res.data.cabinet} à été ajouté` }
                });
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                this.setState({
                    loader: false
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
        }
    }

    render() {
        return (
            <div>
                <CButton className="sofraco-button" onClick={this.activerAjoutMandataire}>Ajouter un mandataire</CButton>
                <CModal
                    show={this.state.ajoutMandataire}
                    onClose={() => { this.activerAjoutMandataire() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Ajouter un mandataire</CModalHeader>
                    <CModalBody>
                        <CForm action="" method="post" onSubmit={(e) => this.ajouterMandataire(e)}>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-mandataire_${this.props.sIndex}`}>Cabinet</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-cabinet-mandataire_${this.props.sIndex}`}
                                    name={`sofraco-cabinet`}
                                    defaultValue={this.props.courtier.cabinet}
                                    autoComplete="cabinet"
                                    className="sofraco-input"
                                    disabled={true}
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-nom-mandataire_${this.props.sIndex}`}>Nom</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-nom-mandataire-mandataire_${this.props.sIndex}`}
                                    name={`sofraco-nom`}
                                    autoComplete="nom"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-prenom-mandataire_${this.props.sIndex}`}>Prénoms</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-prenom-mandataire_${this.props.sIndex}`}
                                    name={`sofraco-prenom`}
                                    autoComplete="prenom"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-email-mandataire_${this.props.sIndex}`}>Email</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-email-mandataire_${this.props.sIndex}`}
                                    name={`sofraco-email`}
                                    autoComplete="email"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-phone-mandataire_${this.props.sIndex}`}>Téléphone</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-phone-mandataire_${this.props.sIndex}`}
                                    name={`sofraco-phone`}
                                    autoComplete="phone"
                                    className="sofraco-input"
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
                            color="secondary"
                            onClick={() => { this.activerAjoutMandataire() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                <CDataTable
                    items={this.state.mandataires}
                    fields={this.state.fields}
                    hover
                    sorter
                    scopedSlots={{
                        'status':
                            (item) => (
                                <td className="text-center" >
                                    <CBadge color={this.getBadge(item.is_enabled)}>
                                        {item.is_enabled ? 'Active' : 'Inactive'}
                                    </CBadge>
                                </td>
                            ),
                        'edit':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color="warning"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                        >
                                            Edit
                                        </CButton>
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
                                        <CModalBody>
                                            <CForm action="" method="post" onSubmit={(e) => this.onSubmitHandler(e, item)}>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-mandataire_${item._id}`}>Cabinet</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-cabinet-mandataire_${item._id}`}
                                                        name={`sofraco-cabinet`}
                                                        placeholder={item.cabinet}
                                                        defaultValue={item.cabinet}
                                                        autoComplete="cabinet"
                                                        className="sofraco-input"
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-nom-mandataire_${item._id}`}>Nom</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-nom-mandataire_${item._id}`}
                                                        name={`sofraco-nom`}
                                                        placeholder={item.lastName}
                                                        defaultValue={item.lastName}
                                                        autoComplete="nom"
                                                        className="sofraco-input"
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-prenom-mandataire_${item._id}`}>Prénoms</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-prenom-mandataire_${item._id}`}
                                                        name={`sofraco-prenom`}
                                                        placeholder={item.firstName}
                                                        defaultValue={item.firstName}
                                                        autoComplete="prenom"
                                                        className="sofraco-input"
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-email-mandataire_${item._id}`}>Email</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-email-mandataire_${item._id}`}
                                                        name={`sofraco-email`}
                                                        placeholder={item.email}
                                                        defaultValue={item.email}
                                                        autoComplete="email"
                                                        className="sofraco-input"
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-phone-mandataire_${item._id}`}>Téléphone</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-phone-mandataire_${item._id}`}
                                                        name={`sofraco-phone`}
                                                        placeholder={item.phone}
                                                        defaultValue={item.phone}
                                                        autoComplete="phone"
                                                        className="sofraco-input"
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
                                                color="secondary"
                                                onClick={() => { this.toggleDetails(index) }}
                                            >Annuler</CButton>
                                        </CModalFooter>
                                    </CModal>
                                )
                            },
                        'delete':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color="danger"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={(e) => { this.deleteMandataire(e, item) }}
                                        >
                                            Delete
                                        </CButton>
                                    </td>
                                )
                            },
                    }
                    }
                />
                {
                    (this.state.toast === true &&
                        this.state.messageToast &&
                        this.state.messageToast.header &&
                        this.state.messageToast.message) && (
                        <CToaster position="bottom-right">
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
                    )
                }
            </div>
        );
    }
}

export default Mandataire;
