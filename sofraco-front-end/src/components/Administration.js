import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CJumbotron,
    CButton,
    CCard,
    CCardHeader,
    CCardBody,
    CInputGroup,
    CCollapse,
    CInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Administration.css';
import TokenService from '../services/token';
import CabinetService from '../services/cabinet';
import CourtierService from '../services/courtier';
import CorrespondanceService from '../services/correspondance';
import ClientService from '../services/client';
import DocumentService from '../services/document';
import ExcelMasterService from '../services/excelMaster';

require('dotenv').config();

class Administration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courtiers: [],
            cabinets: [],
            clients: [],
            fileCourtiers: null,
            fileMandataires: null,
            fileCodeCourtiers: null,
            fileCodeMandataires: null,
            fileCodeCourtiersMCMS: null,
            fileCodeMandatairesMCMS: null,
            fileCodeClient: null,
            toast: false,
            messageToast: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false,
            collapse: false,
            collapse2: false,
            collapse3: false
        }
        this._isMounted = false;
        this.fetchCourtiers = this.fetchCourtiers.bind(this);
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.fetchClients = this.fetchClients.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.createCourtiers = this.createCourtiers.bind(this);
        this.uploadCourtiers = this.uploadCourtiers.bind(this);
        this.uploadMandataires = this.uploadMandataires.bind(this);
        this.uploadCodeCourtier = this.uploadCodeCourtier.bind(this);
        this.uploadCodeMandataires = this.uploadCodeMandataires.bind(this);
        this.uploadCodeCourtierMCMS = this.uploadCodeCourtierMCMS.bind(this);
        this.uploadCodeMandatairesMCMS = this.uploadCodeMandatairesMCMS.bind(this);
        this.uploadCodeClient = this.uploadCodeClient.bind(this);
        this.createCodeClient = this.createCodeClient.bind(this);

        this.tokenService = new TokenService();
        this.clientService = new ClientService();
        this.courtierService = new CourtierService();
        this.correspondanceService = new CorrespondanceService();
        this.cabinetService = new CabinetService();
        this.documentService = new DocumentService();
        this.excelMasterService = new ExcelMasterService();
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

    toggle(e) {
        this.setState({
            collapse: !this.state.collapse
        });
        e.preventDefault();
    }

    toggle2(e) {
        this.setState({
            collapse2: !this.state.collapse2
        });
        e.preventDefault();
    }

    toggle3(e) {
        this.setState({
            collapse3: !this.state.collapse3
        });
        e.preventDefault();
    }

    resetDocuments(e) {
        e.preventDefault();
        this.documentService.deleteAllDocuments(this.state.token)
            .then((res) => {
                this.excelMasterService.deleteAllExcelMaster(this.state.token)
                    .then((res) => {
                        this.documentService.deleteAllDocumentFiles(this.state.token)
                            .then((res) => {
                                this.setState({
                                    toast: true,
                                    messageToast: { header: 'SUCCESS', color: 'success', message: `Les Documents ont été supprimé` }
                                });
                            })
                            .catch((err) => {
                                this.setState({
                                    toast: true,
                                    messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des fichiers documents` }
                                });
                            });
                    })
                    .catch((err) => {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des excels masters` }
                        });
                    })
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des documents` }
                });
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

    onChangeHandler(event, target) {
        event.preventDefault();
        const files = event.target.files[0];
        switch (target) {
            case 'courtiers':
                this.setState({
                    fileCourtiers: files
                });
                break;
            case 'mandataires':
                this.setState({
                    fileMandataires: files
                });
                break;
            case 'code courtiers':
                this.setState({
                    fileCodeCourtiers: files
                });
                break;
            case 'code mandataires':
                this.setState({
                    fileCodeMandataires: files
                });
                break;
            case 'code courtiers MCMS':
                this.setState({
                    fileCodeCourtiersMCMS: files
                });
                break;
            case 'code mandataires MCMS':
                this.setState({
                    fileCodeMandatairesMCMS: files
                });
                break;
            case 'client':
                this.setState({
                    fileCodeClient: files
                });
                break;
            default:
                console.log('Target not found');
        }
    }

    createCourtiers(formData) {
        this.courtierService.createCourtiers(undefined, formData, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: 'Les courtiers ont été insérés' }
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

    createCodeCourtiers(formData) {
        this.correspondanceService.createCorrespondance(undefined, formData, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: 'Les codes ont été insérés' }
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

    createCodeClient(formData) {
        this.clientService.createClients(undefined, formData, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: 'Les codes clients ont été insérés' }
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

    uploadCourtiers(e) {
        e.preventDefault();
        this.courtierService.deleteCourtiersByRole('courtier', this.state.token)
            .then((res) => {
                const formData = new FormData();
                formData.append('files', this.state.fileCourtiers);
                this.createCourtiers(formData);
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

    uploadMandataires(e) {
        e.preventDefault();
        this.courtierService.deleteCourtiersByRole('mandataire', this.state.token)
            .then((res) => {
                const formData = new FormData();
                formData.append('files', this.state.fileMandataires);
                this.createCourtiers(formData);
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

    resetCorrespondances(e) {
        e.preventDefault();
        this.correspondanceService.deleteAllCorrespondances(this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Tous les codes ont été supprimé` }
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des documents` }
                });
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

    resetClients(e) {
        e.preventDefault();
        this.clientService.deleteAllClients(this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Tous les clients ont été supprimé` }
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des documents` }
                });
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

    uploadCodeCourtier(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', this.state.fileCodeCourtiers);
        this.createCodeCourtiers(formData);
    }

    uploadCodeMandataires(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', this.state.fileCodeMandataires);
        this.createCodeCourtiers(formData);
    }

    uploadCodeCourtierMCMS(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', this.state.fileCodeCourtiersMCMS);
        this.createCodeCourtiers(formData);
    }

    uploadCodeMandatairesMCMS(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', this.state.fileCodeMandatairesMCMS);
        this.createCodeCourtiers(formData);
    }

    uploadCodeClient(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', this.state.fileCodeClient);
        this.createCodeClient(formData);
    }

    render() {
        return (
            <div>
                <CJumbotron>
                    <h3 className="display-4">Réinitialisation des documents</h3>
                    <p className="lead">Pour vider la base de données des documents et excels masters</p>
                    <CButton className="sofraco-confirm-button" onClick={(e) => { this.resetDocuments(e) }} >Réinitialiser</CButton>
                </CJumbotron>
                <CJumbotron>
                    <h3 className="display-4">Intégration courtiers<CIcon
                        className={'sofraco-icon-arrow'}
                        size="sm"
                        onClick={(e) => { this.toggle(e) }}
                        icon={this.state.collapse ? icon.cilArrowTop : icon.cilArrowBottom} /></h3>
                    <CCollapse
                        show={this.state.collapse}
                    >
                        <CCard>
                            <CCardHeader><h4>Intégration courtiers</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des courtiers</p>
                                <p>Veuillez insérer l'excel des courtiers</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'courtiers') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCourtiers(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Intégration mandataires</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des mandataires</p>
                                <p>Veuillez insérer l'excel des courtiers</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'mandataires') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadMandataires(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                    </CCollapse>
                </CJumbotron>
                <CJumbotron>
                    <h3 className="display-4">Intégration codes de Correspondance<CIcon
                        className={'sofraco-icon-arrow'}
                        size="sm"
                        onClick={(e) => { this.toggle2(e) }}
                        icon={this.state.collapse2 ? icon.cilArrowTop : icon.cilArrowBottom} /></h3>
                    <CCollapse
                        show={this.state.collapse2}
                    >
                        <CCard>
                            <CCardHeader><h4>Réinitialisation Codes Courtiers</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Réinitialisation des Codes Courtiers</p>
                                <p>A faire avant de réintégrer des nouveaux codes</p>
                                <CButton className="sofraco-confirm-button" onClick={(e) => { this.resetCorrespondances(e) }} >Réinitialiser</CButton>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Codes Courtiers</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes courtiers</p>
                                <p>Veuillez insérer l'excel des codes courtiers</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'code courtiers') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCodeCourtier(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Codes Courtiers MCMS</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes courtiers MCMS</p>
                                <p>Veuillez insérer l'excel des codes courtiers MCMS</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'code courtiers MCMS') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCodeCourtierMCMS(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Codes Mandataires</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes mandataires</p>
                                <p>Veuillez insérer l'excel des codes mandataires</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'code mandataires') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCodeMandataires(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Codes Mandataires MCMS</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes mandataires MCMS</p>
                                <p>Veuillez insérer l'excel des codes mandataires MCMS</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'code mandataires MCMS') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCodeMandatairesMCMS(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                    </CCollapse>
                </CJumbotron>
                <CJumbotron>
                    <h3 className="display-4">Intégration des codes clients<CIcon
                        className={'sofraco-icon-arrow'}
                        size="sm"
                        onClick={(e) => { this.toggle3(e) }}
                        icon={this.state.collapse3 ? icon.cilArrowTop : icon.cilArrowBottom} /></h3>
                    <CCollapse
                        show={this.state.collapse3}
                    >
                        <CCard>
                            <CCardHeader><h4>Réinitialisation Codes Clients</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Réinitialisation des Codes Clients</p>
                                <p>A faire avant de réintégrer des nouveaux codes</p>
                                <CButton className="sofraco-confirm-button" onClick={(e) => { this.resetClients(e) }} >Réinitialiser</CButton>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader><h4>Intégration des codes clients</h4></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes clients</p>
                                <p>Veuillez insérer l'excel des codes clients</p>
                                <CInputGroup>
                                    <CInput type='file' className="col-sm-5" onChange={(e) => { this.onChangeHandler(e, 'client') }} />
                                    <CButton className="input-group-append sofraco-confirm-button" onClick={(e) => { this.uploadCodeClient(e) }} >Insérer</CButton>
                                </CInputGroup>
                            </CCardBody>
                        </CCard>
                    </CCollapse>
                </CJumbotron>
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
