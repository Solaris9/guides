import React, { Component } from 'react';
import { Switch, Route, RouteComponentProps } from "react-router-dom"

import NotFound from "../NotFound";
import Viewer from "./Viewer";
import Source  from "../../data/Source";
import Loading from "../Loading";

export default class Topics extends Component<RouteComponentProps & Props, State> {
    public state = {
        error: null,
        loading: true,
    };

    componentDidMount() {
        this.loadGuides();
    }

    loadGuides() {
        this.props.source.fetchGuides()
            .then(() => this.setState({ loading: false }))
            .catch(error => this.setState({ error: error.message }));
    }

    render() {
        if (this.state.loading) return <Loading/>
        if (this.state.error) return <div>{this.state.error}</div>

        const { url } = this.props.match;

        return (
            <div>
                <Switch>
                    <Route exact path={`${url}/:topic/:name?`} render={props => {
                        return <Viewer {...props} source={this.props.source}/>
                    }}/>
                    <Route path={[`${url}/*`, `${url}`]} component={NotFound}/>
                </Switch>
            </div>
        );
    }
}

interface State {
    error: string | null;
    loading: boolean;
}

interface Props {
    source: Source;
}