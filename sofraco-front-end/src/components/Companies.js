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
    CCollapse
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';
import Upload from './Upload';

class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            collapsed: []
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
        return (
            <div>
                <CContainer fluid>
                    <CRow>
                        <CCol sm="12">
                            <CCard>
                                <CCardHeader>
                                    Liste des compagnies
                                </CCardHeader>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CListGroup>
                        {
                            (this.state.companies.length > 0) ? (
                                this.state.companies.map((company, index) => {
                                    return (
                                        <CCard key={`d${index}`}>
                                            <CListGroupItem color="warning" key={`li${index}`} onClick={(e) => this.toggle(e, index)}>
                                                {company.name}
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
                                <CListGroupItem color="warning" >
                                    No companies
                                </CListGroupItem>
                            )
                        }
                    </CListGroup>
                </CContainer>
            </div>
        );
    }
}

export default Companies;
