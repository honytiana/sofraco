import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

class RouteComponent extends Component {
    constructor(props) {
        super(props);

        // this.App = React.lazy(() => import('./App'));
        // this.Navbar = React.lazy(() => import('./Navbar'));
        // this.Access = React.lazy(() => import('./Access'));
        this.Administration = React.lazy(() => import('./Administration'));
        this.Home = React.lazy(() => import('./Home'));
        this.Companies = React.lazy(() => import('./Companies'));
        // this.Upload = React.lazy(() => import('./Upload'));
        this.Envoi = React.lazy(() => import('./Envoi'));
        this.Treatments = React.lazy(() => import('./Treatments'));
        this.ListCourtier = React.lazy(() => import('./ListCourtier'));
        this.ListClient = React.lazy(() => import('./ListClient'));
        this.Cabinet = React.lazy(() => import('./Cabinet'));
    }

    componentDidMount() {

    }

    render() {
        return (
            <Router>
                <Suspense fallback={<CSpinner color="warning" ></CSpinner>}>
                    <Switch>
                        <Route exact path="/home" component={this.Home} >
                            <this.Home token={this.props.token} />
                        </Route>
                        <Route path="/companies" component={this.Companies} >
                            <this.Companies token={this.props.token} />
                        </Route>
                        <Route path="/envoi" component={this.Envoi} >
                            <this.Envoi token={this.props.token} />
                        </Route>
                        <Route path="/treatments" component={this.Treatments} >
                            <this.Treatments token={this.props.token} />
                        </Route>
                        <Route path="/courtiers" component={this.ListCourtier} >
                            <this.ListCourtier token={this.props.token} />
                        </Route>
                        <Route path="/clients" component={this.ListClient} >
                            <this.ListClient token={this.props.token} />
                        </Route>
                        {/* <Route path="/cabinets" component={this.Cabinet} >
                            <this.Cabinet token={this.props.token} />
                        </Route> */}
                        <Route path="/administration" component={this.Administration} >
                            <this.Administration token={this.props.token} />
                        </Route>
                    </Switch>
                </Suspense>
            </Router>
        )
    }
}

export default RouteComponent;