import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    CInput,
    CCard,
    CCardHeader,
    CAlert
} from '@coreui/react';

import queryString from 'query-string';
import axios from 'axios';
import Dropzone from 'react-dropzone';

import config from '../config.json';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            location: props.location,
            files: null
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
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

    onSubmitHandler(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.files);
        axios.post(`${config.nodeUrl}/api/document/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
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
                                            <CCard>
                                                <CCardHeader>
                                                    <input
                                                        {...getInputProps()}
                                                        multiple={false}
                                                        onChange={this.onChangeHandler}
                                                    />
                                                    Glissez et déposez un fichier ou cliquez ici
                                                </CCardHeader>
                                            </CCard>
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
                </CContainer>
                {
                    (this.state.files !== null) && (
                        <CAlert color="info" closeButton >
                            Le fichier que vous avez donné est {this.state.files.name}
                        </CAlert>
                    )
                }
            </div>
        );
    }
}

export default Upload;
