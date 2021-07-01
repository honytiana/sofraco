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
        this.onCheckAllHandler = this.onCheckAllHandler.bind(this);
        this.onSendMailHandler = this.onSendMailHandler.bind(this);

    }

    componentDidMount() {
        this.setState({
            fields: [
                {
                    key: 'code',
                    label: 'Code courtier',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Nom',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Prénom',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'email',
                    label: 'Email',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'status',
                    label: 'Status',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'check',
                    label: <CInputCheckbox onChange={() => this.onCheckAllHandler()} />,
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                },
                {
                    key: 'show_details',
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
        axios.get(`${config.nodeUrl}/api/courtier`)
            .then((data) => {
                return data.data
            })
            .then((data) => {
                const checked = data.map(element => {
                    return {
                        code: element.code,
                        email: element.email,
                        firstName: element.firstName,
                        lastName: element.lastName,
                        checked: false
                    };
                });
                const courtiers = data;
                this.setState({
                    checked,
                    courtiers
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
        this.state.checked.forEach((element, index) => {
            if (element.code === item.code) {
                let newChecked = this.state.checked.slice();
                newChecked[index].checked = !this.state.checked[index].checked;
                this.setState({
                    checked: newChecked,
                });
            }
        })
    }

    onCheckAllHandler() {
        this.state.checked.forEach((element, index) => {
            let newChecked = this.state.checked.slice();
            newChecked[index].checked = !this.state.checked[index].checked;
            this.setState({
                checked: newChecked
            });
        });
        for (let element of document.getElementsByClassName('sofraco-checkbox')) {
            element.checked = !element.checked;
        }
    }

    onSendMailHandler() {
        for (let courtier of this.state.checked) {
            if (courtier.checked === true) {
                const options = {
                    user: {
                        email: courtier.email,
                        firstName: courtier.firstName,
                        lastName: courtier.lastName
                    }
                };
                axios.post(`${config.nodeUrl}/api/mailer/`, options)
                    .then((data) => {
                        let mt = this.state.messageToast.slice();
                        mt.push({
                            header: 'success', message: `Le mail à été envoyé aux courtiers ${data.data.accepted[0]}`
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
    }

    render() {

        return (
            <div>
                <CDataTable
                    items={this.state.courtiers}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Filtre', placeholder: 'Filtre' }}
                    itemsPerPageSelect={{ label: 'Nombre de courtiers par page' }}
                    itemsPerPage={5}
                    hover
                    sorter
                    pagination={{ className: 'sofraco-pagination' }}
                    scopedSlots={{
                        'status':
                            (item) => (
                                <td className="text-center" >
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
                                            {this.state.details.includes(index) ? 'Cacher' : 'Afficher'}
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
                                    <td className="text-center" >
                                        <CInputCheckbox className="sofraco-checkbox" onChange={() => {
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
                        Envoyer les emails
                    </CButton>
                </div>
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
