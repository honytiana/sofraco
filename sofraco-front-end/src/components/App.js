import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CContainer } from '@coreui/react';

import Navbar from './Navbar';
import RouteComponent from './Routes';
import Footer from './Footer';
import '../styles/App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

  }

  render() {
    document.title = 'Sofraco';
    return (
      <CContainer className="sofraco-container" fluid >
        <Navbar />
        <div className="sofraco-root" style={{minHeight: window.innerHeight - 50}}>
          <RouteComponent />
        </div>
        <Footer />
      </CContainer>
    );
  }
}

export default App;
