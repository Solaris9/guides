import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", height: "50px" }}>
                <a href="/">home</a>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <a href="/tags">tags</a>
                    <span style={{ width: "50px"}}/>
                    <a href="/categories">categories</a>
                </div>
            </div>
        );
    }
}

