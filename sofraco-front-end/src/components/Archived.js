import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CCard,
    CCollapse,
    CCardBody,
    CButton,
    CCardHeader,
    CListGroup,
    CListGroupItem
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
// import axios from 'axios';

import '../styles/Archived.css';
// import config from '../config.json';
import closedFolder from '../assets/closed_folder.png';

class Archived extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
            loader: false,
            toast: false,
            messageToast: {},
            collapseYear: false,
            collapseMonth: false,
            detailsYear: [],
            detailsMonth: [],
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.toggleYear = this.toggleYear.bind(this);
        this.toggleMonth = this.toggleMonth.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate() {

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
        const documents = this.props.documents;
        const archived = this.props.archived;
        return (
            <div>
                {(documents.length > 0 && archived.length > 0) ? (
                    <div>
                        {archived.map((archive, index) => {
                            return (
                                <CCard key={`archivecard_${index}`} className="sofraco-card-archive" >
                                    <CCardHeader key={`archivecardheader_${index}`}>
                                        <CButton
                                            key={`archivebtn_${index}`}
                                            color=""
                                            onClick={(e) => this.toggleYear(e, index)}
                                            className="sofraco-btn-collapse"
                                        >
                                            <CIcon icon={this.state.detailsYear.includes(index) ? icon.cilArrowTop : icon.cilArrowBottom} />
                                        </CButton><CImg src={closedFolder} fluid width={20} />{archive.year}
                                    </CCardHeader>
                                    <CCollapse
                                        key={`archivecollapse_${index}`}
                                        show={this.state.detailsYear.includes(index)}
                                    >
                                        <CCardBody key={`archivecardbody_${index}`} className="sofraco-card-archive-body">
                                            {archive.documents.map((document, i) => {
                                                return (
                                                    document.documents.length > 0 && (
                                                        <CCard key={`documentcard_${i}`} className="sofraco-card-archive">
                                                            <CCardHeader key={`documentcardheader_${i}`}>
                                                                <CButton
                                                                    key={`documentbtn_${i}`}
                                                                    color=""
                                                                    onClick={(e) => this.toggleMonth(e, i)}
                                                                    className="sofraco-btn-collapse"
                                                                >
                                                                    <CIcon icon={this.state.detailsYear.includes(index) ? icon.cilArrowTop : icon.cilArrowBottom} />
                                                                </CButton><CImg src={closedFolder} fluid width={20} />{document.month.month}
                                                            </CCardHeader>
                                                            <CCollapse
                                                                key={`documentcollapse_${i}`}
                                                                show={this.state.detailsMonth.includes(i)}
                                                            >
                                                                <CCardBody key={`documentcardbode_${i}`} className="sofraco-card-archive-body">
                                                                    <CListGroup key={`${i}_listgroupdoc`}>
                                                                        {document.documents.map((doc, j) => {
                                                                            return (
                                                                                <CListGroupItem key={`${j}_listgroupitemdoc`}>{doc.name}</CListGroupItem>
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
                    <span>no archived</span>
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

export default Archived;
