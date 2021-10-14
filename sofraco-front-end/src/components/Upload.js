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
            location: props.location,
            files: null,
            filesSurco: null,
            loader: false,
            toast: false,
            messageToast: {},
            token: null
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.testExtension = this.testExtension.bind(this);
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.get(`${config.nodeUrl}/api/token/user/${user}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                const company = this.props.company;
                this.setState({
                    token: res.data,
                    toast: false,
                    messageToast: {},
                    company: company
                });
                if (company.surco) {
                    const companySurco = company.companySurco;
                    axios.get(`${config.nodeUrl}/api/company/name/${companySurco}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.state.token.value}`
                        }
                    })
                        .then((res) => {
                            this.setState({
                                companySurco: res.data
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
                console.log(err);
            });
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
        formData.append('surco', JSON.stringify((this.state.filesSurco !== null) ? true : false));
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
        axios.post(`${config.nodeUrl}/api/document/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token.value}`
            }
        }).then((res) => {
            this.setState({
                toast: true,
                messageToast: { header: 'SUCCESS', color: 'success', message: 'Le document à été envoyé vers le serveur' }
            });
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

    onChangeHandler(event, companyName) {
        event.preventDefault();
        const files = event.target.files;
        const file = event.target.files[0];
        const fileName = file.name;
        const fileNameArray = fileName.split('.');
        const extension = fileNameArray[fileNameArray.length - 1];
        const company = companyName;
        switch (company.toUpperCase()) {
            case 'APICIL':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'APIVIA':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'APREP':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'APREP ENCOURS':
                this.testExtension(extension, 'PDF', true, files);
                break;
            // case 'AVIVA':
            //     this.testExtension(extension, 'XLSX', false, files);
            //     break;
            case 'AVIVA SURCO':
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'CARDIF':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'CBP FRANCE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'CEGEMA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'ERES':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'GENERALI':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'HODEVA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'METLIFE':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'MIE': // 'MCMS'
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MIE MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'MIEL MUTUELLE': // 'MCMS'
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MIEL MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'MILTIS':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MMA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'PAVILLON PREVOYANCE': // MCMS
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'PAVILLON MCMS': // MCMS
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'SPVIE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'SWISSLIFE':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'SWISSLIFE SURCO':
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'UAF LIFE PATRIMOINE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }

    onDropHandler(files, companyName) {
        const file = files[0];
        const fileName = file.name;
        const fileNameArray = fileName.split('.');
        const extension = fileNameArray[fileNameArray.length - 1];
        const company = companyName;
        switch (company.toUpperCase()) {
            case 'APICIL':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'APIVIA':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'APREP':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'APREP ENCOURS':
                this.testExtension(extension, 'PDF', true, files);
                break;
            // case 'AVIVA':
            //     this.testExtension(extension, 'XLSX', false, files);
            //     break;
            case 'AVIVA SURCO':
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'CARDIF':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'CBP FRANCE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'CEGEMA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'ERES':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'GENERALI':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'HODEVA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'METLIFE':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'MIE': // 'MCMS'
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MIE MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'MIEL MUTUELLE': // 'MCMS'
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MIEL MCMS': // 'MCMS'
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'MILTIS':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'MMA':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'PAVILLON PREVOYANCE': // MCMS
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'PAVILLON MCMS': // MCMS
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'SPVIE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            case 'SWISSLIFE':
                this.testExtension(extension, 'PDF', false, files);
                break;
            case 'SWISSLIFE SURCO':
                this.testExtension(extension, 'XLSX', true, files);
                break;
            case 'UAF LIFE PATRIMOINE':
                this.testExtension(extension, 'XLSX', false, files);
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }

    testExtension(extension, type, surco, file) {
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
                if (!surco) {
                    this.setState({
                        files: file
                    });
                } else {
                    this.setState({
                        filesSurco: file
                    });
                }
            }
        }
        if (type === 'XLSX') {
            if (extension.toUpperCase() !== 'XLSX' && extension.toUpperCase() !== 'XLS') {
                this.setState({
                    toast: true,
                    messageToast: { header: 'WARNING', color: 'warning', message: 'Vous devez donner un fichier Excel' }
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            } else {
                if (!surco) {
                    this.setState({
                        files: file
                    });
                } else {
                    this.setState({
                        filesSurco: file
                    });
                }
            }
        }
    }

    render() {
        return (
            <div>
                <Dropzone
                    onDrop={(files) => {
                        this.onDropHandler(files, this.props.companyName);
                    }}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                        >
                            <input
                                {...getInputProps()}
                                multiple={(this.props.company.mcms) ? true : false}
                                onChange={(event) => { this.onChangeHandler(event, this.props.companyName) }}
                            />
                            {
                                (this.state.files !== null) ? (
                                    <CAlert >
                                        <div>
                                            <CImg src={openedFolder} fluid width={100} />
                                            <p>{this.props.company.name}</p>
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
                                            <p>{this.props.company.name}</p>
                                        </div>
                                    </CAlert>)
                            }
                        </div>
                    )}
                </Dropzone>
                {
                    (this.props.company.surco && this.state.companySurco !== null) && (
                        <Dropzone
                            onDrop={(files) => {
                                this.onDropHandler(files, this.state.companySurco.name);
                            }}>
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                >
                                    <input
                                        {...getInputProps()}
                                        multiple={(this.state.companySurco.mcms) ? true : false}
                                        onChange={(event) => { this.onChangeHandler(event, this.state.companySurco.name) }}
                                    />
                                    {
                                        (this.state.filesSurco !== null) ? (
                                            <CAlert >
                                                <div>
                                                    <CImg src={openedFolder} fluid width={100} />
                                                    <p>{this.state.companySurco.name}</p>
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
                                                    <p>{this.state.companySurco.name}</p>
                                                </div>
                                            </CAlert>)
                                    }
                                </div>
                            )}

                        </Dropzone>
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
                            {/* <p>Upload en cours, veuillez ne pas quitter la page</p>
                            <p><CSpinner color="warning" ></CSpinner></p> */}
                            <div id="my_modal" style={{
                                background: 'black',
                                opacity: 0.5,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zindex:500000
                              }}></div>
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
