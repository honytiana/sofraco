import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CRow,
    CCol,
    CImg,
    CButton,
    CCardBody,
    CCard,
    CCardFooter,
    CSpinner,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CBadge,
    CProgress,
    CModal,
    CModalHeader,
    CModalBody,
    CListGroup,
    CListGroupItem,
    CFormGroup,
    CInputGroup,
    CInput,
    CAlert,
    CSelect
} from '@coreui/react';

import axios from 'axios';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import config from '../config.json';
// import config from '../jsConfig';

import '../styles/Companies.css';
import check from '../assets/check.png';
import { millisecondToTime } from '../utils/timeUtil';
import CompanyFolder from './CompanyFolder';


class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            local: false,
            letGenerateEM: true,
            details: [],
            companies: [],
            collapsed: [],
            drafts: [],
            companiesDocuments: [],
            logo: '',
            toast: false,
            messageToast: {},
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            load: false,
            loadGenerateExcelMaster: false,
            showButtonDownload: false,
            elementCover: false,
            executionTime: '',
            message: '',
            progress: 1,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            treatmentTimeMS: 0,
            treatmentTimeStr: null,
            interne: false,
            showErrors: false,
            treatmentErrors: [],
            search: false

        };
        this._isMounted = false;
        this.getCompanies = this.getCompanies.bind(this);
        this.onSearchCompany = this.onSearchCompany.bind(this);
        this.getDraftDocument = this.getDraftDocument.bind(this);
        this.getTreatment = this.getTreatment.bind(this);
        this.toggle = this.toggle.bind(this);
        this.loadingHandler = this.loadingHandler.bind(this);
        this.onValiderHandler = this.onValiderHandler.bind(this);
        this.onGenererExcelsMasters = this.onGenererExcelsMasters.bind(this);
        this.onDownloadExcelMasters = this.onDownloadExcelMasters.bind(this);
        this.closeErrorsModal = this.closeErrorsModal.bind(this);
        this.setSelectMonthYear = this.setSelectMonthYear.bind(this);
        this.fetchDocumentsYearAndMonth = this.fetchDocumentsYearAndMonth.bind(this);
        this.user = JSON.parse(localStorage.getItem('user'));

    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.getCompanies();
        this._isMounted && this.getDraftDocument();
        this._isMounted && this.fetchDocumentsYearAndMonth();
        // this.loadingHandler();
        if (this.state.local) {
            this._isMounted && this.getTreatmentTime();
            setInterval(() => {
                if (this.state.load) {
                    let treatmentTimeMS = this.state.treatmentTimeMS + 1000;
                    let treatmentTimeStr = millisecondToTime(treatmentTimeMS);
                    this.setState({
                        treatmentTimeMS,
                        treatmentTimeStr
                    });
                }
            }, 1000);
            setInterval(() => {
                this._isMounted && this.getTreatment();
            }, 5000);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.getCompanies();
            this._isMounted && this.getDraftDocument();
        }
    }

    getDraftDocument() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then(async (documents) => {
                let drafts = [];
                for (let doc of documents) {
                    const uploadDateMonth = new Date(doc.upload_date).getMonth();
                    const currentMonth = new Date().getMonth();
                    if (uploadDateMonth === currentMonth) {
                        if (doc.status === 'draft' || doc.status === 'processing') {
                            drafts.push(doc);
                        }
                    }
                }
                this.setState({
                    drafts
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    loadingHandler() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((documents) => {
                if (documents.some(element => element.status === 'processing')) {
                    this.setState({
                        load: true,
                        elementCover: true
                    });
                } else {
                    this.setState({
                        load: false
                    });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getCompanies() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((companies) => {
                let collapsed = [];
                for (let company of companies) {
                    collapsed.push({ company: company.name, collapse: false });
                }
                this.setState({
                    companies: companies,
                    collapsed: collapsed,
                })
            })
            .catch((err) => {
                console.log(err)
            });
    }

    fetchDocumentsYearAndMonth() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document/year/${this.state.year}/month/${this.state.month}`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                for (let document of data.data) {
                    axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/${document.company}`, {
                        headers: {
                            'Authorization': `Bearer ${this.state.token}`
                        }
                    })
                        .then((data) => {
                            const companiesDocuments = this.state.companiesDocuments;
                            companiesDocuments.push(data.data);
                            this.setState({
                                companiesDocuments
                            });
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    onSearchCompany(e) {
        this.setState({
            search: true
        });
        if (e.target.value !== '') {
            axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/search/${e.target.value}`, {
                headers: {
                    'Authorization': `Bearer ${this.state.token}`
                }
            })
                .then((data) => {
                    return data.data
                })
                .then((companies) => {
                    if (companies.length > 0) {
                        let collapsed = [];
                        for (let company of companies) {
                            collapsed.push({ company: company.name, collapse: false });
                        }
                        this.setState({
                            companies: companies,
                            collapsed: collapsed,
                        });
                    } else {
                        this.setState({
                            companies: []
                        });
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        } else {
            this._isMounted && this.getCompanies();
            this.setState({
                search: false
            });
        }
    }

    getTreatment() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/treatment/user/${this.user}/status/processing`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((treatment) => {
                if (treatment.treatment) {
                    this.setState({
                        progress: treatment.treatment.progress,
                        load: true,
                        elementCover: true,
                        treatmentTimeMS: treatment.time
                    });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getTreatmentTime() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/treatment/user/${this.user}/status/processing`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((data) => {
                return data.data
            })
            .then((treatment) => {
                const treatmentTime = treatment.time;
                this.setState({
                    treatmentTime,
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    async launchTreatments(e) {
        e.preventDefault();
        this.setState({
            toast: false,
            messageToast: {},
            letGenerateEM: false,
            load: this.state.local ? true : false,
            elementCover: this.state.local ? true : false,
            executionTime: ''
        });
        try {
            const options = {
                user: JSON.parse(localStorage.getItem('user'))
            }
            const res = await axios.put(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document`, options, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.token}`
                }
            });
            let executionTime = res.data.executionTime;
            if (this.state.drafts.length > 0) {
                this.setState({
                    toast: true,
                    messageToast: {
                        header: 'SUCCESS',
                        color: 'success',
                        message: `Traitements terminés`
                    },
                    progress: 0
                });
            } else {
                this.setState({
                    toast: true,
                    messageToast: {
                        header: 'SUCCESS',
                        color: 'success',
                        message: 'Tous les fichiers sont traités'
                    },
                    progress: 0
                });
            }
            if (res.data.errors.length > 0) {
                this.setState({
                    showErrors: true,
                    treatmentErrors: res.data.errors
                });
            }
            this._isMounted && this.getDraftDocument();
            this.setState({
                executionTime,
                load: false
            });
        } catch (err) {
            this.setState({
                toast: true,
                messageToast: {
                    header: 'ERROR',
                    color: 'danger',
                    message: (err && err.response && err.response.data && err.response.data.error) ?
                        err.response.data.error
                        : err.message
                }
            });
            console.log(err);
        } finally {
            this.setState({
                letGenerateEM: true,
            });
            setTimeout(() => {
                this.setState({
                    drafts: [],
                    toast: false,
                    messageToast: {}
                });
            }, 6000);
        }
    }

    toggle(e, index) {
        const collapsed = this.state.collapsed.slice();
        collapsed[index].collapse = !collapsed[index].collapse;
        this.setState((state) => ({
            collapse: !state.collapse,
            collapsed: collapsed
        }));
        e.preventDefault();
    }

    toggleDetails(index) {
        if (!this.state.load) {
            const position = this.state.details.indexOf(index)
            let newDetails = this.state.details.slice()
            if (position !== -1) {
                newDetails.splice(position, 1)
            } else {
                newDetails = [...this.state.details, index]
            }
            this.setState({
                details: newDetails
            });
            this._isMounted && this.getDraftDocument();
        }
    }

    onValiderHandler() {
        this.setState({
            elementCover: false,
            executionTime: '',
            progress: 0,
            load: false,
            treatmentTimeStr: '',
            treatmentTimeMS: 0
        });
    }

    onGenererExcelsMasters() {
        this.setState({
            loadGenerateExcelMaster: true
        });
        const options = {
            userId: JSON.parse(localStorage.getItem('user'))
        }
        axios.post(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/excelMaster`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: {
                        header: 'SUCCESS',
                        color: 'success',
                        message: res.data.message
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                this.setState({
                    loadGenerateExcelMaster: false,
                    showButtonDownload: true
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    onDownloadExcelMasters() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/excelMaster/zip/excels`, {
            headers: {
                'Content-Type': 'application/zip',
                'Authorization': `Bearer ${this.state.token}`
            },
            responseType: 'blob'
        })
            .then((res) => {
                let month = new Date().getMonth();
                month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
                const sofdate = `${month}${new Date().getFullYear()}`;
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${sofdate}.zip`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    handleCompanyCallback = (index, companyFolderData) => {
        if (companyFolderData !== null && !companyFolderData) {
            this.toggleDetails(index);
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: 'Le document a été envoyé vers le serveur' }
            });
        }
    }

    getCheckBadge(company) {
        for (let companyD of this.state.companiesDocuments) {
            if (companyD._id === company._id) {
                return (<CBadge key={`${company._id}_CardBodydraft${this.state.companiesDocuments.indexOf(companyD)}`} ><CImg className="sofraco-img-check" size="sm" src={check}></CImg></CBadge>)
            }
        }
    }

    closeErrorsModal() {
        this.setState({
            showErrors: false
        });
    }

    setSelectMonthYear() {
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
        return { months, years };
    }

    onChangeSelectFilterMonthHandler(e) {
        this.setState({
            month: e.target.value
        });
        this._isMounted && this.getDraftDocument();
        this._isMounted && this.fetchDocumentsYearAndMonth();
    }

    onChangeSelectFilterYearHandler(e) {
        this.setState({
            year: e.target.value
        });
        this._isMounted && this.getDraftDocument();
        this._isMounted && this.fetchDocumentsYearAndMonth();
    }

    render() {
        const { months, years } = this.setSelectMonthYear();
        return (
            <div>
                <CFormGroup className={'sofraco-form-search-group'}>
                    <CInputGroup className={'sofraco-form-search'}>
                        <CInput
                            type="text"
                            id="sofraco-search-company"
                            name="sofraco-search-company"
                            className={'sofraco-input'}
                            placeholder='Recherche'
                            onChange={(e) => { this.onSearchCompany(e) }}
                        />
                        <span className="input-group-append">
                            <CButton className={"btn border sofraco-button-icon-search"} >
                                <CIcon
                                    className={'sofraco-icon-search'}
                                    size="sm"
                                    onClick={(e) => { this.onSearchCompany(e) }}
                                    icon={icon.cilSearch} />
                            </CButton>
                        </span>
                    </CInputGroup>
                </CFormGroup>
                <div className="sofraco-content-filtre">
                    <CSelect
                        label="Mois"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterMonthHandler(e)}
                        defaultValue={new Date().getMonth() + 1}
                    >
                        <option>Selectionnez le mois</option>
                        {months.map((month, index) => {
                            return (
                                <option key={`monthoption${index}`} value={month.index} >{month.month}</option>
                            )
                        })}
                    </CSelect>
                    <CSelect
                        label="Année"
                        className="sofraco-select-filtre"
                        onChange={(e) => this.onChangeSelectFilterYearHandler(e)}
                        defaultValue={new Date().getFullYear()}
                    >
                        <option>Selectionnez une année</option>
                        {years.map((year, index) => {
                            return (
                                <option key={`yearoption${index}`} value={year} >{year}</option>
                            )
                        })}
                    </CSelect>
                </div>
                {(this.state.companies.length > 0) && (
                    <div>
                        <CRow>
                            {this.state.companies.map((company, index) => {
                                if (company.type === 'simple') {
                                    return (
                                        <CCol key={`${company._id}_Column`} sm="3">
                                            {company.is_enabled ? (
                                                <CCard key={`${company._id}_Card`} onDoubleClick={() => { this.toggleDetails(index) }} className="sofraco-company-card">
                                                    <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                                        <div key={`${company._id}_CardBodyDiv`} className="sofraco-container-image">
                                                            <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} alt={`${company.name}`} fluid width={100} />
                                                        </div>
                                                    </CCardBody>
                                                    <CCardFooter className="d-flex justify-content-between" key={`${company._id}_CardFooter`}>
                                                        <div key={`${company._id}_CardFooterdiv`} >{company.globalName}</div>
                                                        {this.getCheckBadge(company)}
                                                    </CCardFooter>
                                                </CCard>) :
                                                <CCard key={`${company._id}_Card`} className="sofraco-company-card-grey">
                                                    <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                                        <div key={`${company._id}_CardBodyDiv`} className="sofraco-container-image">
                                                            <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} alt={`${company.name}`} fluid width={100} />
                                                        </div>
                                                    </CCardBody>
                                                    <CCardFooter className="d-flex justify-content-between" key={`${company._id}_CardFooter`}>
                                                        <div key={`${company._id}_CardFooterdiv`} >{company.globalName}</div>
                                                    </CCardFooter>
                                                </CCard>
                                            }
                                            <CompanyFolder
                                                key={`${company._id}_CompanyFolder`}
                                                company={company}
                                                companyName={company.globalName}
                                                showModal={this.state.details.includes(index)}
                                                companyCallback={(companyFolderData) => { this.handleCompanyCallback(index, companyFolderData) }}
                                                onCloseModal={() => { this.toggleDetails(index) }}
                                                token={this.state.token}
                                                selectedDate={{ month: this.state.month, year: this.state.year }}
                                            />
                                        </CCol>
                                    )
                                }
                                return (<span key={`${company._id}_Span`}></span>);
                            })}
                        </CRow>
                        {(true) && (
                            <div className="sofraco-container-button-traitement">
                                <CButton className="sofraco-button" onClick={(e) => { this.launchTreatments(e) }} disabled={this.state.load}>Traiter les fichiers</CButton>
                            </div>
                        )}
                        <CButton className="sofraco-button" onClick={this.onGenererExcelsMasters} disabled={!this.state.letGenerateEM}>
                            {
                                (!this.state.loadGenerateExcelMaster) ? (
                                    <span>Générer les Excels Masters</span>
                                ) : (
                                    <div>
                                        <p>Génération des Excels Masters en cours</p>
                                        <CSpinner color="warning" ></CSpinner>
                                    </div>
                                )
                            }
                        </CButton>
                    </div>)
                }
                {(this.state.companies.length <= 0 && !this.state.search) && (
                    <div className="sofraco-spinner">
                        <CSpinner
                            color="warning" variant="grow"
                        />
                    </div>
                )}
                {(this.state.companies.length <= 0 && this.state.search) && (
                    <CAlert color='warning'>La compagnie est introuvable</CAlert>
                )}
                {
                    (this.state.showButtonDownload) && (
                        <CButton className="sofraco-button" onClick={this.onDownloadExcelMasters}>Télécharger les Excels Masters</CButton>
                    )
                }
                {(this.state.elementCover) && (
                    <CCard className="sofraco-progress-bar">
                        {(this.state.load) && (
                            <CCardBody>
                                <h4>Traitement en cours</h4>
                                <CProgress animated striped showValue color="warning" value={this.state.progress} className="mb-1 bg-white" />
                                <span>{this.state.treatmentTimeStr}
                                </span>
                            </CCardBody>
                        )}
                        {(this.state.executionTime !== '' && !this.state.load) && (
                            <CCardBody>
                                <h4>Traité en : {this.state.treatmentTimeStr}</h4>
                                <CButton className="sofraco-button" onClick={this.onValiderHandler}>Valider</CButton>
                            </CCardBody>
                        )}
                        {(this.state.message !== '') && (
                            <CCardBody>
                                <h4>{this.state.message}</h4>
                                <CButton className="sofraco-button" onClick={this.onValiderHandler}>Valider</CButton>
                            </CCardBody>
                        )}
                    </CCard>
                )}
                <CModal
                    show={this.state.showErrors}
                    onClose={() => { this.closeErrorsModal() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Erreurs</CModalHeader>
                    <CModalBody className="sofraco-modal-body">
                        <CListGroup>
                            {this.state.treatmentErrors.map((err, i) => {
                                return (
                                    <CListGroupItem key={`${i}_listgroupitemerr`}> {err} </CListGroupItem>
                                )
                            })}
                        </CListGroup>
                    </CModalBody>
                </CModal>
                {(this.state.toast === true) && (
                    <CToaster position="bottom-right" >
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
                                {this.state.messageToast.message}
                            </CToastBody>
                        </CToast>
                    </CToaster>
                )
                }
            </div>
        );
    }
}

export default Companies;
