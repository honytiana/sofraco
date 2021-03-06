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
    CCardHeader,
    CInputGroup,
    CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import moment from 'moment';

import sofraco_logo from '../assets/sofraco_groupe_logo.png';
import '../styles/Access.css';
import TokenService from '../services/token';
import UserService from '../services/user';

require('dotenv').config();

class Access extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toast: false,
            messageToast: '',
            interne: false,
            showPass: false,
            valuePass: ''
        }
        this.onConnexion = this.onConnexion.bind(this);
        this.onShowPass = this.onShowPass.bind(this);
        this.getValuePass = this.getValuePass.bind(this);

        this.tokenService = new TokenService();
        this.userService = new UserService();

    }

    componentDidMount() {
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
    }

    onShowPass(e) {
        e.preventDefault();
        this.setState({
            showPass: !this.state.showPass
        });
    }

    getValuePass(e) {
        e.preventDefault();
        this.setState({
            valuePass: e.target.value
        });
    }

    onConnexion(e) {
        e.preventDefault();
        const options = {
            login: e.target['sofraco-login'].value,
            password: e.target['sofraco-password'].value,
        };
        this.tokenService.getApiStatus()
            .then((res) => {
                this.userService.login(options)
                    .then((res) => {
                        const maxAge = moment().add(res.expiresIn * 60 * 60 * 1000);
                        document.cookie = `sofraco_=${res.token.value}; expires=${maxAge}; path=/;`;
                        this.setState({
                            toast: true,
                            messageToast: { header: 'SUCCESS', color: 'success', message: 'Vous ??tes connect??' }
                        });
                        localStorage.setItem('user', JSON.stringify(res.userId));
                        setTimeout(() => {
                            this.tokenService.removeTokenById(res.token._id)
                                .then((res) => {
                                    this.setState({
                                        toast: true,
                                        messageToast: { header: 'SUCCESS', color: 'success', message: `D??connexion` }
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
                        }, res.expiresIn * 3600 * 1000);

                        window.location.pathname = '/home';
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
            });
    }

    render() {
        return (
            <div className="sofraco-container-connexion">
                <CCard className="sofraco-connexion">
                    <CCardHeader className="sofraco-connexion-header">
                        <CImg
                            src={sofraco_logo}
                            fluid
                            className="mb-2 sofraco-logo-connexion"
                            width={200}
                        />
                    </CCardHeader>
                    <CCardBody className="sofraco-connexion-body">
                        <CForm action="" method="post" onSubmit={(e) => this.onConnexion(e)} className="sofraco-connexion-form" >
                            <CFormGroup>
                                <CLabel htmlFor="sofraco-login">Login</CLabel>
                                <CInput
                                    type="text"
                                    id="sofraco-login"
                                    name="sofraco-login"
                                    placeholder="Login"
                                    autoComplete="login"
                                    className="sofraco-input"
                                    required={true}
                                />
                            </CFormGroup>
                            <CFormGroup >
                                <CLabel htmlFor="sofraco-password">Mot de passe</CLabel>
                                <CInputGroup>
                                    <CInput
                                        type={this.state.showPass ? 'text' : 'password'}
                                        id="sofraco-password-pass"
                                        name="sofraco-password"
                                        placeholder="Mot de passe"
                                        autoComplete="current-password"
                                        className="sofraco-input"
                                        defaultValue={this.state.valuePass}
                                        onChange={(e) => { this.getValuePass(e) }}
                                        required={true}
                                    />
                                    <span className="input-group-append">
                                        <CButton className={"btn border sofraco-button-icon-pass"} >
                                            {this.state.showPass &&
                                                <CIcon
                                                    className={'sofraco-icon-pass'}
                                                    size='sm'
                                                    onClick={(e) => { this.onShowPass(e) }}
                                                    icon={icon.cilLockLocked} />}
                                            {!this.state.showPass &&
                                                <CIcon
                                                    className={'sofraco-icon-pass'}
                                                    size='sm'
                                                    onClick={(e) => { this.onShowPass(e) }}
                                                    icon={icon.cilLockUnlocked} />}
                                        </CButton>
                                    </span>
                                </CInputGroup>
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
            </div >
        );
    }
}

export default Access;
