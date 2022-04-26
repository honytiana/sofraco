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
    CCardFooter,
    CCollapse,
    CInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Administration.css';
import TokenService from '../services/token';
import CabinetService from '../services/cabinet';
import CourtierService from '../services/courtier';
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
            toast: false,
            messageToast: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false,
            collapse: false,
            collapse2: false
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

        this.tokenService = new TokenService();
        this.clientService = new ClientService();
        this.courtierService = new CourtierService();
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

    resetDocuments(e) {
        e.preventDefault();
        this.documentService.deleteAllDocuments(this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Tous les documents ont été supprimé` }
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
        this.excelMasterService.deleteAllExcelMaster(this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Tous les excels masters ont été supprimé` }
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: `Erreur lors de la suppression des excels masters` }
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

    render() {
        return (
            <div>
                <CJumbotron>
                    <h2 className="display-3">Réinitialisation des documents</h2>
                    <p className="lead">Pour vider la base de données des documents et excels masters</p>
                    <CButton color="primary" onClick={(e) => { this.resetDocuments(e) }} >Réinitialiser</CButton>
                </CJumbotron>
                <CJumbotron>
                    <h2 className="display-3">Intégration courtiers<CIcon
                        className={'sofraco-icon-arrow'}
                        size="sm"
                        onClick={(e) => { this.toggle2(e) }}
                        icon={icon.cilArrowBottom} /></h2>
                    <CCollapse
                        show={this.state.collapse2}
                    >
                        <CCard>
                            <CCardHeader><h3 className="display-3">Intégration courtiers</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des courtiers</p>
                                <p>Veuillez insérer l'excel des courtiers</p>
                                <CInput type='file' name='sofraco-upload-courtiers' onChange={(e) => { this.onChangeHandler(e, 'courtiers') }} />
                                <CButton color="primary" onClick={(e) => { this.uploadCourtiers(e) }} >Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
                        </CCard>
                        <CCard>
                            <CCardHeader><h3 className="display-3">Intégration mandataires</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des mandataires</p>
                                <p>Veuillez insérer l'excel des courtiers</p>
                                <CInput type='file' name='sofraco-upload-mandataires' onChange={(e) => { this.onChangeHandler(e, 'mandataires') }} />
                                <CButton color="primary" onClick={(e) => { this.uploadMandataires(e) }} >Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
                        </CCard>
                    </CCollapse>
                </CJumbotron>
                <CJumbotron>
                    <h2 className="display-3">Intégration codes Courtiers<CIcon
                        className={'sofraco-icon-arrow'}
                        size="sm"
                        onClick={(e) => { this.toggle(e) }}
                        icon={icon.cilArrowBottom} /></h2>
                    <CCollapse
                        show={this.state.collapse}
                    >
                        <CCard>
                            <CCardHeader><h3 className="display-3">Codes Courtiers</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes courtiers</p>
                                <p>Veuillez insérer l'excel des codes courtiers</p>
                                <CInput type='file' />
                                <CButton color="primary" href="https://coreui.io/" target="_blank">Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
                        </CCard>
                        <CCard>
                            <CCardHeader><h3 className="display-3">Codes Courtiers MCMS</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes courtiers MCMS</p>
                                <p>Veuillez insérer l'excel des codes courtiers MCMS</p>
                                <CInput type='file' />
                                <CButton color="primary" href="https://coreui.io/" target="_blank">Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
                        </CCard>
                        <CCard>
                            <CCardHeader><h3 className="display-3">Codes Mandataires</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes mandataires</p>
                                <p>Veuillez insérer l'excel des codes mandataires</p>
                                <CInput type='file' />
                                <CButton color="primary" href="https://coreui.io/" target="_blank">Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
                        </CCard>
                        <CCard>
                            <CCardHeader><h3 className="display-3">Codes Mandataires MCMS</h3></CCardHeader>
                            <CCardBody>
                                <p className="lead">Pour l'intégration des codes mandataires MCMS</p>
                                <p>Veuillez insérer l'excel des codes mandataires MCMS</p>
                                <CInput type='file' />
                                <CButton color="primary" href="https://coreui.io/" target="_blank">Insérer</CButton>
                            </CCardBody>
                            <CCardFooter></CCardFooter>
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
