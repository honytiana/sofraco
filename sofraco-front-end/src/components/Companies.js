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
    CCardHeader,
    CCardFooter,
    CSpinner,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';
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
            loaders: []
        }
        this.toggle = this.toggle.bind(this);

    }

    componentDidMount() {
        axios.get(`${config.nodeUrl}/api/company`)
            .then((data) => {
                return data.data
            })
            .then((companies) => {
                let collapsed = [];
                let loaders = [];
                for (let company of companies) {
                    collapsed.push({ company: company.name, collapse: false });
                    loaders.push({ company: company.name, load: false, excecutionTime: null });
                }
                this.setState({
                    companies: companies,
                    collapsed: collapsed,
                    loaders: loaders
                })
            })
            .catch((err) => {
                console.log(err)
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

    launchTreatments(e) {
        e.preventDefault();
        this.state.loaders.forEach((element, index) => {
            let newLoading = this.state.loaders.slice();
            newLoading[index].load = true;
            this.setState({
                loaders: newLoading,
            });
        })
        axios.put(`${config.nodeUrl}/api/document`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: {
                    header: 'success',
                    message: `Traitement terminé pour ${res.data.company}`
                }
            });
            this.state.loaders.forEach((element, index) => {
                if (element.company === res.data.company) {
                    let newLoading = this.state.loaders.slice();
                    newLoading[index].load = false;
                    newLoading[index].executionTime = res.data.executionTime;
                    this.setState({
                        loaders: newLoading,
                    });
                }
            })
        }).catch((err) => {
            // this.setState({
            //     toast: true,
            //     messageToast: { header: 'error', message: err }
            // })
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


    render() {
        return (
            <CContainer fluid>
                <CRow>
                    {(this.state.companies.length > 0) ? (
                        this.state.companies.map((company, index) => {
                            const loader = this.state.loaders.filter((element, index) => {
                                return element.company === company.name;
                            })[0]
                            return (
                                <CCol key={`${company._id}_Column`} sm="3">
                                    <CCard key={`${company._id}_Card`} onDoubleClick={() => { this.toggleDetails(index) }} >
                                        <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                            <div className="sofraco-container-image">
                                                <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} fluid width={100} />
                                            </div>
                                            {(loader.load) && (
                                                <div>
                                                    <CSpinner color="warning" variant="grow" />
                                                </div>
                                            )}
                                            {(loader.executionTime) && (
                                                <div>
                                                    <p>Traité en : {loader.executionTime}</p>
                                                </div>
                                            )}
                                        </CCardBody>
                                        <CCardFooter key={`${company._id}_CardFooter`}>
                                            {company.name}
                                        </CCardFooter>
                                    </CCard>
                                    <Upload
                                        key={`${company._id}_Upload`}
                                        company={company}
                                        companyName={company.name}
                                        showModal={this.state.details.includes(index)}
                                        onCloseModal={() => { this.toggleDetails(index) }}
                                        loader={this.state.loader}
                                        executionTime={loader.executionTime}
                                    />
                                </CCol>
                            )
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
                    <CButton className="sofraco-button" onClick={(e) => { this.launchTreatments(e) }}>Traiter les fichiers</CButton>
                </div>
                {
                    (this.state.toast === true) && (
                        <CToaster position="bottom-right" >
                            <CToast
                                show={true}
                                fade={true}
                                autohide={5000}
                                color='success'
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
