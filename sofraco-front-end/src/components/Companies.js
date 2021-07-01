import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CRow,
    CCol,
    CContainer,
    CCollapse,
    CImg,
    CAlert,
    CDataTable,
    CButton,
    CCardBody,
    CCard,
    CCardHeader,
    CCardFooter,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
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
            messageToast: {}
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
                for (let company of companies) {
                    collapsed.push({ company: company.name, collapse: false })
                }
                this.setState({
                    companies: companies,
                    collapsed: collapsed
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

    launchTreatments() {
        axios.post(`${config.nodeUrl}/api/document`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'success', message: 'Traitement terminé' }
            });
        }).catch((err) => {
            this.setState({
                toast: true,
                messageToast: { header: 'error', message: err }
            })
        }).finally(() => {
            this.setState({
                loader: false
            });
            setTimeout(() => {
                this.setState({
                    toast: false,
                    messageToast: {}
                });
            }, 6000);
        });
    }

    render() {
        // const images = this.state.companies.map((companies) => {
        //     return companies.logo
        // });
        return (
            <CContainer fluid>
                <CRow>
                    {(this.state.companies.length > 0) ? (
                        this.state.companies.map((company, index) => {
                            return (
                                <CCol key={`${company._id}_Column`} sm="3">
                                    <CCard key={`${company._id}_Card`} onClick={() => { this.toggleDetails(index) }} >
                                        <CCardBody key={`${company._id}_CardBody`} className="sofraco-card-body" >
                                            <CImg className="sofraco-logo-company" key={`${company._id}_Img`} src={`data:image/png;base64,${company.logo}`} fluid width={100} />
                                        </CCardBody>
                                        <CCardFooter key={`${company._id}_CardFooter`}>
                                            {company.name}
                                        </CCardFooter>
                                    </CCard>
                                    <Upload
                                        key={`${company._id}_Upload`}
                                        company={company._id}
                                        companyName={company.name}
                                        showModal={this.state.details.includes(index)}
                                        onCloseModal={() => { this.toggleDetails(index) }}
                                    />
                                </CCol>
                            )
                        })) :
                        (
                            <CCol sm="6">
                                <CCard>
                                    <CCardHeader>
                                        Header
                                    </CCardHeader>
                                    <CCardBody>
                                        Body.
                                    </CCardBody>
                                    <CCardFooter>
                                        Footer.
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        )
                    }
                </CRow>

                <div className="sofraco-container-button-traitement">
                    <CButton className="sofraco-button" onClick={() => { this.launchTreatments() }}>Traiter les fichiers</CButton>
                </div>

            </CContainer>
        );
    }
}

export default Companies;
