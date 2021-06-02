import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CContainer,
    CRow,
    CCol,
    CForm,
    // CFormGroup,
    // CLabel,
    CInput,
    // CFormText,
    // CInputFile,
    CInputGroup,
    CInputGroupText,
    CInputGroupPrepend,
    CCard,
    CCardHeader
} from '@coreui/react';

import queryString from 'query-string';
import axios from 'axios';

import config from '../config.json';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            location: props.location
        }
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
                            <CForm action="" method="post">
                                {/* <CFormGroup>
                                    <CLabel htmlFor="nf-file">Fichier</CLabel>
                                    <CInputFile
                                        type="file"
                                        id="nf-file"
                                        name="nf-file"
                                    />
                                    <CFormText className="help-block">Veuillez choisir un fichier</CFormText>
                                </CFormGroup> */}
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText className={'bg-info text-white'}>
                                            Uploadez un fichier
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        type="file"
                                        id="nf-file"
                                        name="nf-file"
                                    />
                                    <CInput
                                        type="submit"
                                        id="nf-password"
                                        name="nf-password"
                                        placeholder="Enter Password.."
                                        autoComplete="current-password"
                                    />
                                </CInputGroup>
                            </CForm>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        );
    }
}

export default Upload;
