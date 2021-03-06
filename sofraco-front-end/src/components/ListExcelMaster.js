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
    CListGroupItem,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/ListExcelMaster.css';
import closedFolder from '../assets/closed_folder.png';
import filesUtil from '../utils/filesUtil';
import ExcelMaster from './ExcelMaster';
import ExcelMasterService from '../services/excelMaster';

require('dotenv').config();

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
            messageToast: [],
            fields: [],
            detailsYear: [],
            detailsMonth: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchListExcelMasters = this.fetchListExcelMasters.bind(this);
        this.fetchListExcelMasterByYearAndMonth = this.fetchListExcelMasterByYearAndMonth.bind(this);
        this.toggleYear = this.toggleYear.bind(this);
        this.toggleMonth = this.toggleMonth.bind(this);
        this.onDownloadExcelMaster = this.onDownloadExcelMaster.bind(this);
        this.onActivateEditExcelMaster = this.onActivateEditExcelMaster.bind(this);

        this.excelMasterService = new ExcelMasterService();
    }

    componentDidMount() {
        this._isMounted = true;
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
            ]
        });

        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.fetchListExcelMasters();
        this._isMounted && this.fetchListExcelMasterByYearAndMonth();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.fetchListExcelMasters();
        }
    }

    fetchListExcelMasters() {
        const courtier = this.props.courtier;
        this.excelMasterService.getExcelMastersByCourtier(courtier._id, this.props.token)
            .then((res) => {
                this.setState({
                    excelMasters: (res) ? res : null
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
        this.excelMasterService.getExcelMastersByYearMonthV2(courtier._id, 'excel',  this.props.token)
            .then((result) => {
                this.setState({
                    excelMastersFilter: (result) ? result : null
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

    onDownloadExcelMaster(excel) {
        const id = excel._id;
        const fileName = filesUtil.getFileName(excel.path);
        this.excelMasterService.getExcelMasterXlsx(id, this.props.token)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${fileName}.xlsx`);
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

    onActivateEditExcelMaster(excel) {
        const id = excel._id;
        const fileName = filesUtil.getFileName(excel.path);
        this.excelMasterService.getExcelMasterXlsx(id, this.props.token)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${fileName}.xlsx`);
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
        return (
            <div>
                {(this.state.excelMasters.length > 0 && this.state.excelMastersFilter.length > 0) ? (
                    <div>
                        {this.state.excelMastersFilter.map((excelMaster, index) => {
                            return (
                                <CCard key={`excelMastercard_${index}`} className="sofraco-card-archive" >
                                    <CCardHeader key={`excelMastercardheader_${index}`}>
                                        <CIcon
                                            key={`excelMasterbtn_${index}`}
                                            className={'sofraco-arrow-em'}
                                            size='sm'
                                            onClick={(e) => this.toggleYear(e, index)}
                                            icon={this.state.detailsYear.includes(index) ? icon.cilArrowTop : icon.cilArrowBottom} />
                                        <CImg src={closedFolder} fluid width={20} />{excelMaster.year}
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
                                                                <CIcon
                                                                    key={`excelMasterbtn_${index}`}
                                                                    className={'sofraco-arrow-em'}
                                                                    size='sm'
                                                                    onClick={(e) => this.toggleMonth(e, index)}
                                                                    icon={this.state.detailsMonth.includes(index) ? icon.cilArrowTop : icon.cilArrowBottom} /><CImg src={closedFolder} fluid width={20} />{ex.month.month}
                                                            </CCardHeader>
                                                            <CCollapse
                                                                key={`excollapse_${i}`}
                                                                show={this.state.detailsMonth.includes(index)}
                                                            >
                                                                <CCardBody key={`excardbode_${i}`} className="sofraco-card-archive-body">
                                                                    <CListGroup key={`${i}_listgroupdoc`}>
                                                                        {ex.excelMaster.map((e, j) => {
                                                                            return (
                                                                                <div key={`${j}_devcontentdoc`}>
                                                                                    <CListGroupItem key={`${j}_listgroupitemdoc`}>{filesUtil.getFileName(e.path)}
                                                                                        <CIcon
                                                                                            key={`${j}_iconedit`}
                                                                                            className={'sofraco-download-em'}
                                                                                            size='sm'
                                                                                            onClick={() => { this.toggleDetails(e._id) }}
                                                                                            icon={icon.cilPencil} />
                                                                                        <CIcon
                                                                                            key={`${j}_icondown`}
                                                                                            className={'sofraco-download-em'}
                                                                                            size='sm'
                                                                                            onClick={() => { this.onDownloadExcelMaster(e) }}
                                                                                            icon={icon.cilCloudDownload} />
                                                                                        <CModal
                                                                                            key={`emmodal${e._id}`}
                                                                                            show={this.state.details.includes(e._id)}
                                                                                            onClose={() => { this.toggleDetails(e._id) }}
                                                                                            centered={true}
                                                                                            className="sofraco-modal-excelMaster"
                                                                                        >
                                                                                            <CModalHeader
                                                                                                key={`emmodalHeader${e._id}`}
                                                                                                closeButton>{filesUtil.getFileName(e.path)}</CModalHeader>
                                                                                            <CModalBody
                                                                                                key={`emmodalBody${e._id}`}
                                                                                                className={'sofraco-em-modal-body'}>
                                                                                                <ExcelMaster
                                                                                                    excelMaster={e._id}
                                                                                                    key={`em${e._id}`}
                                                                                                    token={this.state.token}
                                                                                                />
                                                                                            </CModalBody>
                                                                                            <CModalFooter key={`emmodalFooter${e._id}`}>
                                                                                                <CButton
                                                                                                    key={`em${e._id}`}
                                                                                                    className={'sofraco-button-anuler'}
                                                                                                    onClick={() => { this.toggleDetails(e._id) }}
                                                                                                >Annuler</CButton>
                                                                                            </CModalFooter>
                                                                                        </CModal>
                                                                                    </CListGroupItem>
                                                                                </div>
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
