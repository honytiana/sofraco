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
    CBadge
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { freeSet } from '@coreui/icons';
import axios from 'axios';

import '../styles/Courtier.css';
import config from '../config.json';

class Courtier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courtier: props.courtier,
            toast: false,
            messageToast: {},
            newP: this.props.newP,
            token: null,
            interne: false
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onAddEmailCopie = this.onAddEmailCopie.bind(this);
        this.onEditEmailCopie = this.onEditEmailCopie.bind(this);
        this.onDeleteEmailCopie = this.onDeleteEmailCopie.bind(this);
    }

    componentDidMount() {
        this.setState({
            toast: false,
            messageToast: {}
        });
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
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
                    'Authorization': `Bearer ${this.props.token.value}`
                }
            }).then((res) => {
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

    onAddEmailCopie(event) {
        event.preventDefault();
        const input = event.target.previousElementSibling;
        const options = {
            emailCopie: input.value
        };
        if (options.emailCopie !== '') {
            axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/courtier/${this.props.courtier._id}/emailCopie`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token.value}`
                }
            }).then((res) => {
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.emailCopie} à été ajouté au courtier ${res.data.cabinet}` }
                });
                this.props.administrationCallback();
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

    activateEditEmailCopie(event, emailCopie) {
        event.preventDefault();
        event.target.style.display = 'none';
        const input = document.createElement('input');
        input.value = emailCopie;
        input.onblur = (e) => { this.onEditEmailCopie(e, emailCopie, input.value, event.target.id) };
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

    onEditEmailCopie(event, oldEmailCopie, emailCopie, id) {
        event.preventDefault();
        const options = {
            emailCopie,
            oldEmailCopie
        };
        if (options.emailCopie !== '') {
            axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/courtier/courtier/${this.props.courtier._id}/emailCopie/edit`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token.value}`
                }
            }).then((res) => {
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.emailCopie} à été modifié` }
                });
                this.props.administrationCallback();
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                event.preventDefault();
                event.target.style.display = 'none';
                event.target.remove();
                document.getElementById(id).style.display = 'inline';
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
                    'Authorization': `Bearer ${this.props.token.value}`
                }
            }).then((res) => {
                this.setState({
                    courtier: res.data,
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `${options.emailCopie} à été supprimé` }
                });
                this.props.administrationCallback();
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

    render() {
        return (
            <div className="sofraco-content-courtier">
                <div className="sofraco-form-courtier">
                    <CForm action="" method="post" onSubmit={(e) => this.onSubmitHandler(e)}>
                        <CFormGroup row>
                            <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet_${this.props.courtier._id}`}>Cabinet</CLabel>
                            <CInput
                                type="text"
                                id={`sofraco-cabinet_${this.props.courtier._id}`}
                                name={`sofraco-cabinet`}
                                defaultValue={this.props.courtier.cabinet}
                                autoComplete="cabinet"
                                className="sofraco-input"
                            />
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
                                    id={`badge_${ec}_${index}`}
                                    key={`badge_${this.props.courtier._id}_${ec}`}
                                    onClick={(e) => { this.activateEditEmailCopie(e, ec) }}>{ec}<CButton
                                        key={`btn_${this.props.courtier._id}_${ec}`}
                                        size='sm'
                                        onFocus={(e) => { this.onDeleteEmailCopie(e, ec) }}><CIcon
                                            key={`icn_${this.props.courtier._id}_${ec}`}
                                            content={freeSet.cilDelete} /></CButton></CBadge>
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
