import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.css';
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    CInput,
    CCard,
    CCardHeader,
    CJumbotron,
    CAlert,
    CSpinner,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster
} from '@coreui/react';

import queryString from 'query-string';
import axios from 'axios';
import Dropzone from 'react-dropzone';

import '../styles/Upload.css';
import config from '../config.json';

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
        const location = this.state.location;
        const params = queryString.parse(location.search);
        axios.get(`${config.nodeUrl}/api/company/name/${params.name}`)
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
        formData.append('company', this.state.company._id)
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
                loader: false,
            });
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
                            <CCard>
                                <CCardHeader>
                                    Upload de documents pour la compagnie {this.state.company.name}
                                </CCardHeader>
                            </CCard>
                        </CCol>
                    </CRow>
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
                                            <CJumbotron>
                                                <input
                                                    {...getInputProps()}
                                                    multiple={false}
                                                    onChange={this.onChangeHandler}
                                                />
                                                    Glissez et déposez un fichier ou cliquez ici
                                                {
                                                    (this.state.files !== null) && (
                                                        <CAlert color="info" >
                                                            Le fichier que vous avez donné est {this.state.files.name}
                                                        </CAlert>
                                                    )
                                                }
                                            </CJumbotron>
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
                                <CSpinner color="warning" variant="grow" />
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
