import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CTabContent,
    CTabPane,
    CTabs,
    CNav,
    CNavItem,
    CNavLink
} from '@coreui/react';

import axios from 'axios';

import '../styles/CompanyFolder.css';
import config from '../config.json';
import Upload from './Upload';
import Archived from './Archived';

class CompanyFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: null,
            companySurco: null,
            documents: [],
            archived: [],
            location: props.location,
            files: null,
            filesSurco: null,
            loader: false,
            toast: false,
            messageToast: {},
            token: null
        }
        this.fetchDocumentsCompanyByYearAndMonth = this.fetchDocumentsCompanyByYearAndMonth.bind(this);
        this.fetchDocumentsCompany = this.fetchDocumentsCompany.bind(this);
        this.fetchCompany = this.fetchCompany.bind(this);
    }

    componentDidMount() {
        this.setState({
            toast: false,
            messageToast: {},
            token: this.props.token
        });
        this.fetchCompany();
        this.fetchDocumentsCompany();
        this.fetchDocumentsCompanyByYearAndMonth();
    }

    checkProps() {
        if (this.props.token !== null) {
            this.fetchCompany();
            this.fetchDocumentsCompany();
            this.fetchDocumentsCompanyByYearAndMonth();
        }
    }

    fetchCompany() {
        const company = this.props.company;
        this.setState({
            company: company
        })
        if (company.surco) {
            const companySurco = company.companySurco;
            axios.get(`${config.nodeUrl}/api/company/name/${companySurco}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token.value}`
                }
            })
                .then((res) => {
                    this.setState({
                        companySurco: res.data
                    });
                })
                .catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'ERROR', color: 'danger', message: err }
                    })
                })
        }
    }

    fetchDocumentsCompany() {
        axios.get(`${config.nodeUrl}/api/document/company/${this.props.company._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token.value}`
            }
        })
            .then((result) => {
                this.setState({
                    documents: result.data,
                })
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            });
    }

    fetchDocumentsCompanyByYearAndMonth() {
        axios.get(`${config.nodeUrl}/api/document/company/${this.props.company._id}/year/month`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token.value}`
            }
        })
            .then((result) => {
                this.setState({
                    archived: result.data
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            });
    }

    render() {
        return (
            <div>
                <CModal
                    show={this.props.showModal}
                    onClose={this.props.onCloseModal}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>{this.props.companyName}</CModalHeader>
                    <CModalBody>
                        <CTabs activeTab="upload">
                            <CNav variant="tabs">
                                <CNavItem>
                                    <CNavLink data-tab="upload">
                                        Upload
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink data-tab="historique">
                                        Historique
                                    </CNavLink>
                                </CNavItem>
                            </CNav>
                            <CTabContent>
                                <CTabPane data-tab="upload">
                                    <Upload
                                        key=""
                                        company={this.props.company}
                                        companyName={this.props.companyName}
                                        token={this.props.token}
                                    />
                                </CTabPane>
                                <CTabPane data-tab="historique">
                                    <Archived
                                        key=""
                                        company={this.props.company}
                                        documents={this.state.documents}
                                        archived={this.state.archived}
                                        token={this.props.token}
                                    />
                                </CTabPane>
                            </CTabContent>
                        </CTabs>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            color="secondary"
                            onClick={this.props.onCloseModal}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
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

export default CompanyFolder;
