import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CRow,
    CCol,
    CContainer,
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
    CProgress
} from '@coreui/react';

import axios from 'axios';

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
            details: [],
            companies: [],
            collapsed: [],
            drafts: [],
            infoDrafts: [],
            logo: '',
            toast: false,
            messageToast: {},
            load: false,
            loadGenerateExcelMaster: false,
            showButtonDownload: false,
            elementCover: false,
            executionTime: '',
            message: '',
            progress: 1,
            token: null,
            treatmentTimeMS: 0,
            treatmentTimeStr: null,
            interne: false
        }
        this.getCompanies = this.getCompanies.bind(this);
        this.getDraftDocument = this.getDraftDocument.bind(this);
        this.getTreatment = this.getTreatment.bind(this);
        this.checkCompanyOfDraftsDocuments = this.checkCompanyOfDraftsDocuments.bind(this);
        this.toggle = this.toggle.bind(this);
        this.loadingHandler = this.loadingHandler.bind(this);
        this.onValiderHandler = this.onValiderHandler.bind(this);
        this.onGenererExcelsMasters = this.onGenererExcelsMasters.bind(this);
        this.onDownloadExcelMasters = this.onDownloadExcelMasters.bind(this);
        this.user = JSON.parse(localStorage.getItem('user'));

    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.get('https://www.cloudflare.com/cdn-cgi/trace').then((res) => {
            let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
            let ip = res.data.match(ipRegex)[0];
            const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
            this.setState({
                interne: ip.match(regInterne) ? true : false
            });
            axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => {
                    this.setState({
                        token: res.data
                    });
                    this.getCompanies();
                    this.getDraftDocument();
                    // this.loadingHandler();
                    if (this.state.local) {
                        this.getTreatmentTime();
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
                            this.getTreatment();
                        }, 2000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })
            .catch((err) => {
                console.log(err);
            });
    }

    checkProps() {
        if (this.props.token !== null) {
            this.getCompanies();
            this.getDraftDocument();
        }
    }

    getDraftDocument() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document`, {
            headers: {
                'Authorization': `Bearer ${this.state.token.value}`
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
                await this.checkCompanyOfDraftsDocuments();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    async checkCompanyOfDraftsDocuments() {
        const drafts = this.state.drafts;
        let infoDrafts = [];
        for (let draft of drafts) {
            try {
                const result = await axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/${draft.company}`, {
                    headers: {
                        'Authorization': `Bearer ${this.state.token.value}`
                    }
                });
                const company = result.data;
                if (company.type === 'surco') {
                    try {
                        const result = await axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/companySurco/${company.name}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.state.token.value}`
                            }
                        });
                        const companyParent = result.data;
                        const info = { company: companyParent, surco: company, owner: 'surco' };
                        infoDrafts.push(info);
                    } catch (err) {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'ERROR', color: 'danger', message: err }
                        })
                    }
                    continue;
                }
                if (company.surco) {
                    const companySurco = company.companySurco;
                    try {
                        const result = await axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/name/${companySurco}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.state.token.value}`
                            }
                        });
                        const info = { company: company, surco: result.data, owner: 'parent' };
                        infoDrafts.push(info);
                    } catch (err) {
                        this.setState({
                            toast: true,
                            messageToast: { header: 'ERROR', color: 'danger', message: err }
                        })
                    }
                } else {
                    const info = { company: company, surco: null };
                    infoDrafts.push(info);
                }
            } catch (err) {
                console.log(err)
            }
        }
        this.setState({
            infoDrafts
        });

    }

    loadingHandler() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document`, {
            headers: {
                'Authorization': `Bearer ${this.state.token.value}`
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
                'Authorization': `Bearer ${this.state.token.value}`
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

    getTreatment() {
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/treatment/user/${this.user}/status/processing`, {
            headers: {
                'Authorization': `Bearer ${this.state.token.value}`
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
                'Authorization': `Bearer ${this.state.token.value}`
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
                    'Authorization': `Bearer ${this.state.token.value}`
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
            this.getDraftDocument();
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
            this.getDraftDocument();
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
                'Authorization': `Bearer ${this.state.token.value}`
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
                'Authorization': `Bearer ${this.state.token.value}`
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

    render() {
        let companies = [];
        let occurences = [];
        for (let infoDraft of this.state.infoDrafts) {
            if (!companies.includes(infoDraft.company)) {
                companies.push(infoDraft.company);
            }
        }
        for (let company of companies) {
            let count = this.state.infoDrafts.filter((infoDraft, indew) => {
                return infoDraft.company === company;
            }).length;
            if (!company.surco &&
                !occurences.some(o => { return o.company.globalName === company.globalName })
            ) {
                occurences.push({ count, company });
            }
            if (company.surco) {
                if (occurences.some(o => { return o.company.globalName === company.globalName && o.company.surco })) {
                    const newOcc = occurences.slice();
                    for (let i = 0; i < newOcc.length; i++) {
                        if (newOcc[i].company.globalName === company.globalName) {
                            newOcc[i].count = 2;
                        }
                    }
                    occurences = newOcc;
                } else {
                    count = 1;
                    occurences.push({ count, company });
                }
            }
        }
        return (
            <CContainer fluid>
                {(this.state.companies.length > 0) ? (
                    <div>
                        <CRow>
                            {this.state.companies.map((company, index) => {
                                if (company.type === 'simple') {
                                    return (
                                        <CCol key={`${company._id}_Column`} sm="3">
                                            <CCard key={`${company._id}_Card`} onDoubleClick={() => { this.toggleDetails(index) }} className="sofraco-company-card">
                                                <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                                    <div key={`${company._id}_CardBodyDiv`} className="sofraco-container-image">
                                                        <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} alt={`${company.name}`} fluid width={100} />
                                                    </div>
                                                </CCardBody>
                                                <CCardFooter className="d-flex justify-content-between" key={`${company._id}_CardFooter`}>
                                                    <div key={`${company._id}_CardFooterdiv`} >{company.globalName}</div>
                                                    {occurences.map((occ, index) => {
                                                        if (occ.company._id === company._id) {
                                                            if (!company.surco) {
                                                                return (<CBadge key={`${company._id}_CardBodydraft${index}`} ><CImg className="sofraco-img-check" size="sm" src={check}></CImg></CBadge>)
                                                            } else {
                                                                if (occ.count === 1) {
                                                                    return (<CBadge key={`${company._id}_badge${index}`} color="warning">1/2</CBadge>)
                                                                } else {
                                                                    return (<CBadge key={`${company._id}_CardBodydraft${index}`} ><CImg className="sofraco-img-check" size="sm" src={check}></CImg></CBadge>)
                                                                }
                                                            }
                                                        }
                                                    })}
                                                </CCardFooter>
                                            </CCard>
                                            <CompanyFolder
                                                key={`${company._id}_CompanyFolder`}
                                                company={company}
                                                companyName={company.globalName}
                                                showModal={this.state.details.includes(index)}
                                                onCloseModal={() => { this.toggleDetails(index) }}
                                                token={this.state.token}
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
                        <CButton className="sofraco-button" onClick={this.onGenererExcelsMasters} disabled={this.state.load}>
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
                    </div>) :
                    (
                        <div className="sofraco-spinner">
                            <CSpinner
                                color="warning" variant="grow"
                            />
                        </div>
                    )
                }
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

            </CContainer>
        );
    }
}

export default Companies;
