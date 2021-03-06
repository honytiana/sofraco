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
import Dropzone from 'react-dropzone';

import '../styles/Upload.css';
import closedFolder from '../assets/closed_folder.png';
import openedFolder from '../assets/opened_folder.png';
import CompanyService from '../services/company';
import DocumentService from '../services/document';

require('dotenv').config();

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: null,
            companySurco: null,
            companySurco2: null,
            companySurcoCount: {},
            location: props.location,
            files: null,
            filesSurco: null,
            filesSurco2: null,
            loader: false,
            toast: false,
            messageToast: {},
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            interne: false
        }
        this._isMounted = false;
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.testExtension = this.testExtension.bind(this);
        this.generateDropzone = this.generateDropzone.bind(this);
        this.setStateFile = this.setStateFile.bind(this);
        this.getCompanySurco = this.getCompanySurco.bind(this);

        this.companyService = new CompanyService();
        this.documentService = new DocumentService();
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        const company = this.props.company;
        this.setState({
            company: company
        });
        this._isMounted && this.getCompanySurco();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkProps() {
        if (this.props.token !== null) {
            this._isMounted && this.getCompanySurco();
        }
    }

    getCompanySurco() {
        const company = this.props.company;
        if (company.surco) {
            const companySurco = company.companySurco;
            this.companyService.getCompanyByName(companySurco, this.state.token)
                .then((res) => {
                    const companySurco = res;
                    this.setState({
                        companySurco
                    });
                    const companySurcoCount = {
                        company: company._id,
                        companySurco: companySurco._id,
                        count: 2
                    };
                    this.setState({
                        companySurcoCount
                    });
                    this.props.companyFolderSurcoCallback(companySurcoCount);
                    if (companySurco.surco) {
                        this.companyService.getCompanyByName(companySurco.companySurco, (this.state.token !== null) ? this.state.token : this.props.token)
                            .then((res) => {
                                this.setState({
                                    companySurco2: res
                                });
                                const companySurcoCount = {
                                    company: company._id,
                                    companySurco: companySurco._id,
                                    companySurco2: res._id,
                                    count: 3
                                };
                                this.setState({
                                    companySurcoCount
                                });
                                this.props.companyFolderSurcoCallback(companySurcoCount);
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
        const selectedDate = this.props.selectedDate;
        selectedDate.day = new Date().getDate();
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
            globalName: this.props.company.globalName,
            surco: this.props.company.surco,
        }
        let companySurco;
        if (this.state.companySurco) {
            companySurco = {
                _id: this.state.companySurco._id,
                globalName: this.state.companySurco.globalName,
                name: this.state.companySurco.name,
            }
        }
        let companySurco2;
        if (this.state.companySurco2) {
            companySurco2 = {
                _id: this.state.companySurco2._id,
                globalName: this.state.companySurco2.globalName,
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
        formData.append('selectedDate', JSON.stringify(selectedDate));
        this.documentService.createDocument(formData, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: 'Le document a ??t?? envoy?? vers le serveur' }
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
            case 'APREP PREVOYANCE':
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
            case 'SWISS LIFE SURCO':
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
                                        <CTooltip content="Glissez et d??posez un fichier ou cliquez ici"
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
                {this.props.company.show && this.generateDropzone(this.props.company, this.state.files)}
                {
                    (this.props.company.surco && this.state.companySurco !== null) && (
                        this.state.companySurco.show && this.generateDropzone(this.state.companySurco, this.state.filesSurco)
                    )
                }
                {
                    (this.state.companySurco !== null && this.state.companySurco.surco && this.state.companySurco2 !== null) && (
                        this.state.companySurco2.show && this.generateDropzone(this.state.companySurco2, this.state.filesSurco2)
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
