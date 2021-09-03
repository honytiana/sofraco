import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CTooltip,
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
            messageToast: {}
        }
        this.token = JSON.parse(localStorage.getItem('token'));
        this.fetchDocumentsCompanyByYearAndMonth = this.fetchDocumentsCompanyByYearAndMonth.bind(this);
        this.fetchDocumentsCompany = this.fetchDocumentsCompany.bind(this);
        this.fetchCompany = this.fetchCompany.bind(this);
    }

    componentDidMount() {
        this.setState({
            toast: false,
            messageToast: {}
        });
        this.fetchCompany();
        this.fetchDocumentsCompany();
        this.fetchDocumentsCompanyByYearAndMonth();
    }

    componentDidUpdate() {

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
                    'Authorization': `Bearer ${this.token.token}`
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
                'Authorization': `Bearer ${this.token.token}`
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
        const months = [
            { month: 'Janvier', index: 1 },
            { month: 'Février', index: 2 },
            { month: 'Mars', index: 3 },
            { month: 'Avril', index: 4 },
            { month: 'Mai', index: 5 },
            { month: 'Juin', index: 6 },
            { month: 'Juillet', index: 7 },
            { month: 'Août', index: 8 },
            { month: 'Septembre', index: 9 },
            { month: 'Octobre', index: 10 },
            { month: 'Novembre', index: 11 },
            { month: 'Décembre', index: 12 }
        ];
        let years = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2020; i <= currentYear; i++) {
            years.push(i);
        }
        let archived = [];
        for (let year of years) {
            let documentsPerMonth = [];
            let promises = [];
            for (let month of months) {
                promises.push(
                    axios.get(`${config.nodeUrl}/api/document/company/${this.props.company._id}/year/${year}/month/${month.index}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.token.token}`
                        }
                    })
                        .then((result) => {
                            documentsPerMonth.push({ month: month, documents: result.data });
                        })
                        .catch((err) => {
                            this.setState({
                                toast: true,
                                messageToast: { header: 'ERROR', color: 'danger', message: err }
                            })
                        })
                );
            };
            Promise.all(promises).then(() => {
                archived.push({ year: year, documents: documentsPerMonth });
            })
        }
        this.setState({
            archived
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
                                        companyName={this.props.companyName} />
                                </CTabPane>
                                <CTabPane data-tab="historique">
                                    <Archived
                                        key=""
                                        company={this.props.company}
                                        documents={this.state.documents}
                                        archived={this.state.archived} />
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
