import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CRow,
    CCol,
    CContainer,
    CListGroup,
    CListGroupItem,
    CCard,
    CCardHeader,
    CCollapse,
    CImg,
    CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import axios from 'axios';

import config from '../config.json';
import Upload from './Upload';
import '../styles/Companies.css';



class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            collapsed: [],
            logo: ''
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

    render() {
        const images = this.state.companies.map((companies) => {
            return companies.logo
        });
        return (
            <CContainer fluid>
                <CRow>
                    <CCol sm="12">
                        <CAlert className="sofraco-header">
                            Liste des compagnies
                        </CAlert>
                    </CCol>
                </CRow>
                <CListGroup className="sofraco-companies-container">
                    {
                        (this.state.companies.length > 0) ? (
                            this.state.companies.map((company, index) => {
                                return (
                                    <CCard key={`d${index}`} className="sofraco-company-container">
                                        <CListGroupItem className="sofraco-list-companies" key={`li${index}`} onClick={(e) => this.toggle(e, index)}>
                                            <CImg key={`img${index}`} src={`data:image/png;base64,${company.logo}`} fluid width={30} /> {company.name} <CIcon size="sm" name="cil-arrow-bottom" />
                                        </CListGroupItem>
                                        <CCollapse
                                            show={this.state.collapsed[index].collapse}
                                            key={`co${index}`}
                                        >
                                            <Upload key={`upload${index}`} company={company._id} />
                                        </CCollapse>
                                    </CCard>
                                )
                            })
                        ) : (
                            <CListGroupItem color="" >
                                <p>No companies</p>
                            </CListGroupItem>
                        )
                    }
                </CListGroup>
            </CContainer>
        );
    }
}

export default Companies;
