import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Navbar from './Navbar';
import RouteComponent from './Routes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

  }

  render() {
    return (
      <div>
        <Navbar />
        <RouteComponent />
      </div>
    );
  }
}

export default App;
