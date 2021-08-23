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
            user: null
        }

    }

    componentDidMount() {
        const userId = JSON.parse(localStorage.getItem('token')).userId;
        axios.get(`${config.nodeUrl}/api/user/${userId}`, {
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
    }

    deconnexion() {
        localStorage.clear();
        window.location.reload();
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
