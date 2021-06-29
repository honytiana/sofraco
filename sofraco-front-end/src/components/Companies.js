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
    CCardBody
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
            fields: [],
            toast: false,
            messageToast: {}
        }
        this.toggle = this.toggle.bind(this);

    }

    componentDidMount() {
        this.setState({
            fields: [
                {
                    key: 'logo',
                    label: '',
                    _style: { width: '20%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                },
                {
                    key: 'company',
                    label: '',
                    _style: { width: '70%' },
                    _classes: ['text-center'],
                    sorter: true
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ]
        });
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
                    <CCol sm="12">
                        <CAlert className="sofraco-header">
                            Liste des compagnies
                        </CAlert>
                    </CCol>
                </CRow>
                <CDataTable
                    items={this.state.companies}
                    fields={this.state.fields}
                    tableFilter={{ label: 'Filtre', placeholder: 'Filtre' }}
                    itemsPerPageSelect={{ label: 'Nombre de compagnies par page' }}
                    itemsPerPage={10}
                    hover
                    sorter
                    pagination={{ className: 'sofraco-pagination' }}
                    scopedSlots={{
                        'logo':
                            (item, index) => {
                                return (
                                    <td>
                                        <CImg src={`data:image/png;base64,${item.logo}`} fluid width={40} />
                                    </td>
                                )
                            },
                        'company':
                            (item, index) => {
                                return (
                                    <td>
                                        {item.name}
                                    </td>
                                )
                            },
                        'show_details':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color="warning"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                        >
                                            {this.state.details.includes(index) ? 'Cacher' : 'Afficher'}
                                        </CButton>
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CCollapse show={this.state.details.includes(index)}>
                                        <CCardBody>
                                            <Upload company={item._id} companyName={item.name} />
                                        </CCardBody>
                                    </CCollapse>
                                )
                            },
                    }
                    }
                />
                <div>
                    <CButton className="sofraco-button" onClick={() => { this.launchTreatments() }}>Traiter les fichiers</CButton>
                </div>

            </CContainer>
        );
    }
}

export default Companies;
