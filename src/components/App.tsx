import React, { Component, Fragment } from "react"
import { Switch, Route } from "react-router-dom"

import NotFound from "./NotFound";
import Home from "./Home";
import Header from "./Header";
import Topics from "./guides/Topics";
import Source from "../data/Source";
import GuidesSource from "../data/GuidesSource";
import Categories from "./guides/Categories";
import Tags from "./guides/Tags";

export default class App extends Component {
    public source: Source = GuidesSource;

    render() {
        return (
            <Fragment>
                <Header/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/topics' render={props => <Topics source={this.source} {...props}/>}/>
                    <Route path='/categories' render={props => <Categories source={this.source} {...props}/>}/>
                    <Route path='/tags' render={props => <Tags source={this.source} {...props}/>}/>
                    <Route path='*' component={NotFound}/>
                </Switch>
            </Fragment>
        );
    }
}