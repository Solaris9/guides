import React, { Component, ElementType } from 'react';
import Source, { Guide } from "../../data/Source";
import { RouteComponentProps } from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html"
import Sidebar from "./Sidebar";
import NotFound from "../NotFound";
import Loading from "../Loading";
import { Prism } from "react-syntax-highlighter";
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

import "../../sass/App.sass"

const htmlParser = require('react-markdown/plugins/html-parser');
const parseHtml = htmlParser({
    isValidNode: (node: any) => node.type !== 'script'
});

const renderers: Record<string, ElementType> = {
    heading: (props: any) => {
        const name = props.node.children[0].value.toLowerCase()
            .replace(/(\s+)/g, "-");
        return React.createElement(`h${props.level}`, { id: "anchor" },
            <a href={`#${name}`} id={name}>#</a>,
            props.children
        );
    },
    code: ({ language, value }) => {
        return <Prism style={tomorrow} language={language} children={value}/>
    }
};

export default class Viewer extends Component<Props, State> {
    constructor(props: Readonly<any>) {
        super(props);

        this.state = {
            file: null,
            loading: true,
            notFound: false
        }
    }

    componentDidMount() {
        const { topic, name = "README" } = this.props.match.params;
        const { cache } = this.props.source

        const file = cache!.find(file => file.topic === topic && file.name === name);
        if (!file) return this.setState({ notFound: true });

        this.setState({ file, loading: false });
    }

    render() {
        if (this.state.notFound) return <NotFound/>
        if (this.state.loading) return <Loading/>

        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Sidebar source={this.props.source} params={this.props.match.params}/>
                <span>
                    <ReactMarkdown
                        astPlugins={[parseHtml]}
                        renderers={renderers}
                        allowDangerousHtml
                        children={this.state.file!.content}
                    />
                </span>
            </div>
        );
    }
}

interface Props extends RouteComponentProps<Params> {
    source: Source;
}

export interface Params {
    topic: string;
    name: string;
}

interface State {
    file: Guide | null;
    notFound: boolean;
    loading: boolean;
    error?: string;
}

