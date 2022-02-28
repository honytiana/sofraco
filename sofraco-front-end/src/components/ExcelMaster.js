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
    CInput
} from '@coreui/react';

import axios from 'axios';

import '../styles/ExcelMaster.css';
import config from '../config.json';

class ExcelMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excelMasters: null,
            companies: [],
            details: [],
            courtier: null,
            loader: false,
            toast: false,
            messageToast: [],
            fields: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchExcelMasters = this.fetchExcelMasters.bind(this);
    }

    componentDidMount() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this.setState({
            fields: [
                {
                    key: 'path',
                    label: 'Fichier',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'edit',
                    label: '',
                    _style: { width: '20%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ]
        });
        this.fetchExcelMasters();
    }

    checkProps() {
        if (this.props.token !== null) {
            this.fetchExcelMasters();
        }
    }

    fetchExcelMasters() {
        const courtier = this.props.courtier;
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/excelMaster/courtier/${courtier._id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((res) => {
                this.setState({
                    excelMasters: (res.data) ? res.data : null
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

    deleteExcelMaster(e, correspondance) {
        e.preventDefault();
        axios.delete(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/correspondance/code/courtier/${this.props.courtier._id}/code/${correspondance.code}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le code ${correspondance.code} à été désactivé` }
                });
                this.fetchExcelMasters();
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

    ajouterExcelMaster(event) {
        event.preventDefault();
        this.setState({
            loader: true
        });
        const options = {
            company: event.target['sofraco-company'].value,
            particular: '',
            code: event.target['sofraco-code'].value,
        };
        axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/correspondance/code/courtier/${this.props.courtier._id}`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: `Un code du courtier ${this.props.courtier.cabinet} à été ajouté` }
            });
            this.fetchExcelMasters();
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
                {(this.state.excelMasters !== null) && (
                    <CDataTable
                        items={this.state.excelMasters}
                        fields={this.state.fields}
                        hover
                        sorter
                        border
                        scopedSlots={{
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
                                                Afficher
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
                                            <CModalHeader closeButton>Excel master</CModalHeader>
                                            <CModalBody>
                                                <CForm action="" method="post" >
                                                    <CFormGroup row>
                                                        <CLabel className="col-sm-2" htmlFor={`sofraco-compagnie_${item._id}`}>excel</CLabel>
                                                        <CInput
                                                            type="text"
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
                                }
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

export default ExcelMaster;
