import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

class RouteComponent extends Component {
    constructor(props) {
        super(props);

        // this.App = React.lazy(() => import('./App'));
        // this.Navbar = React.lazy(() => import('./Navbar'));
        // this.Access = React.lazy(() => import('./Access'));
        this.Home = React.lazy(() => import('./Home'));
        this.Companies = React.lazy(() => import('./Companies'));
        // this.Upload = React.lazy(() => import('./Upload'));
        this.Treatments = React.lazy(() => import('./Treatments'));
        this.Administration = React.lazy(() => import('./Administration'));
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
                        <Route path="/treatments" component={this.Treatments} >
                            <this.Treatments token={this.props.token} />
                        </Route>
                        <Route path="/admin" component={this.Administration} >
                            <this.Administration token={this.props.token} />
                        </Route>
                    </Switch>
                </Suspense>
            </Router>
        )
    }
}

// const RouteComponent = () => {
//     return (
//     <Router>
//         <Suspense fallback={<div>Chargement...</div>}>
//             <Switch>
//                 {/* <Route exact path="/" component={Access} /> */}
//                 <Route exact path="/home" component={Home} />
//                 <Route path="/companies" component={Companies} />
//                 {/* <Route path="/upload" component={Upload} /> */}
//                 <Route path="/treatments" component={Treatments} />
//                 <Route path="/admin" component={Administration} />
//             </Switch>
//         </Suspense>
//     </Router>
// )};

export default RouteComponent;