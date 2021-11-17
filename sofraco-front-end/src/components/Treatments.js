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

import ExcelMaster from './ExcelMaster';
import Correspondance from './Correspondance';
import '../styles/Treatments.css';
import config from '../config.json';

class Treatments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            fields: [],
            toast: false,
            messageToast: null,
            month: null,
            year: null,
            token: props.token
        }
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchCourtiers = this.fetchCourtiers.bind(this);

    }

    componentDidMount() {
        this.setState({
            fields: [
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '30%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Prénom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Nom',
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
            ],
            toast: false,
            messageToast: []
        });
        this.fetchCourtiers();
    }

    checkProps() {
        if (this.props.token !== null) {
            this.fetchCourtiers();
        }
    }

    fetchCourtiers() {
        axios.get(`${config.nodeUrl}/api/courtier`, {
            headers: {
                'Authorization': `Bearer ${this.state.token.value}`
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
            details: newDetails
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
                    itemsPerPage={10}
                    hover
                    sorter
                    size={'sm'}
                    pagination={{
                        className: 'sofraco-pagination'
                    }}
                    scopedSlots={{
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
                                            <CTabs activeTab="courtier">
                                                <CNav variant="tabs">
                                                    <CNavItem>
                                                        <CNavLink data-tab="mandataires">
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
                                                    <CTabPane data-tab="mandataires">
                                                        <ExcelMaster courtier={item} key={`excelMaster${this.state.num}${item._id}`} sIndex={index} token={this.state.token} />
                                                    </CTabPane>
                                                    <CTabPane data-tab="code">
                                                        <Correspondance courtier={item} key={`correspondance${this.state.num}${item._id}`} sIndex={index} token={this.state.token} add={false} />
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

export default Treatments;
