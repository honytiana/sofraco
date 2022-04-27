import { Component } from 'react';
import { CContainer } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
// import { io } from 'socket.io-client';

import Navbar from './Navbar';
import RouteComponent from './Routes';
import Footer from './Footer';
import '../styles/App.css';
import Access from './Access';
import TokenService from '../services/token';
import UserService from '../services/user';

require('dotenv').config();


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      interne: false
    };
    this.getToken = this.getToken.bind(this);
    this.getIPClient = this.getIPClient.bind(this);

    this.tokenService = new TokenService();
    this.userService = new UserService();

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
    // get token by user
    this.tokenService.getTokenByUser(user)
      .then((res) => {
        if (res.length > 0) {
          // check token
          const token = document.cookie.replace(/.*sofraco_=(.*);*.*/, '$1');
          this.tokenService.checkToken(user)
            .then((res) => {
              this.setState({
                token: token
              });
            })
            .catch((err) => {
              if (token) {
                this.tokenService.removeTokenUser(user, token)
                  .then((res) => {
                    window.location.reload();
                    console.log('Déconnexion');
                    localStorage.clear();
                    document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                  }).catch((err) => {
                    console.log(err);
                  }).finally(() => {
                  });
              } else {
                window.location.reload();
                console.log('Déconnexion');
                localStorage.clear();
                document.cookie = "sofraco=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
              }
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
            <div style={{ backgroundColor: '#FFF' }}>
              <Navbar token={this.state.token} />
              <CContainer className="sofraco-root" style={{ minHeight: window.innerHeight - 50 }} >
                <RouteComponent token={this.state.token} />
              </CContainer>
              <Footer />
            </div>
        }
      </CContainer>
    );
  }
}

export default App;
