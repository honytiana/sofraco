import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CImg
} from '@coreui/react';

import sofraco_logo from '../assets/sofraco_groupe_logo.png';
import '../styles/Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

    }

    render() {
        return (
            <div className="sofraco-logo" style={{minHeight: window.innerHeight - 50}}>
                <CImg
                    src={sofraco_logo}
                    fluid
                    className="mb-2"
                />
            </div>
        );
    }
}

export default Home;
