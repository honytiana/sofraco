import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CImg,
    CForm,
    CCardBody,
    CCard,
    CFormGroup,
    CLabel,
    CInput,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CCardTitle,
    CCardHeader
} from '@coreui/react';
import axios from 'axios';

import sofraco_logo from '../assets/sofraco_groupe_logo.png';
import config from '../config.json';
import '../styles/Access.css';

class Access extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toast: false,
            messageToast: ''
        }
        this.onConnexion = this.onConnexion.bind(this);

    }

    onConnexion(e) {
        e.preventDefault();
        const options = {
            login: e.target['sofraco-login'].value,
            password: e.target['sofraco-password'].value,
        };
        axios.post(`${config.nodeUrl}/api/user/login`, options, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            const data = res.data;
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: 'Vous êtes connecté' }
            });
            // localStorage.setItem('token', JSON.stringify(data));
            localStorage.setItem('user', JSON.stringify(data.userId));

            setTimeout(() => {
                axios.delete(`${config.nodeUrl}/api/token/${data.userId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res) => {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'SUCCESS', color: 'success', message: `Déconnexion` }
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
                localStorage.clear();
            }, data.expiresIn * 3600 * 1000);

            window.location.replace(`${config.reactUrl}/home`);
        }).catch((err) => {
            this.setState({
                toast: true,
                messageToast: { header: 'ERROR', color: 'danger', message: err.response.data.error }
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
            <div className="sofraco-container-connexion">
                <CCard className="sofraco-connexion">
                    <CCardHeader>
                        <CImg
                            src={sofraco_logo}
                            fluid
                            className="mb-2 sofraco-logo-connexion"
                            width={200}
                        />
                    </CCardHeader>
                    <CCardBody>
                        <CForm action="" method="post" onSubmit={(e) => this.onConnexion(e)}>
                            <CFormGroup>
                                <CLabel htmlFor="sofraco-login">Login</CLabel>
                                <CInput
                                    type="text"
                                    id="sofraco-login"
                                    name="sofraco-login"
                                    placeholder="Login"
                                    autoComplete="login"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="sofraco-password">Mot de passe</CLabel>
                                <CInput
                                    type="password"
                                    id="sofraco-password"
                                    name="sofraco-password"
                                    placeholder="Mot de passe"
                                    autoComplete="current-password"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput
                                    type="submit"
                                    id="sofraco-submit"
                                    name="sofraco-submit"
                                    value="Connexion"
                                    className="sofraco-button"
                                />
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                </CCard>
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

export default Access;
