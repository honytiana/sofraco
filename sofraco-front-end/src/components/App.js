import { Component } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CContainer } from '@coreui/react';
// import { io } from 'socket.io-client';

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
      token: null,
      interne: false
    };
    this.getToken = this.getToken.bind(this);
    this.getIPClient = this.getIPClient.bind(this);

  }

  componentDidMount() {

    window.addEventListener('close', (e) => {
      localStorage.clear();
    });

    window.onclose = ((e) => {
      localStorage.clear();
    });
    const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
    this.setState({
      interne: window.location.hostname.match(regInterne) ? true : false
    });
    this.getToken();

  }

  getIPClient() {
    const regInterne = /192.168.[0-9]{1,3}.[0-9]{1,3}/;
    this.setState({
      interne: window.location.hostname.match(regInterne) ? true : false
    });
  }

  getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        if (res.data !== null) {
          this.setState({
            token: res.data
          });
          axios.get(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}/token/${res.data.value}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then((res) => {
              const data = res;
            })
            .catch((err) => {
              axios.delete(`${(this.state.interne) ? config.nodeUrlInterne : config.nodeUrlExterne}/api/token/user/${user}`, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then((res) => {
                  window.location.reload();
                  console.log('Déconnexion');
                  localStorage.clear();
                  document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                }).catch((err) => {
                  console.log('Erreur');
                }).finally(() => {
                });
            });
        } else {
          localStorage.clear();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    document.title = 'Sofraco';
    if (this.state.token === null) {
      this.getToken();
    }
    return (
      <CContainer className="sofraco-container" fluid >
        {
          (localStorage.getItem('user') === null) ?
            <Access /> :
            <div>
              <Navbar token={this.state.token} />
              <div className="sofraco-root" style={{ minHeight: window.innerHeight - 50 }}>
                <RouteComponent token={this.state.token} />
              </div>
              <Footer />
            </div>
        }
      </CContainer>
    );
  }
}

export default App;
