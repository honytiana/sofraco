import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CButton,
    CCard,
    CCardHeader,
    CImg,
    CCollapse,
    CCardBody,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { freeSet } from '@coreui/icons';

import axios from 'axios';

import '../styles/ListExcelMaster.css';
import config from '../config.json';
import closedFolder from '../assets/closed_folder.png';
import filesUtil from '../utils/filesUtil';

class ListExcelMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excelMasters: [],
            excelMastersFilter: [],
            companies: [],
            details: [],
            courtier: null,
            loader: false,
            toast: false,
            messageToast: {},
            fields: [],
            detailsYear: [],
            detailsMonth: [],
            token: props.token
        }
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchListExcelMasters = this.fetchListExcelMasters.bind(this);
        this.fetchListExcelMasterByYearAndMonth = this.fetchListExcelMasterByYearAndMonth.bind(this);
        this.toggleYear = this.toggleYear.bind(this);
        this.toggleMonth = this.toggleMonth.bind(this);
    }

    componentDidMount() {
        this.setState({
            fields: [
                {
                    key: 'path',
                    label: 'Fichier',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'edit',
                    label: '',
                    _style: { width: '20%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ],
            toast: false,
            messageToast: []
        });
        this.fetchListExcelMasters();
        this.fetchListExcelMasterByYearAndMonth();
    }

    checkProps() {
        if (this.props.token !== null) {
            this.fetchListExcelMasters();
            this.getCompanies();
        }
    }

    fetchListExcelMasters() {
        const courtier = this.props.courtier;
        axios.get(`${config.nodeUrl}/api/excelMaster/courtier/${courtier._id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token.value}`
            }
        })
            .then((res) => {
                this.setState({
                    excelMasters: (res.data) ? res.data : null
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            })
            .finally(() => {
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

    fetchListExcelMasterByYearAndMonth() {
        const courtier = this.props.courtier;
        axios.get(`${config.nodeUrl}/api/excelMaster/courtier/${courtier._id}/year/month/type/excel`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token.value}`
            }
        })
            .then((result) => {
                this.setState({
                    excelMastersFilter: (result.data) ? result.data : null
                });
            })
            .catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            });
    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    deleteListExcelMaster(e, correspondance) {
        e.preventDefault();
        axios.delete(`${config.nodeUrl}/api/correspondance/code/courtier/${this.props.courtier._id}/code/${correspondance.code}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token.value}`
            }
        })
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le code ${correspondance.code} à été désactivé` }
                });
                this.fetchListExcelMasters();
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
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

    toggleYear(e, index) {
        e.preventDefault();
        const position = this.state.detailsYear.indexOf(index)
        let newDetails = this.state.detailsYear.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...this.state.detailsYear, index]
        }
        this.setState({
            detailsYear: newDetails
        });
    }

    toggleMonth(e, index) {
        e.preventDefault();
        const position = this.state.detailsMonth.indexOf(index)
        let newDetails = this.state.detailsMonth.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...this.state.detailsMonth, index]
        }
        this.setState({
            detailsMonth: newDetails
        });
    }

    render() {
        return (
            <div>
                {(this.state.excelMasters.length > 0 && this.state.excelMastersFilter.length > 0) ? (
                    <div>
                        {this.state.excelMastersFilter.map((excelMaster, index) => {
                            return (
                                <CCard key={`excelMastercard_${index}`} className="sofraco-card-archive" >
                                    <CCardHeader key={`excelMastercardheader_${index}`}>
                                        <CButton
                                            key={`excelMasterbtn_${index}`}
                                            color=""
                                            onClick={(e) => this.toggleYear(e, index)}
                                            className="sofraco-btn-collapse"
                                        >
                                            <CIcon content={this.state.detailsYear.includes(index) ? freeSet.cilArrowTop : freeSet.cilArrowBottom} />
                                        </CButton><CImg src={closedFolder} fluid width={20} />{excelMaster.year}
                                    </CCardHeader>
                                    <CCollapse
                                        key={`excelMastercollapse_${index}`}
                                        show={this.state.detailsYear.includes(index)}
                                    >
                                        <CCardBody key={`excelMastercardbody_${index}`} className="sofraco-card-archive-body">
                                            {excelMaster.excelMaster.map((ex, i) => {
                                                return (
                                                    ex.excelMaster.length > 0 && (
                                                        <CCard key={`excard_${i}`} className="sofraco-card-archive">
                                                            <CCardHeader key={`excardheader_${i}`}>
                                                                <CButton
                                                                    key={`exbtn_${i}`}
                                                                    color=""
                                                                    onClick={(e) => this.toggleMonth(e, i)}
                                                                    className="sofraco-btn-collapse"
                                                                >
                                                                    <CIcon content={this.state.detailsYear.includes(index) ? freeSet.cilArrowTop : freeSet.cilArrowBottom} />
                                                                </CButton><CImg src={closedFolder} fluid width={20} />{ex.month.month}
                                                            </CCardHeader>
                                                            <CCollapse
                                                                key={`excollapse_${i}`}
                                                                show={this.state.detailsMonth.includes(i)}
                                                            >
                                                                <CCardBody key={`excardbode_${i}`} className="sofraco-card-archive-body">
                                                                    <CListGroup key={`${i}_listgroupdoc`}>
                                                                        {ex.excelMaster.map((e, j) => {
                                                                            return (
                                                                                <CListGroupItem key={`${j}_listgroupitemdoc`}>{filesUtil.getFileName(e.path)}</CListGroupItem>
                                                                            )
                                                                        })}
                                                                    </CListGroup>
                                                                </CCardBody>
                                                            </CCollapse>
                                                        </CCard>
                                                    )
                                                )
                                            })}
                                        </CCardBody>
                                    </CCollapse>
                                </CCard>
                            )
                        })}
                    </div>
                ) :
                    <span>no excel master</span>
                }
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

export default ListExcelMaster;
