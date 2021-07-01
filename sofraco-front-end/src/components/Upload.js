import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    CInput,
    CAlert,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CProgress,
    CTooltip,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton
} from '@coreui/react';

import axios from 'axios';
import Dropzone from 'react-dropzone';

import '../styles/Upload.css';
import config from '../config.json';
import closedFolder from '../assets/closed_folder.png';
import openedFolder from '../assets/opened_folder.png';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            location: props.location,
            files: null,
            loader: false,
            toast: false,
            messageToast: {}
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        this.setState({
            toast: false,
            messageToast: {}
        });
        const idCompany = this.props.company;
        axios.get(`${config.nodeUrl}/api/company/${idCompany}`)
            .then((data) => {
                this.setState({
                    company: data.data
                })
                return data;
            })
            .catch((err) => {
                console.log(err)
            });
    }

    componentDidUpdate() {

    }

    onSubmitHandler(event) {
        event.preventDefault();
        this.setState({
            loader: true
        });
        const formData = new FormData();
        formData.append('file', this.state.files);
        formData.append('user', '');
        formData.append('company', JSON.stringify(this.props.companyName));
        axios.post(`${config.nodeUrl}/api/document/send`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'success', message: 'Le document à été envoyé vers le serveur' }
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

    onChangeHandler(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const fileName = file.name;
        const fileNameArray = fileName.split('.');
        const extension = fileNameArray[fileNameArray.length - 1];
        const company = this.props.companyName;
        switch (company.toUpperCase()) {
            case 'APICIL':
                if (extension.toUpperCase() !== 'XLSX') {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'warning', message: 'Vous devez donner un fichier Excel' }
                    });
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: {}
                        });
                    }, 6000);
                }
                break;
            // case 'APREP':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'AVIVA':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'CARDIF':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'ERES':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'GENERALI':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'HODEVA':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            case 'METLIFE':
                if (extension.toUpperCase() !== 'PDF') {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'warning', message: 'Vous devez donner un fichier PDF' }
                    });
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: {}
                        });
                    }, 6000);
                }
                break;
            // case 'SWISSLIFE':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await readPdfMETLIFE(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
        this.setState({
            files: file
        });
        console.log(this.state.files);
    }

    render() {
        return (
            <div>
                <CModal
                    show={this.props.showModal}
                    onClose={this.props.onCloseModal}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>{this.props.companyName}</CModalHeader>
                    <CModalBody>
                        <Dropzone onDrop={(files) => {
                            this.setState({
                                files: files[0]
                            })
                        }}>
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                >
                                    <input
                                        {...getInputProps()}
                                        multiple={false}
                                        onChange={this.onChangeHandler}
                                    />
                                    {
                                        (this.state.files !== null) ? (
                                            <CAlert >
                                                <CImg src={openedFolder} fluid width={100} />
                                                <p>{this.state.files.name}</p>
                                            </CAlert>
                                        ) : (
                                            <CAlert>
                                                <CTooltip content="Glissez et déposez un fichier ou cliquez ici"
                                                    placement="top-end"
                                                >
                                                    <CImg src={closedFolder} fluid width={100} />
                                                </CTooltip>
                                            </CAlert>)
                                    }
                                </div>
                            )}

                        </Dropzone>
                    </CModalBody>
                    <CModalFooter>
                        {
                            (this.state.loader === true) && (
                                <div className="sofraco-loader">
                                    <CProgress
                                        color="dark"
                                        className="mb-1 bg-white sofraco-progress-bar"
                                        value={42}
                                        showValue
                                    />
                                </div>
                            )
                        }
                        <CButton
                            onClick={this.onSubmitHandler}
                            className="sofraco-button"
                        >Envoyer</CButton>{' '}
                        <CButton
                            color="secondary"
                            onClick={this.props.onCloseModal}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
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
                                color={this.state.messageToast.header}
                            >
                                <CToastHeader closeButton>
                                    {this.state.messageToast.header.toUpperCase()}
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

export default Upload;
