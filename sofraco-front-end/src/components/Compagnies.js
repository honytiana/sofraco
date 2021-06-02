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
    CInputGroupPrepend
} from '@coreui/react';

class Compagnies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

    }

    render() {
        return (
            <div>
                <CContainer fluid>
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

export default Compagnies;
