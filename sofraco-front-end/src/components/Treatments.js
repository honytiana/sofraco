import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CButton,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CModal,
    CModalHeader,
    CModalBody,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CModalFooter
} from '@coreui/react';
import axios from 'axios';

import ListExcelMaster from './ListExcelMaster';
import Correspondance from './Correspondance';
import '../styles/Treatments.css';

require('dotenv').config();

class Treatments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            num: 0,
            interne: false
        }
        this._isMounted = false;
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchCourtiers = this.fetchCourtiers.bind(this);

    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this.setState({
            fields: [
                {
                    key: 'code',
                    label: 'Code',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '25%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
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
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ]
        });
        this._isMounted && this.fetchCourtiers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.fetchCourtiers();
        }
    }

    fetchCourtiers() {
        axios.get(`${(this.state.interne) ? process.env.REACT_APP_NODE_URL_INTERNE : process.env.REACT_APP_NODE_URL_EXTERNE}/api/courtier`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
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
        })
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
                    itemsPerPage={20}
                    hover
                    sorter
                    border
                    size={'sm'}
                    pagination={{ className: 'sofraco-pagination' }}
                    scopedSlots={{
                        'show_details':
                            (item, index) => {
                                return (
                                    <td>
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
                                        className="sofraco-modal-treatment"
                                    >
                                        <CModalHeader closeButton>{item.cabinet}</CModalHeader>
                                        <CModalBody className="sofraco-modal-body">
                                            <CTabs activeTab="excelMaster">
                                                <CNav variant="tabs">
                                                    <CNavItem>
                                                        <CNavLink data-tab="excelMaster">
                                                            Excel Master
                                                        </CNavLink>
                                                    </CNavItem>
                                                    <CNavItem>
                                                        <CNavLink data-tab="code">
                                                            Code courtier
                                                        </CNavLink>
                                                    </CNavItem>
                                                </CNav>
                                                <CTabContent>
                                                    <CTabPane data-tab="excelMaster">
                                                        <ListExcelMaster courtier={item} key={`excelMaster${this.state.num}${item._id}`} sIndex={index} token={this.state.token} />
                                                    </CTabPane>
                                                    <CTabPane data-tab="code">
                                                        <Correspondance courtier={item} key={`correspondance${this.state.num}${item._id}`} sIndex={index} token={this.state.token} add={false} />
                                                    </CTabPane>
                                                </CTabContent>
                                            </CTabs>
                                        </CModalBody>
                                        <CModalFooter>
                                            <CButton
                                                className={'sofraco-button-anuler'}
                                                onClick={() => { this.toggleDetails(index) }}
                                            >Annuler</CButton>
                                        </CModalFooter>
                                    </CModal>
                                )
                            },
                        'code':
                            (item, index) => {
                                return (
                                    <td>
                                        <span>Code {item.firstName}</span>
                                    </td>
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

export default Treatments;
