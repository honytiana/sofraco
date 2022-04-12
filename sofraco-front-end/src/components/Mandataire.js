import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CButton,
    CDataTable,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import Correspondance from './Correspondance';
import '../styles/Mandataire.css';

require('dotenv').config();

class Mandataire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mandataires: [],
            details: [],
            courtier: null,
            toast: false,
            messageToast: [],
            fields: [],
            ajoutMandataire: false,
            newP: this.props.newP,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            visibleAlert: false,
            mandataireToDel: null,
            interne: false
        }
        this._isMounted = false;
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.activerAjoutMandataire = this.activerAjoutMandataire.bind(this);
        this.fetchMandataires = this.fetchMandataires.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
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
                // {
                //     key: 'status',
                //     label: 'Status',
                //     _style: { width: '10%' },
                //     _classes: ['text-center']
                // },
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
            ]
        });

        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchMandataires();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.fetchMandataires();
        }
    }

    componentDidUpdate() {
        this.render();
    }

    fetchMandataires() {
        const courtier = this.props.courtier;
        axios.get(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/mandataires/${courtier._id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.props.token}`
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
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    activerAjoutMandataire() {
        let activer = this.state.ajoutMandataire;
        this.setState({
            ajoutMandataire: !activer
        });
    }

    ajouterMandataire(event) {
        event.preventDefault();
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
            axios.post(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                }
            }).then((res) => {
                let mandataires = this.state.mandataires;
                mandataires.push(res.data);
                this.setState({
                    mandataires: mandataires,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le mandataire ${res.data.cabinet} à été ajouté` }
                });
                this.activerAjoutMandataire();
                event.target['sofraco-nom'].value = '';
                event.target['sofraco-prenom'].value = '';
                event.target['sofraco-email'].value = '';
                event.target['sofraco-phone'].value = '';
                this._isMounted && this.fetchMandataires();
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

    onSubmitHandler(event, mandataire) {
        event.preventDefault();
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
            axios.put(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${mandataire._id}`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
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
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
        }
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
            details: newDetails
        });
    }

    openDeletePopup(e, mandataire) {
        this.setState({
            mandataireToDel: mandataire,
            visibleAlert: true
        });
    }

    deleteMandataire(e) {
        e.preventDefault();
        this.setState({ visibleAlert: false });
        axios.delete(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier/${this.state.mandataireToDel._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token}`
            }
        })
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le mandataire ${res.data.cabinet} à été supprimé` }
                });
                this._isMounted && this.fetchMandataires();
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
            })

    }

    closeDeletePopup(e) {
        this.setState({
            visibleAlert: false,
            mandataireToDel: null
        });
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
                    <CModalBody className="sofraco-modal-body">
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
                            className={'sofraco-button-anuler'}
                            onClick={() => { this.activerAjoutMandataire() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                <CDataTable
                    items={this.state.mandataires}
                    fields={this.state.fields}
                    hover
                    sorter
                    border
                    scopedSlots={{
                        // 'status':
                        //     (item) => (
                        //         <td className="text-center" >
                        //             <CBadge color={this.getBadge(item.is_enabled)}>
                        //                 {item.is_enabled ? 'Active' : 'Inactive'}
                        //             </CBadge>
                        //         </td>
                        //     ),
                        'edit':
                            (item, index) => {
                                return (
                                    <td className="py-2">
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
                                            <CTabs activeTab="mandataire">
                                                <CNav variant="tabs">
                                                    <CNavItem>
                                                        <CNavLink data-tab="mandataire">
                                                            Mandataire
                                                        </CNavLink>
                                                    </CNavItem>
                                                    <CNavItem>
                                                        <CNavLink data-tab="codeMandataire">
                                                            Code Mandataire
                                                        </CNavLink>
                                                    </CNavItem>
                                                </CNav>
                                                <CTabContent>
                                                    <CTabPane data-tab="mandataire">
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
                                                    </CTabPane>
                                                    <CTabPane data-tab="codeMandataire">
                                                        <Correspondance courtier={item} key={`correspondanceMandataire${item._id}`} sIndex={index} token={this.props.token} add={true} />
                                                    </CTabPane>
                                                </CTabContent>
                                            </CTabs>
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
                        'delete':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CIcon
                                            className={'sofraco-icon-del text-danger'}
                                            color='danger'
                                            size="sm"
                                            icon={icon.cilTrash}
                                            onClick={(e) => this.openDeletePopup(e, item)} />
                                    </td>
                                )
                            }
                    }
                    }
                />
                <CModal
                    show={this.state.visibleAlert}
                    className="sofraco-modal-ask"
                    id="sofraco-modal-ask"
                    onClose={(e) => { this.closeDeletePopup() }}
                >
                    <CModalHeader closeButton></CModalHeader>
                    <CModalBody>
                        Voulez vous vraiment supprimer le mandataire {this.state.mandataireToDel ? this.state.mandataireToDel.cabinet : ''}?
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            color="danger"
                            onClick={(e) => { this.deleteMandataire(e) }}
                            size="sm">
                            Supprimer
                        </CButton>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={(e) => this.closeDeletePopup()}
                            size="sm">
                            Annuler
                        </CButton>
                    </CModalFooter>
                </CModal>
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
