import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CButton,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CBadge,
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
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Cabinet.css';
import CabinetService from '../services/cabinet';

require('dotenv').config();

class Cabinet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            cabinets: [],
            cabinet: null,
            cabinetNames: [],
            fields: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            ajoutCabinet: false,
            courtierToDel: null,
            visibleAlert: false,
            interne: false
        }
        this._isMounted = false;
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.activerAjoutCabinet = this.activerAjoutCabinet.bind(this);
        this.ajouterCabinet = this.ajouterCabinet.bind(this);
        this.onAddCabinetName = this.onAddCabinetName.bind(this);
        this.onEditCabinetName = this.onEditCabinetName.bind(this);
        this.onDeleteCabinetName = this.onDeleteCabinetName.bind(this);
        this.saveCabinetName = this.saveCabinetName.bind(this);
        this.onDeleteStateCabinetName = this.onDeleteStateCabinetName.bind(this);
        this.onEditBeforeSaveCabinetName = this.onEditBeforeSaveCabinetName.bind(this);

        this.cabinetService = new CabinetService();
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
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '30%' },
                    _classes: ['text-center']
                },
                {
                    key: 'names',
                    label: 'Autres noms',
                    _style: { width: '30%' },
                    _classes: ['text-center']
                },
                {
                    key: 'description',
                    label: 'Description',
                    _style: { width: '30%' },
                    _classes: ['text-center']
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                },
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
        this._isMounted && this.fetchCabinets();
    }

    activerAjoutCabinet() {
        let activer = this.state.ajoutCabinet;
        this.setState({
            ajoutCabinet: !activer
        });
    }

    ajouterCabinet(event) {
        event.preventDefault();
        const options = {
            cabinet: event.target['sofraco-cabinet-cabinet'].value,
            description: event.target['sofraco-cabinet-description'].value,
        };
        if (options.cabinet !== '' ||
            options.description !== '') {
            this.cabinetService.createCabinet(options, this.state.token)
                .then((res) => {
                    this.saveCabinetName(res._id);
                    this.setState({
                        toast: true,
                        messageToast: { header: 'SUCCESS', color: 'success', message: `Le cabinet ?? ??t?? cr????` }
                    });
                    this.activerAjoutCabinet();
                    event.target['sofraco-cabinet-cabinet'].value = '';
                    event.target['sofraco-cabinet-name'].value = '';
                    event.target['sofraco-cabinet-description'].value = '';
                    this._isMounted && this.fetchCabinets();
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

    editCabinet(event, item) {
        event.preventDefault();
        const options = {
            cabinet: event.target['sofraco-cabinet-cabinet-edit'].value,
            description: event.target['sofraco-cabinet-description-edit'].value,
        };
        this.cabinetService.updateCabinet(item._id, options, this.state.token)
            .then((res) => {
                this.saveCabinetName(item._id);
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le cabinet ?? ??t?? modifi??` }
                });
                this._isMounted && this.fetchCabinets();
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

    saveCabinetName(cabinet) {
        for (let cabinetName of this.state.cabinetNames) {
            const options = {
                cabinetName: cabinetName
            };
            if (options.cabinetName !== '') {
                this.cabinetService.addCabinetName(cabinet, options, this.state.token)
                    .then((res) => {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'SUCCESS', color: 'success', message: `Les emails en copie ont ??t?? ajout?? au courtier ${res.cabinet}` },
                        });
                    }).catch((err) => {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'ERROR', color: 'danger', message: err }
                        })
                    }).finally(() => {
                        this.setState({
                            emailName: []
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
    }

    onAddCabinetName(event) {
        event.preventDefault();
        const input = event.target.previousElementSibling;
        const cabinetName = input.value;
        let cabinetNames = this.state.cabinetNames;
        cabinetNames.push(cabinetName);
        this.setState({
            cabinetNames
        });
        input.value = '';
    }

    activateEditCabinetName(event, cabinetName, cabinet) {
        event.preventDefault();
        event.target.style.display = 'none';
        const input = document.createElement('input');
        input.value = cabinetName;
        input.onblur = (e) => { this.onEditCabinetName(e, cabinetName, cabinet, input.value, event.target) };
        input.onfocus = (e) => { this.onFocusCabinetName(e) };
        input.style.display = 'inline';
        input.style.border = 'none';
        input.style.borderBottom = '1px solid black';
        event.target.parentNode.append(input);
        input.focus();
    }

    activateEditBeforeSaveCabinetName(event, cabinetName) {
        event.preventDefault();
        event.target.style.display = 'none';
        const input = document.createElement('input');
        input.value = cabinetName;
        input.onblur = (e) => { this.onEditBeforeSaveCabinetName(e, cabinetName, input.value, event.target) };
        input.onfocus = (e) => { this.onFocusCabinetName(e) };
        input.style.display = 'inline';
        input.style.border = 'none';
        input.style.borderBottom = '1px solid black';
        event.target.parentNode.append(input);
        input.focus();
    }

    onFocusCabinetName(event) {
        event.target.style.border = 'none';
        event.target.style.borderBottom = '1px solid #ed7102';
    }

    onEditBeforeSaveCabinetName(event, odlCabinetName, cabinetName, badge) {
        event.preventDefault();
        let cabinetNames = this.state.cabinetNames;
        cabinetNames.splice(cabinetNames.indexOf(odlCabinetName), 1, cabinetName);
        this.setState({
            cabinetNames
        });
        event.target.style.display = 'none';
        event.target.remove();
        badge.style.display = 'inline';
    }

    onEditCabinetName(event, odlCabinetName, cabinet, cabinetName, badge) {
        event.preventDefault();
        const options = {
            cabinetName,
            odlCabinetName
        };
        if (options.cabinetName !== '') {
            this.cabinetService.editCabinetName(cabinet._id, options, this.state.token)
                .then((res) => {
                    this.setState({
                        courtier: res,
                        toast: true,
                        messageToast: { header: 'SUCCESS', color: 'success', message: `${options.cabinetName} ?? ??t?? modifi??` }
                    });
                }).catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'ERROR', color: 'danger', message: err }
                    })
                }).finally(() => {
                    event.preventDefault();
                    event.target.style.display = 'none';
                    event.target.remove();
                    badge.style.display = 'inline';
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: {}
                        });
                    }, 6000);
                });
        }
    }

    onDeleteCabinetName(event, cabinetName, cabinet) {
        event.preventDefault();
        const options = {
            cabinetName
        };
        if (options.cabinetName !== '') {
            this.cabinetService.deleteCabinetName(cabinet, options, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.cabinetName} ?? ??t?? supprim??` }
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

    onDeleteStateCabinetName(event, cabinetName) {
        event.preventDefault();
        let cabinetNames = this.state.cabinetNames;
        cabinetNames.splice(cabinetNames.indexOf(cabinetName), 1);
        this.setState({
            cabinetNames
        });
    }

    render() {
        return (
            <div>
                <CModal
                    show={this.state.ajoutCabinet}
                    onClose={() => { this.activerAjoutCabinet() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Cr??er un cabinet</CModalHeader>
                    <CModalBody className="sofraco-modal-body">
                        <CForm action="" method="post" onSubmit={(e) => this.ajouterCabinet(e)}>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofracot-cabinet-cabinet`}>Cabinet</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-cabinet-cabinet`}
                                    name={`sofraco-cabinet-cabinet`}
                                    autoComplete="cabinet"
                                    className={"sofraco-input col-sm-6"}
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-name`}>Autres noms du cabinet</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-cabinet-name`}
                                    name={`sofraco-cabinet-name`}
                                    autoComplete="name"
                                    className={"sofraco-input col-sm-5"}
                                />
                                <CButton
                                    size={'sm'}
                                    className={"sofraco-button-add col-sm-1"}
                                    onClick={(e) => this.onAddCabinetName(e)}>+</CButton>
                                <div className="sofraco-cabinet-copie">
                                    {
                                        this.state.cabinetNames !== null &&
                                        this.state.cabinetNames.map((cabinet, index) => {
                                            return (
                                                <CBadge
                                                    key={`badge_${index}_${cabinet}`}
                                                    onClick={(e) => { this.activateEditBeforeSaveCabinetName(e, cabinet) }}>{cabinet}
                                                    <CIcon
                                                        className={'sofraco-icon-suppr'}
                                                        onClick={(e) => { this.onDeleteStateCabinetName(e, cabinet) }}
                                                        size='sm'
                                                        key={`icn_${index._id}_${cabinet}`}
                                                        icon={icon.cilDelete} /></CBadge>
                                            )
                                        })
                                    }
                                </div>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-description$`}>Description</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-cabinet-description`}
                                    name={`sofraco-cabinet-description`}
                                    autoComplete="description"
                                    className={"sofraco-input col-sm-6"}
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
                            onClick={() => { this.activerAjoutCabinet() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                <CDataTable
                    items={this.state.cabinets}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Recherche', placeholder: '...' }}
                    itemsPerPageSelect={{ label: 'Nombre de cabinets par page' }}
                    itemsPerPage={15}
                    hover
                    sorter
                    border
                    size={'sm'}
                    pagination={{
                        className: 'sofraco-pagination'
                    }}
                    scopedSlots={{
                        'names':
                            (item, index) => {
                                return (
                                    <td className="text-center" >
                                        {item.names && item.names.map((name, i) => {
                                            return <span href="#" key={`${name}-${index}-${i}`}>{name}, </span>
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
                                            <CForm action="" method="post" onSubmit={(e) => this.editCabinet(e, item)}>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofracot-cabinet-cabinet${item._id}`}>Cabinet</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-cabinet-cabinet${item._id}`}
                                                        name={`sofraco-cabinet-cabinet-edit`}
                                                        defaultValue={item.cabinet}
                                                        autoComplete="cabinet"
                                                        className={"sofraco-input col-sm-6"}
                                                    />
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-name${item._id}`}>Autres noms du cabinet</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-cabinet-name${item._id}`}
                                                        name={`sofraco-cabinet-name-edit`}
                                                        className={"sofraco-input col-sm-5"}
                                                    />
                                                    <CButton
                                                        size={'sm'}
                                                        className={"sofraco-button-add col-sm-1"}
                                                        onClick={(e) => this.onAddCabinetName(e)}>+</CButton>
                                                </CFormGroup>
                                                <div className="sofraco-cabinet-copie">
                                                    {
                                                        item.names.map((name, index) => {
                                                            return (
                                                                <CBadge
                                                                    key={`badge_${item._id}_${name}_${index}`}
                                                                    onClick={(e) => { this.activateEditCabinetName(e, name, item._id) }}>{name}<CIcon
                                                                        className={'sofraco-icon-suppr'}
                                                                        size='sm'
                                                                        onClick={(e) => { this.onDeleteCabinetName(e, name, item._id) }}
                                                                        key={`icn_${item._id}_${name}_${index}`}
                                                                        icon={icon.cilDelete} /></CBadge>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        this.state.cabinetNames !== null &&
                                                        this.state.cabinetNames.map((cabinet, index) => {
                                                            return (
                                                                <CBadge
                                                                    key={`badge_${index}_${cabinet}`}
                                                                    onClick={(e) => { this.activateEditBeforeSaveCabinetName(e, cabinet) }}>{cabinet}
                                                                    <CIcon
                                                                        className={'sofraco-icon-suppr'}
                                                                        onClick={(e) => { this.onDeleteStateCabinetName(e, cabinet) }}
                                                                        size='sm'
                                                                        key={`icn_${index._id}_${cabinet}`}
                                                                        icon={icon.cilDelete} /></CBadge>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <CFormGroup row>
                                                    <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-description${item._id}`}>Description</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id={`sofraco-cabinet-description${item._id}`}
                                                        defaultValue={item.description}
                                                        name={`sofraco-cabinet-description-edit`}
                                                        autoComplete="description"
                                                        className={"sofraco-input col-sm-6"}
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
                <CButton className="sofraco-button" onClick={this.activerAjoutCabinet}>Ajouter un cabinet</CButton>
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

export default Cabinet;
