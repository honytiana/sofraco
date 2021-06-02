import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CDataTable,
    CBadge,
    CButton,
    CCollapse,
    CCardBody,
    CInputCheckbox
} from '@coreui/react';
import axios from 'axios';

import config from '../config.json';

class Treatments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            usersData: [
                { code: 0, email: 'test@test.com', firstName: 'Test', is_enabled: true, lastName: 'Courtier', status: 'Active' }
            ],
            fields: [
                { key: 'code', _style: { width: '10%' } },
                { key: 'firstName', _style: { width: '20%' } },
                { key: 'lastName', _style: { width: '20%' } },
                { key: 'email', _style: { width: '20%' } },
                { key: 'status', _style: { width: '10%' } },
                {
                    key: 'check',
                    label: '',
                    _style: { width: '10%' },
                    sorter: false,
                    filter: false
                },
                {
                    key: 'show_details',
                    label: '',
                    _style: { width: '10%' },
                    sorter: false,
                    filter: false
                }
            ]
        }
        this.getBadge = this.getBadge.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);

    }

    componentDidMount() {
        axios.get(`${config.nodeUrl}/api/courtier`)
            .then((data) => {
                this.setState({
                    usersData: data.data
                })
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getBadge(status) {
        switch (status) {
            case 'Active': return 'success'
            case 'Inactive': return 'secondary'
            case 'Pending': return 'warning'
            case 'Banned': return 'danger'
            default: return 'primary'
        }
    }

    toggleDetails(index) {
        const position = this.state.details.indexOf(index)
        let newDetails = this.state.details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...this.state.details, index]
        }
        this.setState({
            details: newDetails
        })
    }

    render() {
        return (
            <div>
                <CDataTable
                    items={this.state.usersData}
                    fields={this.state.fields}
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    itemsPerPage={5}
                    hover
                    sorter
                    pagination
                    scopedSlots={{
                        'status':
                            (item) => (
                                <td>
                                    <CBadge color={this.getBadge(item.status)}>
                                        {item.status}
                                    </CBadge>
                                </td>
                            ),
                        'show_details':
                            (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color="primary"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => { this.toggleDetails(index) }}
                                        >
                                            {this.state.details.includes(index) ? 'Hide' : 'Show'}
                                        </CButton>
                                    </td>
                                )
                            },
                        'details':
                            (item, index) => {
                                return (
                                    <CCollapse show={this.state.details.includes(index)}>
                                        <CCardBody>
                                            <h4>
                                                {item.firstName}
                                            </h4>
                                        </CCardBody>
                                    </CCollapse>
                                )
                            },
                        'check':
                            (item, index) => {
                                return (
                                    <td>
                                        <CInputCheckbox />
                                    </td>
                                )
                            }
                    }
                    }
                />
            </div>
        );
    }

}

export default Treatments;
