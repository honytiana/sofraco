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
            messageToast: '',
            interne: false
        }
        this.onConnexion = this.onConnexion.bind(this);

    }

    componentDidMount() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
    }

    onConnexion(e) {
        e.preventDefault();
        const options = {
            login: e.target['sofraco-login'].value,
            password: e.target['sofraco-password'].value,
        };
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/api-status`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                const data = res.data;
            });
        axios.post(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/user/login`, options, {
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
            console.log(`expires in : ${data.expiresIn}`);

            setTimeout(() => {
                axios.delete(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/${data.userId}`, {
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

            console.log(`${(this.state.interne) ? config.reactUrlInterne : config.reactUrlExterne}/home`);
            window.location.replace(`${(this.state.interne) ? config.reactUrlInterne : config.reactUrlExterne}/home`);
        }).catch((err) => {
            document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
