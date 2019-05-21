// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
    props: Props;

    render() {
        return (
            <div className={styles.container} data-tid="container">
                <Button variant="contained" color="primary">
                    按钮1
                </Button>
                <Link to={routes.COUNTER}>to Counter</Link>
            </div>
        );
    }
}
