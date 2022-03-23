import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    // CButton,
    // CDataTable,
    // CForm,
    // CFormGroup,
    // CLabel,
    // CInput,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane
} from '@coreui/react';

import axios from 'axios';

import '../styles/ExcelMaster.css';
import config from '../config.json';

class ExcelMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excelMaster: null,
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
        this._isMounted = false;
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchExcelMasters = this.fetchExcelMasters.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
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
                    key: 'value',
                    label: '',
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
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
        this._isMounted && this.fetchExcelMasters();
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.fetchExcelMasters();
        }
    }

    fetchExcelMasters() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/excelMaster/${this.props.excelMaster}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((res) => {
                this.setState({
                    excelMaster: (res.data) ? res.data : null
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
                this._isMounted && this.fetchExcelMasters();
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
            this._isMounted && this.fetchExcelMasters();
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
                {(this.state.excelMaster !== null) && (
                    <CTabs activeTab="courtier">
                        <CNav variant="tabs">
                            {this.state.excelMaster.content.map((c, i) => {
                                return (
                                    <CNavItem
                                        key={`navitem_${i}`}>
                                        <CNavLink
                                            key={`navlink${i}`} data-tab={c.name}>
                                            {c.name}
                                        </CNavLink>
                                    </CNavItem>
                                )
                            })}
                        </CNav>
                        <CTabContent>
                            {this.state.excelMaster.content.map((co, i) => {
                                return (
                                    <CTabPane key={`tabpan_${i}`} data-tab={co.name}>
                                        <table className="table">
                                            {/* <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">First</th>
                                                    <th scope="col">Last</th>
                                                    <th scope="col">Handle</th>
                                                </tr>
                                            </thead> */}
                                            <tbody>
                                                {co.content.map((c, i) => {
                                                    return (
                                                        <tr
                                                            key={`tr${i}`}>
                                                            {
                                                                c.map((con, j) => {
                                                                    let v = null;
                                                                    if (con.value.text) {
                                                                        v = con.value.text;
                                                                    } else if (con.value.result) {
                                                                        v = con.value.result;
                                                                    } else if (con.value.formula) {
                                                                        v = con.value.formula;
                                                                    } else {
                                                                        v = con.value;
                                                                    }
                                                                    return (
                                                                        <td key={`td${j}`}>{v}</td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </CTabPane>
                                )
                            })}
                        </CTabContent>
                    </CTabs>

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
