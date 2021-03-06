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
    CInput,
    CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Correspondance.css';
import CompanyService from '../services/company';
import CorrespondanceService from '../services/correspondance';

require('dotenv').config();

class Correspondance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correspondance: null,
            companies: [],
            details: [],
            courtier: null,
            loader: false,
            toast: false,
            messageToast: {},
            fields: [],
            ajoutCorrespondance: false,
            newP: this.props.newP,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.activerAjoutCorrespondance = this.activerAjoutCorrespondance.bind(this);
        this.fetchCorrespondances = this.fetchCorrespondances.bind(this);
        this.getCompanies = this.getCompanies.bind(this);

        this.companyService = new CompanyService();
        this.correspondanceService = new CorrespondanceService();
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.props.add) {
            this.setState({
                fields: [
                    {
                        key: 'companyGlobalName',
                        label: 'Compagnies',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    },
                    {
                        key: 'particular',
                        label: 'Indication',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    },
                    {
                        key: 'code',
                        label: 'Code',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    }
                ],
                toast: false,
                messageToast: []
            });
        } else {
            this.setState({
                fields: [
                    {
                        key: 'companyGlobalName',
                        label: 'Compagnies',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    },
                    {
                        key: 'particular',
                        label: 'Indication',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    },
                    {
                        key: 'code',
                        label: 'Code',
                        _style: { width: '20%' },
                        _classes: ['text-center']
                    },
                    {
                        key: 'edit',
                        label: '',
                        _style: { width: '10%' },
                        _classes: ['text-center'],
                        sorter: false,
                        filter: false
                    }
                ],
                toast: false,
                messageToast: []
            });
        }

        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCorrespondances();
        this._isMounted && this.getCompanies();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCorrespondances() {
        const courtier = this.props.courtier;
        this.correspondanceService.getCorrespondanceByCourtier(courtier._id, this.props.token)
            .then((res) => {
                this.setState({
                    correspondance: (res) ? res : null
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
    }

    getCompanies() {
        this.companyService.getCompanies(this.props.token)
            .then((res) => {
                this.setState({
                    companies: res
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
    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    onSubmitHandler(event, correspondance) {
        event.preventDefault();
        this.setState({
            loader: true
        });
        const options = {
            company: event.target['sofraco-company'].value,
            particular: '',
            code: event.target['sofraco-code'].value,
        };
        this.correspondanceService.editCodeCourtier(this.props.courtier._id, options, this.props.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le code du courtier ${this.props.courtier.cabinet} ?? ??t?? modifi??` }
                });
                this._isMounted && this.fetchCorrespondances();
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

    deleteCorrespondance(e, correspondance) {
        e.preventDefault();
        this.correspondanceService.deleteCodeCourtier(this.props.courtier._id, correspondance.code, this.props.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le code ${correspondance.code} ?? ??t?? d??sactiv??` }
                });
                this._isMounted && this.fetchCorrespondances();
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

    activerAjoutCorrespondance() {
        let activer = this.state.ajoutCorrespondance;
        this.setState({
            ajoutCorrespondance: !activer
        });
    }

    ajouterCorrespondance(event) {
        event.preventDefault();
        this.setState({
            loader: true
        });
        const options = {
            company: event.target['sofraco-company'].value,
            particular: '',
            code: event.target['sofraco-code'].value,
        };
        this.correspondanceService.addCodeCourtier(this.props.courtier._id, options, this.props.token)
        .then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: `Un code du courtier ${this.props.courtier.cabinet} ?? ??t?? ajout??` }
            });
            this._isMounted && this.fetchCorrespondances();
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

    render() {
        return (
            <div>
                {this.props.add && (
                    <CButton className="sofraco-button" onClick={this.activerAjoutCorrespondance}>Ajouter un nouveau code</CButton>
                )}
                <CModal
                    show={this.state.ajoutCorrespondance}
                    onClose={() => { this.activerAjoutCorrespondance() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Ajouter un nouveau code au courtier {this.props.courtier.cabinet}</CModalHeader>
                    <CModalBody className="sofraco-modal-body">
                        <CForm action="" method="post" onSubmit={(e) => this.ajouterCorrespondance(e)}>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-compagnie_${this.props.sIndex}`}>Compagnie</CLabel>
                                <CSelect
                                    label="Compagnie"
                                    className="sofraco-select-filtre"
                                    name={`sofraco-company`}
                                    required={true}
                                >
                                    <option>Selectionnez une compagnie</option>
                                    {this.state.companies.map((company, index) => {
                                        return (
                                            <option key={`companyoption${index}`} value={company._id}>{company.name}</option>
                                        )
                                    })}
                                </CSelect>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-code_${this.props.sIndex}`}>Code</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-code_${this.props.sIndex}`}
                                    name={`sofraco-code`}
                                    autoComplete="code"
                                    className="sofraco-input"
                                    required={true}
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput
                                    type="submit"
                                    name="sofraco-submit"
                                    value="Ajouter le code"
                                    className="sofraco-button"
                                />
                            </CFormGroup>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={() => { this.activerAjoutCorrespondance() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                {(this.state.correspondance && this.state.correspondance.companies.length > 0) && (
                    <CDataTable
                        items={this.state.correspondance.companies}
                        fields={this.state.fields}
                        hover
                        sorter
                        border
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
                                            <CModalHeader closeButton>Modifier le code {item.code} du courtier {this.props.courtier.cabinet}</CModalHeader>
                                            <CModalBody className="sofraco-modal-body">
                                                <CForm action="" method="post" onSubmit={(e) => this.onSubmitHandler(e, item)}>
                                                    <CFormGroup row>
                                                        <CLabel className="col-sm-2" htmlFor={`sofraco-compagnie_${item._id}`}>Compagnie</CLabel>
                                                        <CInput
                                                            type="text"
                                                            id={`sofraco-compagnie_${item._id}`}
                                                            name={`sofraco-company`}
                                                            placeholder={item.company}
                                                            defaultValue={item.company}
                                                            autoComplete="compagnie"
                                                            className="sofraco-input"
                                                            disabled={true}
                                                        />
                                                    </CFormGroup>
                                                    <CFormGroup row>
                                                        <CLabel className="col-sm-2" htmlFor={`sofraco-code_${item._id}`}>Code</CLabel>
                                                        <CInput
                                                            type="text"
                                                            id={`sofraco-code_${item._id}`}
                                                            name={`sofraco-code`}
                                                            placeholder={item.code}
                                                            defaultValue={item.code}
                                                            autoComplete="code"
                                                            className="sofraco-input"
                                                        />
                                                    </CFormGroup>
                                                    <CFormGroup>
                                                        <CInput
                                                            type="submit"
                                                            name="sofraco-submit"
                                                            value="Enregistrer les modifications"
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
                            // 'delete':
                            //     (item, index) => {
                            //         return (
                            //             <td className="py-2">
                            //                 <CButton
                            //                     color="danger"
                            //                     variant="outline"
                            //                     shape="square"
                            //                     size="sm"
                            //                     onClick={(e) => { this.deleteCorrespondance(e, item) }}
                            //                 >
                            //                     Delete
                            //                 </CButton>
                            //             </td>
                            //         )
                            //     },
                        }
                        }
                    />
                )}
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

export default Correspondance;
