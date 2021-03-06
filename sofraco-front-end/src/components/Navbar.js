import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CNavbar,
    CToggler,
    CNavbarBrand,
    CCollapse,
    CNavbarNav,
    CNavLink,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CImg
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/Navbar.css';
import sofraco_blanc from '../assets/sofraco_blanc.png';
import TokenService from '../services/token';
import UserService from '../services/user';

require('dotenv').config();

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            user: null,
            interne: false
        }
        this.deconnexion = this.deconnexion.bind(this);

        this.tokenService = new TokenService();
        this.userService = new UserService();

    }

    componentDidMount() {
        const userId = JSON.parse(localStorage.getItem('user'));

        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this.userService.getUser(userId)
            .then((res) => {
                const user = res;
                this.setState({
                    user
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deconnexion() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1');
        if (token) {
            this.tokenService.removeTokenUser(user, token)
                .then((res) => {
                    console.log('Déconnexion');
                    localStorage.clear();
                    document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                    window.location.reload();
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                });
        } else {
            console.log('Déconnexion');
            localStorage.clear();
            document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            window.location.reload();
        }
    }

    render() {
        return (
            <CNavbar expandable="sm" className="sofraco-navbar" fixed="top">
                <CToggler inNavbar onClick={() => this.setState((state) => ({
                    isOpen: !state.isOpen
                }))} />
                <CNavbarBrand href='/home'>
                    <CImg
                        src={sofraco_blanc}
                        fluid
                        className="mb-2"
                        width={110}
                    />
                </CNavbarBrand>
                <CCollapse show={this.state.isOpen} navbar>
                    <CNavbarNav>
                        <CNavLink href='/companies'>Compagnies d'assurance</CNavLink>
                        <CNavLink href='/envoi'>Envoi</CNavLink>
                        <CNavLink href='/treatments'>Traitements</CNavLink>
                    </CNavbarNav>
                    <CNavbarNav className="ml-auto">
                        <CDropdown inNav >
                            <CDropdownToggle>Administration</CDropdownToggle>
                            <CDropdownMenu className="sofraco-dropdown-menu">
                                <CDropdownItem className="sofraco-dropdown-item" href='/courtiers' >Courtiers</CDropdownItem>
                                <CDropdownItem className="sofraco-dropdown-item" href='/clients' >Clients</CDropdownItem>
                                {/* <CDropdownItem className="sofraco-dropdown-item" href='/cabinets' >Cabinets</CDropdownItem> */}
                                <CDropdownItem className="sofraco-dropdown-item" href='/administration' >Administration</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                        <CDropdown inNav >
                            <CDropdownToggle>
                                <CIcon
                                    className={'sofraco-icon-user'}
                                    size='sm'
                                    icon={icon.cilUser} />
                                {(this.state.user !== null) && this.state.user.email}
                            </CDropdownToggle>
                            <CDropdownMenu className="sofraco-dropdown-menu">
                                <CDropdownItem className="sofraco-dropdown-item" onClick={this.deconnexion} >Deconnexion</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CNavbarNav>
                </CCollapse>
            </CNavbar>
        );
    }
}

export default Navbar;
