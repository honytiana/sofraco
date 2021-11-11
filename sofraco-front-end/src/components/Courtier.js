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
    CInput
} from '@coreui/react';

import axios from 'axios';

import '../styles/Courtier.css';
import config from '../config.json';

class Courtier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            courtier: null,
            toast: false,
            messageToast: {},
            newP: this.props.newP,
            token: null
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    componentDidMount() {
        this.setState({
            token: this.props.token,
            courtier: this.props.courtier,
            toast: false,
            messageToast: {}
        });
    }

    onSubmitHandler(event) {
        event.preventDefault();
        this.setState({
            loader: true
        });
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
            axios.put(`${config.nodeUrl}/api/courtier/${this.props.courtier._id}`, options, {
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
    }

    render() {
        return (
            <div>
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
