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
    CElementCover
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';
// import config from '../jsConfig';

import Upload from './Upload';
import '../styles/Companies.css';


class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            companies: [],
            collapsed: [],
            logo: '',
            toast: false,
            messageToast: {},
            load: false,
            loadGenerateExcelMaster: false,
            showButtonDownload: false,
            elementCover: false,
            executionTime: '',
            message: ''
        }
        this.toggle = this.toggle.bind(this);
        this.loadingHandler = this.loadingHandler.bind(this);
        this.onValiderHandler = this.onValiderHandler.bind(this);
        this.onGenererExcelsMasters = this.onGenererExcelsMasters.bind(this);
        this.onDownloadExcelMasters = this.onDownloadExcelMasters.bind(this);

    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${config.nodeUrl}/api/company`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
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
        this.loadingHandler();
    }

    loadingHandler() {
        const token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${config.nodeUrl}/api/document`, {
            headers: {
                'Authorization': `Bearer ${token.token}`
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

    launchTreatments(e) {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token'));
        this.setState({
            load: true,
            elementCover: true,
            executionTime: ''
        });
        const options = {
            userId: token.userId
        }
        axios.put(`${config.nodeUrl}/api/document`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            }
        })
            .then((res) => {
                if (typeof res.data !== 'string') {
                    this.setState({
                        toast: true,
                        messageToast: {
                            header: 'SUCCESS',
                            color: 'success',
                            message: `Traitements terminés`
                        }
                    });
                    this.setState({
                        executionTime: res.data.executionTime
                    });
                } else {
                    this.setState({
                        toast: true,
                        messageToast: {
                            header: 'SUCCESS',
                            color: 'success',
                            message: res.data
                        }
                    });
                    this.setState({
                        message: res.data
                    });
                }
                this.loadingHandler();
            }).catch((err) => {
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
            }).finally(() => {
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
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

    onValiderHandler() {
        this.setState({
            elementCover: false,
            executionTime: ''
        });
    }

    onGenererExcelsMasters() {
        const token = JSON.parse(localStorage.getItem('token'));
        this.setState({
            loadGenerateExcelMaster: true
        });
        const options = {
            userId: token.userId
        }
        axios.post(`${config.nodeUrl}/api/excelMaster`, options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`
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
        const token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${config.nodeUrl}/api/excelMaster/zip/excels`, {
            headers: {
                'Content-Type': 'application/zip',
                'Authorization': `Bearer ${token.token}`
            },
            responseType: 'blob'
        })
            .then((res) => {
                let month = new Date().getMonth();
                month = (month + 1 < 10) ? `0${month + 1}` : `${month}`;
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
                // this.setState({
                //     showButtonDownload: false
                // });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    render() {
        return (
            <CContainer fluid>
                <div>
                    <CRow>
                        {(this.state.companies.length > 0) ? (
                            this.state.companies.map((company, index) => {
                                if (company.type === 'simple') {
                                    return (
                                        <CCol key={`${company._id}_Column`} sm="3">
                                            <CCard key={`${company._id}_Card`} onDoubleClick={() => { this.toggleDetails(index) }} >
                                                <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                                    <div className="sofraco-container-image">
                                                        <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} alt={`${company.name}`} fluid width={100} />
                                                    </div>
                                                </CCardBody>
                                                <CCardFooter key={`${company._id}_CardFooter`}>
                                                    {company.globalName}
                                                </CCardFooter>
                                            </CCard>
                                            <Upload
                                                key={`${company._id}_Upload`}
                                                company={company}
                                                companyName={company.globalName}
                                                showModal={this.state.details.includes(index)}
                                                onCloseModal={() => { this.toggleDetails(index) }}
                                                loader={false}
                                            />
                                        </CCol>
                                    )
                                }
                                return (<span key={`${company._id}_Span`}></span>);
                            })) :
                            (
                                <CCol sm="6">
                                    <CCard>
                                        <CCardBody>
                                            Company
                                        </CCardBody>
                                        <CCardFooter>
                                            Company
                                        </CCardFooter>
                                    </CCard>
                                </CCol>
                            )
                        }
                    </CRow>

                    <div className="sofraco-container-button-traitement">
                        <CButton className="sofraco-button" onClick={(e) => { this.launchTreatments(e) }} disabled={this.state.load}>Traiter les fichiers</CButton>
                    </div>
                </div>
                {(this.state.elementCover) && (
                    <CElementCover className="sofraco-element-cover" opacity={0.8}>
                        {(this.state.load) && (
                            <div className="sofraco-element-cover-content">
                                <h3>Traitement en cours</h3>
                                <CSpinner color="warning" ></CSpinner>
                            </div>
                        )}
                        {(this.state.executionTime !== '') && (
                            <div className="sofraco-element-cover-content">
                                <h3>Traité en : {this.state.executionTime}</h3>
                                <CButton className="sofraco-button" onClick={this.onValiderHandler}>Valider</CButton>
                            </div>
                        )}
                        {(this.state.message !== '') && (
                            <div className="sofraco-element-cover-content">
                                <h3>{this.state.message}</h3>
                                <CButton className="sofraco-button" onClick={this.onValiderHandler}>Valider</CButton>
                            </div>
                        )}
                    </CElementCover>
                )}
                <CButton className="sofraco-button" onClick={this.onGenererExcelsMasters}>
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
                {
                    (this.state.showButtonDownload) && (
                        <CButton className="sofraco-button" onClick={this.onDownloadExcelMasters}>Télécharger les Excels Masters</CButton>
                    )
                }

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
