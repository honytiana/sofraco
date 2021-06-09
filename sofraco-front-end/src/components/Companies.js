import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CRow,
    CCol,
    CContainer,
    CListGroup,
    CListGroupItem,
    CCard,
    CCardHeader
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';

class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: []
        }

    }

    componentDidMount() {
        axios.get(`${config.nodeUrl}/api/company`)
            .then((data) => {
                this.setState({
                    companies: data.data
                })
            })
            .catch((err) => {
                console.log(err)
            });
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
                                        <CListGroupItem href={`/upload?name=${company.name}`} color="warning" key={index}>
                                            {company.name}
                                        </CListGroupItem>
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
