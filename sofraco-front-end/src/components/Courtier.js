import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CListGroup,
    CListGroupItem
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
            newP: this.props.newP
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.token = JSON.parse(localStorage.getItem('token'));
    }

    componentDidMount() {
        this.setState({
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
                    'Authorization': `Bearer ${this.token.token}`
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
                {/* <CListGroup>
                    <CListGroupItem color="warning">{this.props.courtier.cabinet}</CListGroupItem>
                    <CListGroupItem color="warning">{this.props.courtier.lastName}</CListGroupItem>
                    <CListGroupItem color="warning">{this.props.courtier.firstName}</CListGroupItem>
                    {this.props.courtier.phone && <CListGroupItem color="warning">{this.props.courtier.phone}</CListGroupItem>}
                    {this.props.courtier.email && <CListGroupItem color="warning">{this.props.courtier.email}</CListGroupItem>}
                </CListGroup> */}
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
