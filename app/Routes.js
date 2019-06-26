import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import HomePage from './modules/Home/Home';

type Props = {
    children: React.Node
};

class App extends React.Component<Props> {
    props: Props;

    render() {
        const { children } = this.props;
        return <React.Fragment>{children}</React.Fragment>;
    }
}

export default () => (
    <App>
        <Switch>
            <Route path={routes.HOME} component={HomePage} />
        </Switch>
    </App>
);
