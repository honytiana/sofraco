import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CContainer } from '@coreui/react';
import { io } from 'socket.io-client';

import axios from 'axios';
import Navbar from './Navbar';
import RouteComponent from './Routes';
import Footer from './Footer';
import '../styles/App.css';
import config from '../config.json';
import Access from './Access';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

  }

  componentDidMount() {

    // const socket = io(config.nodeUrl, {
    //   path: '/api/api-status'
    // });
    // console.log(socket)
    // socket.on('connect', () => {
    //   console.log('connected');
    // });
    // socket.on('error', (err) => {
    //   console.log(err);
    // });
    // socket.on('connection', () => {
    //   console.log('connected');
    // });
    // socket.on('connect_error', (err) => {
    //   console.log(err);
    // })

    window.addEventListener('close', (e) => {
      localStorage.clear();
    });
  }

  render() {
    document.title = 'Sofraco';
    return (
      <CContainer className="sofraco-container" fluid >
        {
          (localStorage.getItem('token') === null) ?
            <Access /> :
            <div>
              <Navbar />
              <div className="sofraco-root" style={{ minHeight: window.innerHeight - 50 }}>
                <RouteComponent />
              </div>
              <Footer />
            </div>
        }
      </CContainer>
    );
  }
}

export default App;
