import React, { Component, Fragment } from 'react';
import Source, { Guide } from "../../data/Source";
import { RouteComponentProps } from "react-router-dom";

export default class Categories extends Component<RouteComponentProps & { source: Source },
    State> {
    public state = {
        items: [] as Guide[],
        categories: ["All Categories"],
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

                let categories = guides.map(guide => guide.frontmatter.categories ?? []).flat()
                let uniqueCategories = new Set([...categories.map(cat => cat.toLowerCase())]);
                let finalCategories = categories.filter(cat => uniqueCategories.has(cat.toLowerCase()));

                this.setState({
                    loading: false,
                    items: Array.from(items),
                    categories: this.state.categories.concat(finalCategories)
                });
            })
            .catch(error => this.setState({ error: error.message }));
    }

    render() {
        return (
            <Fragment>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {this.state.categories.map((cat, i) =>
                        <a href={i === 0 ? '/categories' : `/categories?category=${cat}`}>{cat}</a>
                    )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {this.state.items.map(item => <Category guide={item}/>)}
                </div>
            </Fragment>
        );
    }
}

export class Category extends Component<{ guide: Guide }, any> {
    render() {
        const { topic, name, frontmatter: { title } } = this.props.guide
        return (
            <Fragment>
                <a href={`/topics/${topic}${name === "README" ? '' : `/${name}`}`}>{title}</a>
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
    categories: string[];
    loading: boolean;
    error: string | null;
}