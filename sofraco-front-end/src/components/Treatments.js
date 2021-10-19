import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CBadge,
    CButton,
    CInputCheckbox,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSelect
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
            messageToast: null,
            month: null,
            year: null,
            token: null
        }
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onCheckHandler = this.onCheckHandler.bind(this);
        this.onCheckAllHandler = this.onCheckAllHandler.bind(this);
        this.onSendMailHandler = this.onSendMailHandler.bind(this);
        this.onChangeSelectFilterYearHandler = this.onChangeSelectFilterYearHandler.bind(this);
        this.onChangeSelectFilterMonthHandler = this.onChangeSelectFilterMonthHandler.bind(this);

    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.get(`${config.nodeUrl}/api/token/user/${user}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                this.setState({
                    fields: [
                        {
                            key: 'check',
                            label: <input type="checkbox" onChange={(e) => this.onCheckAllHandler(e)} />,
                            _style: { width: '10%' },
                            _classes: ['text-center'],
                            sorter: false,
                            filter: false
                        },
                        {
                            key: 'cabinet',
                            label: 'Cabinet',
                            _style: { width: '30%' },
                            _classes: ['text-center']
                        },
                        {
                            key: 'firstName',
                            label: 'Prénom',
                            _style: { width: '15%' },
                            _classes: ['text-center']
                        },
                        {
                            key: 'lastName',
                            label: 'Nom',
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
                            key: 'status',
                            label: 'Status',
                            _style: { width: '10%' },
                            _classes: ['text-center']
                        },
                        // {
                        //     key: 'show_details',
                        //     label: '',
                        //     _style: { width: '10%' },
                        //     _classes: ['text-center'],
                        //     sorter: false,
                        //     filter: false
                        // }
                    ],
                    toast: false,
                    messageToast: [],
                    token: res.data,
                });
                axios.get(`${config.nodeUrl}/api/courtier`, {
                    headers: {
                        'Authorization': `Bearer ${this.state.token.value}`
                    }
                })
                    .then((data) => {
                        return data.data
                    })
                    .then((data) => {
                        const checked = data.map(element => {
                            return {
                                courtier: element._id,
                                cabinet: element.cabinet,
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
            })
            .catch((err) => {
                console.log(err);
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

    onCheckHandler(e, item) {
        this.state.checked.forEach((element, index) => {
            if (element.firstName === item.firstName && element.lastName === item.lastName) {
                let newChecked = this.state.checked.slice();
                newChecked[index].checked = !this.state.checked[index].checked;
                this.setState({
                    checked: newChecked,
                });
            }
        })
    }

    onCheckAllHandler(e) {
        this.state.checked.forEach((element, index) => {
            let newChecked = this.state.checked.slice();
            newChecked[index].checked = (e.target.checked) ? true : false;
            this.setState({
                checked: newChecked
            });
        });
        for (let element of document.getElementsByClassName('sofraco-checkbox')) {
            element.checked = !element.checked;
        }
    }

    onSendMailHandler() {
        if (this.state.month === null || this.state.year === null) {
            let mt = this.state.messageToast.slice();
            mt.push({
                header: 'ERROR',
                color: 'danger',
                message: 'Veuillez selectionner le mois et l\'année'
            });
            this.setState({
                toast: true,
                messageToast: mt
            });
        } else {
            let mailPromises = [];
            for (let courtier of this.state.checked) {
                if (courtier.checked) {
                    const options = {
                        courtier: courtier.courtier,
                        email: courtier.email,
                        firstName: courtier.firstName,
                        lastName: courtier.lastName,
                        month: this.state.month,
                        year: this.state.year
                    };
                    mailPromises.push(
                        axios.post(`${config.nodeUrl}/api/mailer/`, options, {
                            headers: {
                                'Authorization': `Bearer ${this.state.token.value}`
                            }
                        })
                            .then((data) => {
                            }).catch((err) => {
                            }).finally(() => {
                            })
                    );
                }

            }
            Promise.all(mailPromises)
                .then(() => {
                    this.setState({
                        toast: true,
                        messageToast: {
                            header: 'SUCCESS',
                            color: 'success',
                            message: `Les emails ont été envoyé aux courtiers`
                        }
                    });
                })
                .catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: {
                            header: 'ERROR',
                            color: 'danger',
                            message: err
                        }
                    })
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: {}
                        })
                    }, 10000)
                });
        }
    }

    onChangeSelectFilterMonthHandler(e) {
        console.log(e.target.value);
        this.setState({
            month: e.target.value
        });
    }

    onChangeSelectFilterYearHandler(e) {
        console.log(e.target.value);
        this.setState({
            year: e.target.value
        });
    }

    render() {
        const months = [
            { month: 'Janvier', index: 1 },
            { month: 'Février', index: 2 },
            { month: 'Mars', index: 3 },
            { month: 'Avril', index: 4 },
            { month: 'Mai', index: 5 },
            { month: 'Juin', index: 6 },
            { month: 'Juillet', index: 7 },
            { month: 'Août', index: 8 },
            { month: 'Septembre', index: 9 },
            { month: 'Octobre', index: 10 },
            { month: 'Novembre', index: 11 },
            { month: 'Décembre', index: 12 }
        ];
        let years = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2020; i <= currentYear; i++) {
            years.push(i);
        }

        return (
            <div>
                <div className="sofraco-content-filtre">
                    <CSelect
                        label="Année"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterYearHandler(e)}
                        style={{display: "inline-block"}}
                    >
                        <option>Selectionnez une année</option>
                        {years.map((year, index) => {
                            return (
                                <option key={`yearoption${index}`} value={year}>{year}</option>
                            )
                        })}
                    </CSelect>
                    <CSelect
                        label="Mois"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterMonthHandler(e)}
                        style={{display: "inline-block"}}
                    >
                        <option>Selectionnez le mois</option>
                        {months.map((month, index) => {
                            return (
                                <option key={`monthoption${index}`} value={month.index}>{month.month}</option>
                            )
                        })}
                    </CSelect>
                </div>
                <CDataTable
                    items={this.state.checked}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Recherche', placeholder: '...' }}
                    itemsPerPageSelect={{ label: 'Nombre de courtiers par page' }}
                    itemsPerPage={20}
                    hover
                    sorter
                    pagination={{ className: 'sofraco-pagination' }}
                    size={'sm'}
                    scopedSlots={{
                        'check':
                            (item, index) => {
                                return (
                                    <td className="text-center" >
                                        <CInputCheckbox type="checkbox" checked={item.checked} id={`courtier${index}`} key="" className="sofraco-checkbox" onChange={(e) => {
                                            this.onCheckHandler(e, item, index)
                                        }} />
                                    </td>
                                )
                            },
                        'status':
                            (item) => (
                                <td className="text-center" >
                                    <CBadge color={this.getBadge(item.status)}>
                                        {item.status}
                                    </CBadge>
                                </td>
                            ),
                        // 'show_details':
                        //     (item, index) => {
                        //         return (
                        //             <td className="py-2">
                        //                 <CButton
                        //                     color="warning"
                        //                     variant="outline"
                        //                     shape="square"
                        //                     size="sm"
                        //                     onClick={() => { this.toggleDetails(index) }}
                        //                 >
                        //                     {this.state.details.includes(index) ? 'Cacher' : 'Afficher'}
                        //                 </CButton>
                        //             </td>
                        //         )
                        //     },
                        // 'details':
                        //     (item, index) => {
                        //         return (
                        //             <CCollapse show={this.state.details.includes(index)}>
                        //                 <CCardBody>
                        //                     <h4>
                        //                         {item.firstName}
                        //                     </h4>
                        //                 </CCardBody>
                        //             </CCollapse>
                        //         )
                        //     }
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
                                        color={toast.color}
                                    >
                                        <CToastHeader closeButton>
                                            {toast.header}
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
