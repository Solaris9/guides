import React, { Component, Fragment } from 'react';
import Source, { Guide } from "../../data/Source";
import { RouteComponentProps } from "react-router-dom";
import { Category } from "./Categories";

export default class Tags extends Component<RouteComponentProps & { source: Source },
    State> {
    public state = {
        items: [] as Guide[],
        tags: [ "All Tags" ],
        loading: true,
        error: null,
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        this.loadGuides(params.get("tag"));
    }

    loadGuides(tag: string | null) {
        this.props.source.fetchGuides()
            .then(guides => {
                let items;

                if (tag) {
                    items = guides.filter(guide => (guide.frontmatter.tags ?? [])
                        .map(tag => tag.toLowerCase())
                        .includes(tag.toLowerCase())
                    );
                } else {
                    items = guides.filter(guide => guide.name === "README");
                }

                let tags = guides.map(guide => guide.frontmatter.tags ?? []).flat()
                let uniqueTags = new Set([...tags.map(tag => tag.toLowerCase())]);
                let finalTags = tags.filter(tag => uniqueTags.has(tag.toLowerCase()));

                this.setState({ loading: false, items: Array.from(items), tags: this.state.tags.concat(finalTags) });
            })
            .catch(error => this.setState({ error: error.message }));
    }

    render() {
        return (
            <Fragment>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {this.state.tags.map((tag, i) =>
                        <a href={i === 0 ? '/tags' : `/tags?tag=${tag}`}>{tag}</a>
                    )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {this.state.items.map(item => <Category guide={item}/>)}
                </div>
            </Fragment>
        );
    }
}

interface State {
    items: Guide[];
    tags: string[];
    loading: boolean;
    error: string | null;
}