import React, {Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// const App = React.lazy(() => import('./components/App'));
// const Navbar = React.lazy(() => import('./components/Navbar'));
const Home = React.lazy(() => import('./components/Home'));
const Compagnies = React.lazy(() => import('./components/Compagnies'));
const Treatments = React.lazy(() => import('./components/Treatments'));

const RouteComponent = () => {
    return (
    <Router>
        <Suspense fallback={<div>Chargement...</div>}>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/compagnies" component={Compagnies} />
                <Route path="/treatments" component={Treatments} />
            </Switch>
        </Suspense>
    </Router>
)};

export default RouteComponent; 