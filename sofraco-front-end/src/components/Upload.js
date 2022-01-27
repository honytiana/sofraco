import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CAlert,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CTooltip,
    CButton,
    CSpinner
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
            company: null,
            companySurco: null,
            companySurco2: null,
            location: props.location,
            files: null,
            filesSurco: null,
            filesSurco2: null,
            loader: false,
            toast: false,
            messageToast: {},
            token: null,
            interne: false
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.testExtension = this.testExtension.bind(this);
        this.generateDropzone = this.generateDropzone.bind(this);
        this.setStateFile = this.setStateFile.bind(this);
        this.getCompanySurco = this.getCompanySurco.bind(this);
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                const company = this.props.company;
                this.setState({
                    toast: false,
                    messageToast: {},
                    company: company,
                    token: res.data
                });
                this.getCompanySurco();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    checkProps() {
        if (this.props.token !== null) {
            this.getCompanySurco();
        }
    }

    getCompanySurco() {
        const company = this.props.company;
        if (company.surco) {
            const companySurco = company.companySurco;
            axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/name/${companySurco}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.token.value}`
                }
            })
                .then((res) => {
                    const companySurco = res.data;
                    this.setState({
                        companySurco
                    });
                    if (companySurco.surco) {
                        axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/company/name/${companySurco.companySurco}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${(this.state.token !== null) ? this.state.token.value : this.props.token}`
                            }
                        })
                            .then((res) => {
                                this.setState({
                                    companySurco2: res.data
                                });
                            })
                            .catch((err) => {
                                this.setState({
                                    toast: true,
                                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                                })
                            })
                    }
                })
                .catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'ERROR', color: 'danger', message: err }
                    })
                })
        }
    }

    onSubmitHandler(event) {
        event.preventDefault();
        this.setState({
            loader: true
        });
        const formData = new FormData();
        if (this.state.files !== null) {
            for (let file of this.state.files) {
                formData.append('files', file);
            }
        }
        if (this.state.filesSurco !== null) {
            for (let fileSurco of this.state.filesSurco) {
                formData.append('files', fileSurco);
            }
        }
        if (this.state.filesSurco2 !== null) {
            for (let fileSurco2 of this.state.filesSurco2) {
                formData.append('files', fileSurco2);
            }
        }
        const company = {
            _id: this.props.company._id,
            name: this.props.company.name,
            surco: this.props.company.surco,
        }
        let companySurco;
        if (this.state.companySurco) {
            companySurco = {
                _id: this.state.companySurco._id,
                name: this.state.companySurco.name,
            }
        }
        let companySurco2;
        if (this.state.companySurco2) {
            companySurco2 = {
                _id: this.state.companySurco2._id,
                name: this.state.companySurco2.name,
            }
        }
        formData.append('simple', JSON.stringify((this.state.files !== null) ? true : false));
        formData.append('surco', JSON.stringify((this.state.filesSurco !== null) ? true : false));
        formData.append('surco2', JSON.stringify((this.state.filesSurco2 !== null) ? true : false));
        if (this.state.companySurco !== null && this.state.companySurco.mcms) {
            formData.append('mcms', JSON.stringify(true));
        } else {
            formData.append('mcms', JSON.stringify(false));
        }
        formData.append('user', '');
        formData.append('fileLength', (this.state.files !== null) ? this.state.files.length : 0);
        formData.append('surcoLength', (this.state.filesSurco !== null) ? this.state.filesSurco.length : 0);
        formData.append('company', JSON.stringify(company));
        formData.append('companySurco', JSON.stringify(companySurco));
        formData.append('companySurco2', JSON.stringify(companySurco2));
        axios.post(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/document/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token.value}`
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: 'Le document a été envoyé vers le serveur' }
            });
            this.props.companyFolderCallback(false);
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

    testCompanyName(companyName, extension, files) {
        const company = companyName;
        switch (company.toUpperCase()) {
            case 'APICIL':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'APIVIA':
                this.testExtension(extension, 'PDF', false, false, files);
                break;
            case 'APREP':
                this.testExtension(extension, 'PDF', false, false, files);
                break;
            case 'APREP ENCOURS':
                this.testExtension(extension, 'PDF', true, false, files);
                break;
            // case 'AVIVA':
            //     this.testExtension(extension, 'XLSX', false, false, files);
            //     break;
            case 'AVIVA SURCO':
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'CARDIF':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'LOURMEL':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'CEGEMA':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'ERES':
                this.testExtension(extension, 'PDF', false, false, files);
                break;
            case 'GENERALI':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'HODEVA':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'METLIFE':
                this.testExtension(extension, 'PDF', false, false, files);
                break;
            case 'MIE':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'MIE MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'MIEL MUTUELLE':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'MIEL MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'MILTIS':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'MMA INCITATION':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'MMA ACQUISITION':
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'MMA ENCOURS':
                this.testExtension(extension, 'XLSX', false, true, files);
                break;
            case 'PAVILLON PREVOYANCE':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'PAVILLON MCMS': // MCMS
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'SLADE':
                this.testExtension(extension, 'PDF', false, false, files);
                break;
            case 'SMATIS':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'SMATIS MCMS': // MCMS
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'SPVIE':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            case 'SWISSLIFE SURCO':
                this.testExtension(extension, 'XLSX', true, false, files);
                break;
            case 'UAF LIFE PATRIMOINE':
                this.testExtension(extension, 'XLSX', false, false, files);
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }

    onChangeHandler(event, companyName) {
        event.stopPropagation();
        const files = event.target.files;
        const file = event.target.files[0];
        const fileName = file.name;
        const fileNameArray = fileName.split('.');
        const extension = fileNameArray[fileNameArray.length - 1];
        this.testCompanyName(companyName, extension, files);
    }

    onDropHandler(files, companyName) {
        const file = files[0];
        const fileName = file.name;
        const fileNameArray = fileName.split('.');
        const extension = fileNameArray[fileNameArray.length - 1];
        this.testCompanyName(companyName, extension, files);
    }

    setStateFile(surco, surco2, file) {
        if (!surco && !surco2) {
            this.setState({
                files: file
            });
        }
        if (surco && !surco2) {
            this.setState({
                filesSurco: file
            });
        }
        if (!surco && surco2) {
            this.setState({
                filesSurco2: file
            });
        }
    }

    testExtension(extension, type, surco, surco2, file) {
        if (type === 'PDF') {
            if (extension.toUpperCase() !== 'PDF') {
                this.setState({
                    toast: true,
                    messageToast: { header: 'WARNING', color: 'warning', message: 'Vous devez donner un fichier PDF' }
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            } else {
                this.setStateFile(surco, surco2, file);
            }
        }
        if (type === 'XLSX') {
            if (extension.toUpperCase() !== 'XLSX' && extension.toUpperCase() !== 'XLS' && extension.toUpperCase() !== 'CSV') {
                this.setState({
                    toast: true,
                    messageToast: { header: 'WARNING', color: 'warning', message: 'Vous devez donner un fichier Excel ou CSV' }
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            } else {
                this.setStateFile(surco, surco2, file);
            }
        }
    }

    generateDropzone(company, file) {
        return (
            <Dropzone
                onDrop={(files) => {
                    this.onDropHandler(files, company.name);
                }}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        {...getRootProps()}
                    >
                        <input
                            {...getInputProps()}
                            multiple={(company.mcms) ? true : false}
                            onChange={(event) => { this.onChangeHandler(event, company.name) }}
                        />
                        {
                            (file !== null) ? (
                                <CAlert >
                                    <div>
                                        <CImg src={openedFolder} fluid width={100} />
                                        <p>{company.name}</p>
                                    </div>
                                </CAlert>
                            ) : (
                                <CAlert>
                                    <div>
                                        <CTooltip content="Glissez et déposez un fichier ou cliquez ici"
                                            placement="top-end"
                                        >
                                            <CImg src={closedFolder} fluid width={100} />
                                        </CTooltip>
                                        <p>{company.name}</p>
                                    </div>
                                </CAlert>)
                        }
                    </div>
                )}

            </Dropzone>
        )
    }

    render() {
        return (
            <div>
                {this.generateDropzone(this.props.company, this.state.files)}
                {
                    (this.props.company.surco && this.state.companySurco !== null) && (
                        this.generateDropzone(this.state.companySurco, this.state.filesSurco)
                    )
                }
                {
                    (this.state.companySurco !== null && this.state.companySurco.surco && this.state.companySurco2 !== null) && (
                        this.generateDropzone(this.state.companySurco2, this.state.filesSurco2)
                    )
                }
                <CButton
                    onClick={this.onSubmitHandler}
                    className="sofraco-button"
                    disabled={this.state.loader}
                >Envoyer</CButton>
                {
                    (this.state.loader) && (
                        <div className="sofraco-spinner">
                            <p>Upload en cours, veuillez ne pas quitter la page</p>
                            <CSpinner color="warning" ></CSpinner>
                            {/* <div id="my_modal" style={{
                                background: 'black',
                                opacity: 0.5,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zindex: 500000
                            }}></div> */}
                        </div>
                    )
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
            </div >
        );
    }
}

export default Upload;
