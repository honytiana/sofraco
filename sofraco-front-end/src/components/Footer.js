import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CFooter
} from '@coreui/react';


class Footer extends Component {

    render() {
        return (
            <div className="position-sticky">
                <CFooter className="fixed-bottom">
                    <div>Powered by SOFRACO</div>
                </CFooter>
            </div>
        );
    }
}

export default Footer;
