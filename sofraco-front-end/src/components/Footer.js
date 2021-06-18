import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CFooter
} from '@coreui/react';
import '../styles/Footer.css';


class Footer extends Component {

    render() {
        return (
            <div>
                <CFooter className="sofraco-footer" >
                    <div>Powered by SOFRACO</div>
                </CFooter>
            </div>
        );
    }
}

export default Footer;
