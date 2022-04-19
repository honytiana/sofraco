import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CButton,
    CInputCheckbox,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSelect
} from '@coreui/react';
import axios from 'axios';

import '../styles/Envoi.css';
import CourtierService from '../services/courtier';
import MailerService from '../services/mailer';

require('dotenv').config();

class Envoi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            checked: [],
            courtiersChecked: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: {},
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onCheckHandler = this.onCheckHandler.bind(this);
        this.onCheckAllHandler = this.onCheckAllHandler.bind(this);
        this.onSendMailHandler = this.onSendMailHandler.bind(this);
        this.onChangeSelectFilterYearHandler = this.onChangeSelectFilterYearHandler.bind(this);
        this.onChangeSelectFilterMonthHandler = this.onChangeSelectFilterMonthHandler.bind(this);
        this.setSelectMonthYear = this.setSelectMonthYear.bind(this);
        this.fetchCourtiers = this.fetchCourtiers.bind(this);

        this.courtierService = new CourtierService();
        this.mailerService = new MailerService();

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
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
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
                    key: 'emailCopie',
                    label: 'Autres destinataires',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                }
            ],
        });
        this._isMounted && this.fetchCourtiers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this.fetchCourtiers();
        }
    }

    fetchCourtiers() {
        this.courtierService.getCourtiers(this.state.token)
            .then((data) => {
                const checked = data.map(element => {
                    return {
                        courtier: element._id,
                        cabinet: element.cabinet,
                        email: element.email,
                        emailCopie: element.emailCopie,
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

    onCheckHandler(e, item) {
        this.state.checked.forEach((element, index) => {
            if (element.firstName === item.firstName && element.lastName === item.lastName && element.cabinet === item.cabinet) {
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
        let mailPromises = [];
        for (let courtier of this.state.checked) {
            if (courtier.checked) {
                const options = {
                    courtier: courtier.courtier,
                    email: courtier.email,
                    emailCopie: courtier.emailCopie,
                    firstName: courtier.firstName,
                    lastName: courtier.lastName,
                    month: this.state.month,
                    year: this.state.year
                };
                mailPromises.push(
                    this.mailerService.sendMail(options, this.props.token)
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

    setSelectMonthYear() {
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
        return { months, years };
    }

    render() {
        const { months, years } = this.setSelectMonthYear();
        return (
            <div>
                <div className="sofraco-content-filtre">
                    <CSelect
                        label="Mois"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterMonthHandler(e)}
                        defaultValue={new Date().getMonth() + 1}
                    >
                        <option>Selectionnez le mois</option>
                        {months.map((month, index) => {
                            return (
                                <option key={`monthoption${index}`} value={month.index} >{month.month}</option>
                            )
                        })}
                    </CSelect>
                    <CSelect
                        label="Année"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterYearHandler(e)}
                        defaultValue={new Date().getFullYear()}
                    >
                        <option>Selectionnez une année</option>
                        {years.map((year, index) => {
                            return (
                                <option key={`yearoption${index}`} value={year} >{year}</option>
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
                    border
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
                        'emailCopie':
                            (item, index) => {
                                return (
                                    <td className="text-center" >
                                        {item.emailCopie.map(ec => {
                                            return <span href="#" key={`${ec}-${index}`}>{ec}, </span>
                                        })}
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
                {(this.state.toast === true) && (
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
                                {this.state.messageToast.message}
                            </CToastBody>
                        </CToast>
                    </CToaster>
                )
                }
            </div>
        );
    }

}

export default Envoi;
