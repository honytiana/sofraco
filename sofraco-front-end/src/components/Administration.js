import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CBadge,
    CButton,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
} from '@coreui/react';
import axios from 'axios';

import '../styles/Administration.css';
import config from '../config.json';
import Courtier from './Courtier';
import Mandataire from './Mandataire';

class Administration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0
        }
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.changeActivePage = this.changeActivePage.bind(this);
        this.fetchCourtiers = this.fetchCourtiers.bind(this);
        this.token = JSON.parse(localStorage.getItem('token'));

    }

    componentDidMount() {
        this.setState({
            fields: [
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Prénom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'email',
                    label: 'Email',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'phone',
                    label: 'Telephone',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'status',
                    label: 'Status',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ],
            toast: false,
            messageToast: []
        });
        this.fetchCourtiers();
    }

    fetchCourtiers() {
        axios.get(`${config.nodeUrl}/api/courtier/role/courtier`, {
            headers: {
                'Authorization': `Bearer ${this.token.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((data) => {
                const courtiers = data;
                this.setState({
                    courtiers
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    toggleDetails(index) {
        const position = this.state.details.indexOf(index)
        let newDetails = this.state.details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...this.state.details, index]
        }
        this.setState({
            details: newDetails,
            num: index
        });
        this.fetchCourtiers();
    }

    changeActivePage(page) {
        this.setState({
            activePage: page
        });
    }

    render() {

        return (
            <div>
                <CDataTable
                    items={this.state.courtiers}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Recherche', placeholder: '...' }}
                    itemsPerPageSelect={{ label: 'Nombre de courtiers par page' }}
                    itemsPerPage={10}
                    hover
                    sorter
                    pagination={{
                        className: 'sofraco-pagination'
                    }}
                    scopedSlots={{
                        'status':
                            (item) => (
                                <td className="text-center" >
                                    <CBadge color={this.getBadge(item.is_enabled)}>
                                        {item.is_enabled ? 'Active' : 'Inactive'}
                                    </CBadge>
                                </td>
                            ),
                        'show_details':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color="warning"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                        >
                                            Afficher
                                        </CButton>
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CModal
                                        show={this.state.details.includes(index)}
                                        onClose={() => { this.toggleDetails(index) }}
                                        centered={true}
                                        className="sofraco-modal"
                                    >
                                        <CModalHeader closeButton>{item.cabinet}</CModalHeader>
                                        <CModalBody>
                                            <CTabs activeTab="mandataires">
                                                <CNav variant="tabs">
                                                    <CNavItem>
                                                        <CNavLink data-tab="courtier">
                                                            Courtier
                                                        </CNavLink>
                                                    </CNavItem>
                                                    <CNavItem>
                                                        <CNavLink data-tab="mandataires">
                                                            Mandataires
                                                        </CNavLink>
                                                    </CNavItem>
                                                </CNav>
                                                <CTabContent>
                                                    <CTabPane data-tab="courtier">
                                                        <Courtier courtier={item} key={this.state.num} />
                                                    </CTabPane>
                                                    <CTabPane data-tab="mandataires">
                                                        <Mandataire courtier={item} key={this.state.num} sIndex={index} />
                                                    </CTabPane>
                                                </CTabContent>
                                            </CTabs>
                                        </CModalBody>
                                        <CModalFooter>
                                            <CButton
                                                color="secondary"
                                                onClick={() => { this.toggleDetails(index) }}
                                            >Annuler</CButton>
                                        </CModalFooter>
                                    </CModal>
                                )
                            }
                    }
                    }
                />
                {
                    (this.state.toast === true &&
                        this.state.messageToast.length > 0) && (
                        this.state.messageToast.map((toast, index) => {
                            return (
                                <CToaster position="bottom-right" key={index}>
                                    <CToast
                                        show={true}
                                        fade={true}
                                        autohide={5000}
                                        color={toast.color}
                                    >
                                        <CToastHeader closeButton>
                                            {toast.header}
                                        </CToastHeader>
                                        <CToastBody>
                                            {`${toast.message}`}
                                        </CToastBody>
                                    </CToast>
                                </CToaster>
                            )
                        })

                    )
                }
            </div>
        );
    }

}

export default Administration;
