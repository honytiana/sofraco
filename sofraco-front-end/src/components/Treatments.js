import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CBadge,
    CButton,
    CCollapse,
    CCardBody,
    CInputCheckbox,
    CAlert,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody
} from '@coreui/react';
import axios from 'axios';

import '../styles/Treatments.css';
import config from '../config.json';

class Treatments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            checked: [],
            courtiersChecked: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: []
        }
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onCheckHandler = this.onCheckHandler.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.onSendMailHandler = this.onSendMailHandler.bind(this);

    }

    componentDidMount() {
        this.setState({
            fields: [
                { key: 'code', _style: { width: '10%' } },
                { key: 'firstName', _style: { width: '20%' } },
                { key: 'lastName', _style: { width: '20%' } },
                { key: 'email', _style: { width: '20%' } },
                { key: 'status', _style: { width: '10%' } },
                {
                    key: 'check',
                    label: '',
                    _style: { width: '10%' },
                    sorter: false,
                    filter: false
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    sorter: false,
                    filter: false
                }
            ],
            toast: false,
            messageToast: []
        });
        axios.get(`${config.nodeUrl}/api/courtier`)
            .then((data) => {
                this.setState({
                    courtiers: data.data
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getBadge(status) {
        switch (status) {
            case 'Active': return 'success'
            case 'Inactive': return 'secondary'
            case 'Pending': return 'warning'
            case 'Banned': return 'danger'
            default: return 'primary'
        }
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

    onCheckHandler(item, index) {
        if (this.state.checked.length === 0) {
            this.setState((state) => {
                const checked = state.courtiers.map(element => {
                    return { code: element.code, email: element.email, checked: false };
                });
                return { checked };
            }, () => {
                this.updateChecked(item)
            });
        } else {
            this.updateChecked(item);
        }
    }

    updateChecked(item) {
        this.state.checked.forEach((element, index) => {
            if (element.code === item.code) {
                let newChecked = this.state.checked.slice();
                newChecked[index].checked = !this.state.checked[index].checked;
                let newCourtierChecked = this.state.courtiersChecked.slice();
                let obj = { email: item.email, firstName: item.firstName, lastName: item.lastName };
                if (newChecked[index].checked === true) {
                    newCourtierChecked.push(obj);
                } else {
                    newCourtierChecked.splice(newCourtierChecked.indexOf(obj), 1);
                }
                this.setState({
                    checked: newChecked,
                    courtiersChecked: newCourtierChecked
                });
            }
        })
    }

    onSendMailHandler() {
        for (let courtierChecked of this.state.courtiersChecked) {
            const options = {
                user: {
                    email: courtierChecked.email,
                    firstName: courtierChecked.firstName,
                    lastName: courtierChecked.lastName
                }
            };
            axios.post(`${config.nodeUrl}/api/mailer/`, options)
                .then((data) => {
                    let mt = this.state.messageToast.slice();
                    mt.push({
                        header: 'success', message: `Le mail à été envoyé aux courtiers ${data.data.accepted}`
                    });
                    this.setState({
                        toast: true,
                        messageToast: mt
                    });
                }).catch((err) => {
                    let mt = this.state.messageToast.slice();
                    mt.push({ header: 'error', message: err });
                    this.setState({
                        toast: true,
                        messageToast: mt
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: []
                        });
                    }, 10000);
                });
        }
    }

    render() {

        return (
            <div>
                <CDataTable
                    items={this.state.courtiers}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    itemsPerPage={5}
                    hover
                    sorter
                    pagination={{ className: 'sofraco-pagination' }}
                    scopedSlots={{
                        'status':
                            (item) => (
                                <td>
                                    <CBadge color={this.getBadge(item.status)}>
                                        {item.status}
                                    </CBadge>
                                </td>
                            ),
                        'show_details':
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
                                            {this.state.details.includes(index) ? 'Hide' : 'Show'}
                                        </CButton>
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CCollapse show={this.state.details.includes(index)}>
                                        <CCardBody>
                                            <h4>
                                                {item.firstName}
                                            </h4>
                                        </CCardBody>
                                    </CCollapse>
                                )
                            },
                        'check':
                            (item, index) => {
                                return (
                                    <td>
                                        <CInputCheckbox onChange={() => {
                                            this.onCheckHandler(item, index)
                                        }} />
                                    </td>
                                )
                            }
                    }
                    }
                />
                <div className="sofraco-send-mail-button">
                    <CButton
                        size=""
                        className="m-2"
                        onClick={() => this.onSendMailHandler()}
                    >
                        Send mail
                </CButton>
                </div>
                {
                    this.state.courtiersChecked.map((courtier, index) => {
                        return (
                            <CAlert color="warning" closeButton key={index}>
                                Le courtier coché est {courtier.email}
                            </CAlert>
                        )
                    })
                }
                {
                    (this.state.toast === true &&
                        this.state.messageToast.length > 0) && (
                        this.state.messageToast.map((toast, index) => {
                            return (
                                <CToaster position="bottom-right" key={index}>
                                    <CToast
                                        show={true}
                                        fade={true}
                                        autohide={5000}
                                        color={(toast.header === 'success') ? 'success' : 'danger'}
                                    >
                                        <CToastHeader closeButton>
                                            {toast.header.toUpperCase()}
                                        </CToastHeader>
                                        <CToastBody>
                                            {`${toast.message}`}
                                        </CToastBody>
                                    </CToast>
                                </CToaster>
                            )
                        })

                    )
                }
            </div>
        );
    }

}

export default Treatments;
