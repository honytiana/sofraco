import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
// import {} from '@coreui/react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

    }

    render() {
        return (
            <div>
                HOME
            </div>
        );
    }
}

export default Home;
