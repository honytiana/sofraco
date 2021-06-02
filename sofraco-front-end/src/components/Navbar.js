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
                <CNavbar expandable="sm" color="info" >
                    <CToggler inNavbar onClick={() => this.setState({ isOpen: !this.state.isOpen })} />
                    <CNavbarBrand>
                        Sofraco
                    </CNavbarBrand>
                    <CCollapse show={this.state.isOpen} navbar>
                        <CNavbarNav>
                            <CNavLink href='/' >Home</CNavLink>
                            <CDropdown inNav >
                                <CDropdownToggle color="primary">
                                    Compagnies d'assurance
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem href='/compagnies'> Compagnie 1</CDropdownItem>
                                    <CDropdownItem href='/compagnies'> Compagnie 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
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
