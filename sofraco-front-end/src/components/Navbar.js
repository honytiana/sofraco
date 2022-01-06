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
    CDropdownItem
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';
import '../styles/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            user: null,
            interne: false
        }
        this.deconnexion = this.deconnexion.bind(this);

    }

    componentDidMount() {
        const userId = JSON.parse(localStorage.getItem('user'));

        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? false : true
        });
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                const user = res.data;
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
        axios.delete(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log('Déconnexion');
                localStorage.clear();
                window.location.reload();
            }).catch((err) => {
                console.log('Erreur');
            }).finally(() => {
            });
    }

    render() {
        return (
            <CNavbar expandable="sm" className="sofraco-navbar" fixed="top">
                <CToggler inNavbar onClick={() => this.setState((state) => ({
                    isOpen: !state.isOpen
                }))} />
                <CNavbarBrand>
                    Sofraco
                </CNavbarBrand>
                <CCollapse show={this.state.isOpen} navbar>
                    <CNavbarNav>
                        <CNavLink href='/home' >Home</CNavLink>
                        <CNavLink href='/companies'>Compagnies d'assurance</CNavLink>
                        <CNavLink href='/envoi'>Envoi</CNavLink>
                        <CNavLink href='/treatments'>Traitements</CNavLink>
                    </CNavbarNav>
                    <CNavbarNav className="ml-auto">
                        <CNavLink href='/admin' >Administration</CNavLink>
                        <CDropdown inNav >
                            <CDropdownToggle color="primary">
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
