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

import '../styles/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

    }

    render() {
        return (
            <div>
                <CNavbar expandable="sm" className="sofraco-navbar">
                    <CToggler inNavbar onClick={() => this.setState((state) => ({
                        isOpen: !state.isOpen
                    }))} />
                    <CNavbarBrand>
                        Sofraco
                    </CNavbarBrand>
                    <CCollapse show={this.state.isOpen} navbar>
                        <CNavbarNav>
                            <CNavLink href='/' >Home</CNavLink>
                            <CNavLink href='/companies'>Compagnies d'assurance</CNavLink>
                            <CNavLink href='/treatments'>Traitements</CNavLink>
                        </CNavbarNav>
                        <CNavbarNav className="ml-auto">
                            <CDropdown inNav >
                                <CDropdownToggle color="primary">
                                    User
                            </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem>Account</CDropdownItem>
                                    <CDropdownItem>Settings</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CNavbarNav>
                    </CCollapse>
                </CNavbar>
            </div>
        );
    }
}

export default Navbar;
