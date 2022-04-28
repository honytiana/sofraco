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

import '../styles/CompanyFolder.css';
import Upload from './Upload';
import Archived from './Archived';
import CompanyService from '../services/company';
import DocumentService from '../services/document';

require('dotenv').config();

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
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.fetchAllDocumentsCompany = this.fetchAllDocumentsCompany.bind(this);
        this.fetchDocumentsCompany = this.fetchDocumentsCompany.bind(this);
        this.handleCompanyFolderCallback = this.handleCompanyFolderCallback.bind(this);
        this.handleCompanyFolderSurcoCallback = this.handleCompanyFolderSurcoCallback.bind(this);
        this.fetchCompany = this.fetchCompany.bind(this);

        this.companyService = new CompanyService();
        this.documentService = new DocumentService();
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({
            toast: false,
            messageToast: {}
        });
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchCompany();
        this._isMounted && this.fetchDocumentsCompany();
        this._isMounted && this.fetchAllDocumentsCompany();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.fetchCompany();
            this._isMounted && this.fetchDocumentsCompany();
            this._isMounted && this.fetchAllDocumentsCompany();
        }
    }

    fetchCompany() {
        const company = this.props.company;
        this.setState({
            company: company
        })
        if (company.surco) {
            const companySurco = company.companySurco;
            this.companyService.getCompanyByName(companySurco, this.props.token)
                .then((res) => {
                    this.setState({
                        companySurco: res
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
        this.documentService.getDocumentsCompany(this.props.company._id, this.props.token)
            .then((result) => {
                this.setState({
                    documents: result,
                })
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            });
    }

    fetchAllDocumentsCompany() {
        this.documentService.getDocumentsCompanyByAllYearMonth(this.props.company._id, this.props.token)
            .then((result) => {
                this.setState({
                    archived: result
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            });
    }

    handleCompanyFolderCallback(uploadData) {
        this.props.companyCallback(uploadData);
    }

    handleCompanyFolderSurcoCallback(count) {
        this.props.companySurcoCallback(count);
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
                    <CModalBody className="sofraco-modal-body">
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
                                        companyFolderCallback={this.handleCompanyFolderCallback}
                                        companyFolderSurcoCallback={this.handleCompanyFolderSurcoCallback}
                                        selectedDate={this.props.selectedDate}
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
                            className={'sofraco-button-anuler'}
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
