import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    CInput,
    CAlert,
    CSpinner,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CImg,
    CProgress
} from '@coreui/react';

import axios from 'axios';
import Dropzone from 'react-dropzone';

import '../styles/Upload.css';
import config from '../config.json';
import folder from '../assets/folder.png';

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
        formData.append('company', JSON.stringify(this.state.company));
        axios.post(`${config.nodeUrl}/api/document/`, formData, {
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

    onChangeHandler(event) {
        event.preventDefault();
        this.setState({
            files: null
        });
        this.setState({
            files: event.target.files[0]
        });
    }

    render() {
        return (
            <div>
                <CContainer fluid>
                    <CRow>
                        <CCol sm="12">
                            <CForm action="" method="post" onSubmit={this.onSubmitHandler}>
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
                                                        <CImg src={folder} fluid width={20} /> {this.state.files.name}
                                                    </CAlert>
                                                ) : (
                                                    <CAlert>
                                                        <CImg src={folder} fluid width={20} /> Glissez et déposez un fichier ou cliquez ici
                                                    </CAlert>)
                                            }
                                        </div>
                                    )}

                                </Dropzone>
                                <CInput
                                    type="submit"
                                    id="nf-send"
                                    name="nf-send"
                                />
                            </CForm>
                        </CCol>
                    </CRow>
                    {
                        (this.state.loader === true) && (
                            <div className="sofraco-loader">
                                {/* <CSpinner color="warning" variant="grow" /> */}
                                <CProgress
                                    color="dark"
                                    className="sofraco-progress-bar"
                                    value={42}
                                    showValue
                                    className="mb-1 bg-white"
                                />
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
                </CContainer>
            </div>
        );
    }
}

export default Upload;
