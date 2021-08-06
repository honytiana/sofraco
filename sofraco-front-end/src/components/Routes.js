import React, {Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// const App = React.lazy(() => import('./App'));
// const Navbar = React.lazy(() => import('./Navbar'));
// const Access = React.lazy(() => import('./Access'));
const Home = React.lazy(() => import('./Home'));
const Companies = React.lazy(() => import('./Companies'));
// const Upload = React.lazy(() => import('./Upload'));
const Treatments = React.lazy(() => import('./Treatments'));

const RouteComponent = () => {
    return (
    <Router>
        <Suspense fallback={<div>Chargement...</div>}>
            <Switch>
                {/* <Route exact path="/" component={Access} /> */}
                <Route exact path="/home" component={Home} />
                <Route path="/companies" component={Companies} />
                {/* <Route path="/upload" component={Upload} /> */}
                <Route path="/treatments" component={Treatments} />
            </Switch>
        </Suspense>
    </Router>
)};

export default RouteComponent; 