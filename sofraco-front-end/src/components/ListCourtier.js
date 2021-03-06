import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CButton,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CInputGroup,
    CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import '../styles/ListCourtier.css';
import Courtier from './Courtier';
import Mandataire from './Mandataire';
import Correspondance from './Correspondance';
import CabinetService from '../services/cabinet';
import CompanyService from '../services/company';
import CourtierService from '../services/courtier';

require('dotenv').config();

class ListCourtier extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            courtiers: [],
            cabinets: [],
            fields: [],
            toast: false,
            messageToast: [],
            activePage: 1,
            num: 0,
            token: document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1'),
            ajoutCourtier: false,
            courtierToDel: null,
            visibleAlert: false,
            interne: false
        }
        this._isMounted = false;
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.fetchCabinets = this.fetchCabinets.bind(this);
        this.changeActivePage = this.changeActivePage.bind(this);
        this.fetchCourtiers = this.fetchCourtiers.bind(this);
        this.activerAjoutCourtier = this.activerAjoutCourtier.bind(this);
        this.ajouterCourtier = this.ajouterCourtier.bind(this);
        this.handleListCourtierCallback = this.handleListCourtierCallback.bind(this);
        this.onSearchGlobalCourtierMandataireCode = this.onSearchGlobalCourtierMandataireCode.bind(this);

        this.companyService = new CompanyService();
        this.cabinetService = new CabinetService();
        this.courtierService = new CourtierService();
    }

    componentDidMount() {
        this._isMounted = true;
        const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
        this.setState({
            interne: window.location.hostname.match(regInterne) ? true : false
        });
        this._isMounted && this.setState({
            fields: [
                {
                    key: 'cabinet',
                    label: 'Cabinet',
                    _style: { width: '20%' },
                    _classes: ['text-center']
                },
                {
                    key: 'lastName',
                    label: 'Nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'firstName',
                    label: 'Pr??nom',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'email',
                    label: 'Email',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'emailCopie',
                    label: 'Emails en copie',
                    _style: { width: '15%' },
                    _classes: ['text-center']
                },
                {
                    key: 'phone',
                    label: 'Telephone',
                    _style: { width: '10%' },
                    _classes: ['text-center']
                },
                // {
                //     key: 'status',
                //     label: 'Status',
                //     _style: { width: '5%' },
                //     _classes: ['text-center'],
                //     sorter: false,
                //     filter: false
                // },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                },
                {
                    key: 'delete',
                    label: '',
                    _style: { width: '5%' },
                    _classes: ['text-center'],
                    sorter: false,
                    filter: false
                }
            ]
        });
        this._isMounted && this.fetchCourtiers();
        this._isMounted && this.fetchCabinets();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCourtiers() {
        this.courtierService.getCourtiersByRole('courtier', this.state.token)
            .then((data) => {
                const courtiers = data;
                this.setState({
                    courtiers
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    fetchCabinets() {
        this.cabinetService.getCabinets(this.state.token)
            .then((data) => {
                const cabinets = data;
                this.setState({
                    cabinets
                });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getBadge(status) {
        switch (status) {
            case true: return 'success'
            case false: return 'danger'
            default: return 'primary'
        }
    }

    toggleDetails(index) {
        const position = this.state.details.indexOf(index);
        let newDetails = this.state.details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...this.state.details, index];
        }
        this.setState({
            details: newDetails,
            num: index
        });
        this._isMounted && this.fetchCourtiers();
    }

    changeActivePage(page) {
        this.setState({
            activePage: page
        });
    }

    activerAjoutCourtier() {
        let activer = this.state.ajoutCourtier;
        this.setState({
            ajoutCourtier: !activer
        });
    }

    ajouterCourtier(event) {
        event.preventDefault();
        const options = {
            cabinet: event.target['sofraco-cabinet'].text,
            cabinetRef: event.target['sofraco-cabinet'].value,
            lastName: event.target['sofraco-nom'].value,
            firstName: event.target['sofraco-prenom'].value,
            email: event.target['sofraco-email'].value,
            phone: event.target['sofraco-phone'].value,
            role: 'courtier'
        };
        if (options.cabinet !== '' ||
            options.lastName !== '' ||
            options.firstName !== '' ||
            options.email !== '' ||
            options.phone !== '') {
            this.courtierService.createCourtier(options, this.state.token)
                .then((res) => {
                    let courtiers = this.state.courtiers;
                    courtiers.push(res);
                    this.setState({
                        courtiers: courtiers,
                        toast: true,
                        messageToast: { header: 'SUCCESS', color: 'success', message: `Le courtier ${res.cabinet} ?? ??t?? ajout??` }
                    });
                    this.activerAjoutCourtier();
                    event.target['sofraco-cabinet'].value = '';
                    event.target['sofraco-nom'].value = '';
                    event.target['sofraco-prenom'].value = '';
                    event.target['sofraco-email'].value = '';
                    event.target['sofraco-phone'].value = '';
                    this._isMounted && this.fetchCourtiers();
                }).catch((err) => {
                    this.setState({
                        toast: true,
                        messageToast: { header: 'ERROR', color: 'danger', message: err }
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.setState({
                            toast: false,
                            messageToast: {}
                        });
                    }, 6000);
                });
        }
    }

    openDeletePopup(e, courtier) {
        this.setState({
            courtierToDel: courtier,
            visibleAlert: true
        });
    }

    deleteCourtier(e) {
        e.preventDefault();
        this.setState({ visibleAlert: false });
        this.courtierService.deleteCourtier(this.state.courtierToDel._id, this.state.token)
            .then((res) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'SUCCESS', color: 'success', message: `Le courtier ${this.state.courtierToDel.cabinet} ?? ??t?? supprim??` }
                });
                this._isMounted && this.fetchCourtiers();
            }).catch((err) => {
                this.setState({
                    toast: true,
                    messageToast: { header: 'ERROR', color: 'danger', message: err }
                })
            }).finally(() => {
                this.setState({
                    courtierToDel: null
                });
                setTimeout(() => {
                    this.setState({
                        toast: false,
                        messageToast: {}
                    });
                }, 6000);
            });
    }

    closeDeletePopup(e) {
        this.setState({
            visibleAlert: false,
            courtierToDel: null
        });
    }

    handleListCourtierCallback() {
        this._isMounted && this.fetchCourtiers();
    }

    onSearchGlobalCourtierMandataireCode(e) {
        if (e.target.value !== '') {
            this.companyService.getCompaniesLike(e.target.value, this.state.token)
                .then((companies) => {
                    if (companies.length > 0) {
                        let collapsed = [];
                        for (let company of companies) {
                            collapsed.push({ company: company.name, collapse: false });
                        }
                        this.setState({
                            companies: companies,
                            collapsed: collapsed,
                        });
                    } else {
                        this.setState({
                            companies: []
                        });
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        } else {
            this._isMounted && this.getCompanies();
            this.setState({
                search: false
            });
        }
    }

    render() {
        return (
            <div>
                <CModal
                    show={this.state.ajoutCourtier}
                    onClose={() => { this.activerAjoutCourtier() }}
                    centered={true}
                    className="sofraco-modal"
                >
                    <CModalHeader closeButton>Creez un courtier</CModalHeader>
                    <CModalBody className="sofraco-modal-body">
                        <CForm action="" method="post" onSubmit={(e) => this.ajouterCourtier(e)}>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-cabinet-courtier${this.props.sIndex}`}>Cabinet</CLabel>
                                <CSelect
                                    id={`sofraco-cabinet-courtiers${this.props.sIndex}`}
                                    label="Cabinet"
                                    className="sofraco-input"
                                    name={`sofraco-cabinet`}
                                >
                                    <option>Selectionnez un cabinet</option>
                                    {this.state.cabinets.map((cabinet, index) => {
                                        return (
                                            <option key={`cabinetOption${index}`} value={cabinet._id}>{cabinet.cabinet}</option>
                                        )
                                    })}
                                </CSelect>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-nom-courtier_${this.props.sIndex}`}>Nom</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-nom-courtier-courtier_${this.props.sIndex}`}
                                    name={`sofraco-nom`}
                                    autoComplete="nom"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-prenom-courtier_${this.props.sIndex}`}>Pr??noms</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-prenom-courtier_${this.props.sIndex}`}
                                    name={`sofraco-prenom`}
                                    autoComplete="prenom"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-email-courtier_${this.props.sIndex}`}>Email</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-email-courtier_${this.props.sIndex}`}
                                    name={`sofraco-email`}
                                    autoComplete="email"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel className="col-sm-2" htmlFor={`sofraco-phone-courtier_${this.props.sIndex}`}>T??l??phone</CLabel>
                                <CInput
                                    type="text"
                                    id={`sofraco-phone-courtier_${this.props.sIndex}`}
                                    name={`sofraco-phone`}
                                    autoComplete="phone"
                                    className="sofraco-input"
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput
                                    type="submit"
                                    name="sofraco-submit"
                                    value="Sauvegarder"
                                    className="sofraco-button"
                                />
                            </CFormGroup>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={() => { this.activerAjoutCourtier() }}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
                <CFormGroup>
                    <CInputGroup className={'sofraco-form-search'}>
                        <CInput
                            type="text"
                            id="sofraco-search-company"
                            name="sofraco-search-company"
                            className={'sofraco-input'}
                            placeholder='Recherche'
                            onChange={(e) => { this.onSearchGlobalCourtierMandataireCode(e) }}
                        />
                        <span className="input-group-append">
                            <CButton className={"btn border sofraco-button-icon-search"} >
                                <CIcon
                                    className={'sofraco-icon-search'}
                                    size="sm"
                                    onClick={(e) => { this.onSearchGlobalCourtierMandataireCode(e) }}
                                    icon={icon.cilSearch} />
                            </CButton>
                        </span>
                    </CInputGroup>
                </CFormGroup>
                <CDataTable
                    items={this.state.courtiers}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter={{ label: 'Recherche', placeholder: '...' }}
                    itemsPerPageSelect={{ label: 'Nombre de courtiers par page' }}
                    itemsPerPage={15}
                    hover
                    sorter
                    border
                    size={'sm'}
                    pagination={{
                        className: 'sofraco-pagination'
                    }}
                    scopedSlots={{
                        'show_details':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CIcon
                                            className={'sofraco-icon-edit'}
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                            icon={icon.cilPencil} />
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CModal
                                        show={this.state.details.includes(index)}
                                        onClose={() => { this.toggleDetails(index) }}
                                        centered={true}
                                        className="sofraco-modal"
                                    >
                                        <CModalHeader closeButton>{item.cabinet}</CModalHeader>
                                        <CModalBody className="sofraco-modal-body">
                                            <CTabs activeTab="courtier">
                                                <CNav variant="tabs">
                                                    <CNavItem>
                                                        <CNavLink data-tab="courtier">
                                                            Courtier
                                                        </CNavLink>
                                                    </CNavItem>
                                                    <CNavItem>
                                                        <CNavLink data-tab="mandataires">
                                                            Mandataires
                                                        </CNavLink>
                                                    </CNavItem>
                                                    <CNavItem>
                                                        <CNavLink data-tab="code">
                                                            Code courtier
                                                        </CNavLink>
                                                    </CNavItem>
                                                </CNav>
                                                <CTabContent>
                                                    <CTabPane data-tab="courtier">
                                                        <Courtier
                                                            courtier={item}
                                                            key={`courtier${this.state.num}${item._id}`}
                                                            token={this.state.token}
                                                            listCourtierCallback={() => { this.handleListCourtierCallback() }}
                                                        />
                                                    </CTabPane>
                                                    <CTabPane data-tab="mandataires">
                                                        <Mandataire courtier={item} key={`mandataire${this.state.num}${item._id}`} sIndex={index} token={this.state.token} />
                                                    </CTabPane>
                                                    <CTabPane data-tab="code">
                                                        <Correspondance courtier={item} key={`correspondance${this.state.num}${item._id}`} sIndex={index} token={this.state.token} add={true} />
                                                    </CTabPane>
                                                </CTabContent>
                                            </CTabs>
                                        </CModalBody>
                                        <CModalFooter>
                                            <CButton
                                                className={'sofraco-button-anuler'}
                                                onClick={() => { this.toggleDetails(index) }}
                                            >Annuler</CButton>
                                        </CModalFooter>
                                    </CModal>
                                )
                            },
                        'emailCopie':
                            (item, index) => {
                                return (
                                    <td className="text-center" >
                                        {item.emailCopie.map((ec, i) => {
                                            return <span href="#" key={`${item._id}_${ec}-${index}_${i}`}>{ec}, </span>
                                        })}
                                    </td>
                                )
                            },
                        'delete':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CIcon
                                            className={'sofraco-icon-del text-danger'}
                                            color='danger'
                                            size="sm"
                                            onClick={(e) => { this.openDeletePopup(e, item) }}
                                            icon={icon.cilTrash} />
                                    </td>
                                )
                            }
                    }
                    }
                />
                <CButton className="sofraco-button" onClick={this.activerAjoutCourtier}>Ajouter un courtier</CButton>
                <CModal
                    show={this.state.visibleAlert}
                    className="sofraco-modal-ask"
                    id="sofraco-modal-ask"
                    onClose={(e) => { this.closeDeletePopup() }}
                >
                    <CModalHeader closeButton></CModalHeader>
                    <CModalBody>
                        Voulez vous vraiment supprimer le courtier {this.state.courtierToDel ? this.state.courtierToDel.cabinet : ''}?
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            color="danger"
                            onClick={(e) => { this.deleteCourtier(e) }}
                            size="sm">
                            Supprimer
                        </CButton>
                        <CButton
                            className={'sofraco-button-anuler'}
                            onClick={(e) => this.closeDeletePopup()}
                            size="sm">
                            Annuler
                        </CButton>
                    </CModalFooter>
                </CModal>
                {
                    (this.state.toast === true &&
                        this.state.messageToast !== null) &&
                    <CToaster position="bottom-right" >
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
                }
            </div>
        );
    }

}

export default ListCourtier;
