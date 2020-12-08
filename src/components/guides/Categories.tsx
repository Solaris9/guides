import React, { Component, Fragment } from 'react';
import Source, { Guide } from "../../data/Source";
import { RouteComponentProps } from "react-router-dom";

export default class Categories extends Component<RouteComponentProps & { source: Source },
    State> {
    public state = {
        items: [] as Guide[],
        loading: true,
        error: null,
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        this.loadGuides(params.get("category"));
    }

    loadGuides(category: string | null) {
        this.props.source.fetchGuides()
            .then(guides => {
                let items;

                if (category) {
                    items = guides.filter(guide => (guide.frontmatter.categories ?? [])
                        .map(cat => cat.toLowerCase())
                        .includes(category.toLowerCase())
                    );
                } else {
                    items = guides.filter(guide => guide.name === "README");
                }

                this.setState({ loading: false, items: Array.from(items) });
            })
            .catch(error => this.setState({ error: error.message }));
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {this.state.items.map(item => <Category guide={item}/>)}
            </div>
        );
    }
}

export class Category extends Component<{ guide: Guide }, any> {
    render() {
        return (
            <Fragment>
                <div>{this.props.guide.frontmatter.title}</div>
                <hr style={{ width: "70%" }}/>
                {this.props.guide.frontmatter.preview && <div>{this.props.guide.frontmatter.preview}</div>}
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", maxWidth: "400px" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {this.props.guide.frontmatter.authors}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {this.props.guide.frontmatter.tags.map(tag =>
                            <a href={`/tags?tag=${tag}`}>{tag}</a>
                        )}
                    </div>
                </div>
            </Fragment>
        )
    }
}

interface State {
    items: Guide[];
    loading: boolean;
    error: string | null;
}