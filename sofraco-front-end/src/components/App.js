import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Navbar from './Navbar';
import RouteComponent from './Routes';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

  }

  render() {
    document.title = 'Sofraco';
    return (
      <div>
        <Navbar />
        <RouteComponent />
        <Footer />
      </div>
    );
  }
}

export default App;
