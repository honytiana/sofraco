import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CBadge,
    CSelect
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import axios from 'axios';

import '../styles/Courtier.css';
import config from '../config.json';

class Courtier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courtier: props.courtier,
            cabinets: [],
            toast: false,
            messageToast: {},
            newP: this.props.newP,
            emailCopie: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onAddEmailCopie = this.onAddEmailCopie.bind(this);
        this.onEditEmailCopie = this.onEditEmailCopie.bind(this);
        this.onDeleteEmailCopie = this.onDeleteEmailCopie.bind(this);
        this.saveEmailCopie = this.saveEmailCopie.bind(this);
        this.onDeleteStateEmailCopie = this.onDeleteStateEmailCopie.bind(this);
        this.onEditBeforeSaveEmailCopie = this.onEditBeforeSaveEmailCopie.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({
            toast: false,
            messageToast: {},
            courtier: this.props.courtier
        });
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCabinets();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.listCourtierCallback();
    }

    fetchCabinets() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/cabinet`, {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        })
            .then((data) => {
                return data.data
            })
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

    onSubmitHandler(event) {
        event.preventDefault();
        const options = {
            cabinet: event.target['sofraco-cabinet'].value,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            email: event.target['sofraco-email'].value,
            phone: event.target['sofraco-phone'].value
        };
        if (options.cabinet !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.email !== '' ||
            options.phone !== '') {
            axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/${this.props.courtier._id}`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                }
            }).then((res) => {
                this.saveEmailCopie();
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le courtier ${res.data.cabinet} à été modifié` }
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

    saveEmailCopie() {
        for (let email of this.state.emailCopie) {
            const options = {
                emailCopie: email
            };
            if (options.emailCopie !== '') {
                axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/courtier/${this.props.courtier._id}/emailCopie`, options, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.props.token}`
                    }
                }).then((res) => {
                    this.setState({
                        courtier: res.data,
                        toast: true,
                        messageToast: { header: 'SUCCESS', color: 'success', message: `Les emails en copie ont été ajouté au courtier ${res.data.cabinet}` },
                    });
                    this.props.listCourtierCallback();
                }).catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'ERROR', color: 'danger', message: err }
                    })
                }).finally(() => {
                    this.setState({
                        emailCopie: []
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

    onAddEmailCopie(event) {
        event.preventDefault();
        const input = event.target.previousElementSibling;
        const emailCopie = input.value;
        let emails = this.state.emailCopie;
        emails.push(emailCopie);
        this.setState({
            emailCopie: emails
        });
        input.value = '';
    }

    activateEditEmailCopie(event, emailCopie) {
        event.preventDefault();
        event.target.style.display = 'none';
        const input = document.createElement('input');
        input.value = emailCopie;
        input.onblur = (e) => { this.onEditEmailCopie(e, emailCopie, input.value, event.target) };
        input.onfocus = (e) => { this.onFocusEmailCopie(e) };
        input.style.display = 'inline';
        input.style.border = 'none';
        input.style.borderBottom = '1px solid black';
        event.target.parentNode.append(input);
        input.focus();
    }

    activateEditBeforeSaveEmailCopie(event, emailCopie) {
        event.preventDefault();
        event.target.style.display = 'none';
        const input = document.createElement('input');
        input.value = emailCopie;
        input.onblur = (e) => { this.onEditBeforeSaveEmailCopie(e, emailCopie, input.value, event.target) };
        input.onfocus = (e) => { this.onFocusEmailCopie(e) };
        input.style.display = 'inline';
        input.style.border = 'none';
        input.style.borderBottom = '1px solid black';
        event.target.parentNode.append(input);
        input.focus();
    }

    onFocusEmailCopie(event) {
        event.target.style.border = 'none';
        event.target.style.borderBottom = '1px solid #ed7102';
    }

    onEditBeforeSaveEmailCopie(event, oldEmailCopie, emailCopie, badge) {
        event.preventDefault();
        let emails = this.state.emailCopie;
        emails.splice(emails.indexOf(oldEmailCopie), 1, emailCopie);
        this.setState({
            emailCopie: emails
        });
        event.target.style.display = 'none';
        event.target.remove();
        badge.style.display = 'inline';
    }

    onEditEmailCopie(event, oldEmailCopie, emailCopie, badge) {
        event.preventDefault();
        const options = {
            emailCopie,
            oldEmailCopie
        };
        if (options.emailCopie !== '') {
            axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/courtier/${this.props.courtier._id}/emailCopie/edit`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                }
            }).then((res) => {
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.emailCopie} à été modifié` }
                });
                this.props.listCourtierCallback();
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

    onDeleteEmailCopie(event, emailCopie) {
        event.preventDefault();
        const options = {
            emailCopie
        };
        if (options.emailCopie !== '') {
            axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/courtier/${this.props.courtier._id}/emailCopie/delete`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                }
            }).then((res) => {
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.emailCopie} à été supprimé` }
                });
                this.props.listCourtierCallback();
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

    onDeleteStateEmailCopie(event, emailCopie) {
        event.preventDefault();
        let emails = this.state.emailCopie;
        emails.splice(emails.indexOf(emailCopie), 1);
        this.setState({
            emailCopie: emails
        });
    }

    render() {
        return (
            <div className="sofraco-content-courtier">
                <div className="sofraco-form-courtier">
                    <CForm action="" method="post" onSubmit={(e) => this.onSubmitHandler(e)}>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet_${this.props.courtier._id}`}>Cabinet</CLabel>
                            <CSelect
                                id={`sofraco-cabinet_${this.props.courtier._id}`}
                                label="Cabinet"
                                className="sofraco-input"
                                name={`sofraco-cabinet`}
                                defaultValue={this.props.courtier.cabinetRef}
                            >
                                <option>Selectionnez un cabinet</option>
                                {this.state.cabinets.map((cabinet, index) => {
                                    return (
                                        <option key={`cabinetOption${index}`} value={cabinet._id} selected={this.props.courtier.cabinetRef === cabinet._id}>{cabinet.cabinet}</option>
                                    )
                                })}
                            </CSelect>
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-nom_${this.props.courtier._id}`}>Nom</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-nom_${this.props.courtier._id}`}
                                name={`sofraco-nom`}
                                defaultValue={this.props.courtier.lastName}
                                autoComplete="nom"
                                className="sofraco-input"
                            />
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-prenom_${this.props.courtier._id}`}>Prénoms</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-prenom_${this.props.courtier._id}`}
                                name={`sofraco-prenom`}
                                defaultValue={this.props.courtier.firstName}
                                autoComplete="prenom"
                                className="sofraco-input"
                            />
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-email_${this.props.courtier._id}`}>Email</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-email_${this.props.courtier._id}`}
                                name={`sofraco-email`}
                                defaultValue={this.props.courtier.email}
                                autoComplete="email"
                                className="sofraco-input"
                            />
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-email-copie_${this.props.courtier._id}`}>Email en copie</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-email-copie_${this.props.courtier._id}`}
                                name={`sofraco-email-copie`}
                                className="sofraco-input"
                            /><CButton className="sofraco-button-add" onClick={(e) => this.onAddEmailCopie(e)}>+</CButton>
                        </CFormGroup>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-phone_${this.props.courtier._id}`}>Téléphone</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-phone_${this.props.courtier._id}`}
                                name={`sofraco-phone`}
                                defaultValue={this.props.courtier.phone}
                                autoComplete="phone"
                                className="sofraco-input"
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
                </div>
                <div className="sofraco-email-copie">
                    {
                        this.props.courtier.emailCopie.map((ec, index) => {
                            return (
                                <CBadge
                                    key={`badge_${this.props.courtier._id}_${ec}`}
                                    onClick={(e) => { this.activateEditEmailCopie(e, ec) }}>{ec}<CIcon
                                        className={'sofraco-icon-suppr'}
                                        size='sm'
                                        onClick={(e) => { this.onDeleteEmailCopie(e, ec) }}
                                        key={`icn_${this.props.courtier._id}_${ec}`}
                                        icon={icon.cilDelete} /></CBadge>
                            )
                        })
                    }
                    {
                        this.state.emailCopie.map((ec, index) => {
                            return (
                                <CBadge
                                    key={`badge_${index}_${ec}`}
                                    onClick={(e) => { this.activateEditBeforeSaveEmailCopie(e, ec) }}>{ec}
                                    <CIcon
                                        className={'sofraco-icon-suppr'}
                                        onClick={(e) => { this.onDeleteStateEmailCopie(e, ec) }}
                                        size='sm'
                                        key={`icn_${index._id}_${ec}`}
                                        icon={icon.cilDelete} /></CBadge>
                            )
                        })
                    }
                </div>
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

export default Courtier;
