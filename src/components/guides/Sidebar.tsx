import React, { Component } from 'react';
import { Params } from "./Viewer";
import Source from "../../data/Source";

interface SidebarItem {
    name: string;
    href: string;
    children?: SidebarItem[];
}

export default class Sidebar extends Component<Props, { items: SidebarItem[], sidebar: SidebarItem[] }> {
    public state = {
        items: [] as SidebarItem[],
        sidebar: [] as SidebarItem[]
    };

    constructor(props: Readonly<any>) {
        super(props);

        this.makeSidebar = this.makeSidebar.bind(this);
    }

    componentDidMount() {
        const items = this.props.source.cache!
            .filter(file => file.topic === this.props.params.topic)
            .map(file => ({ href: file.name, name: file.frontmatter.title }));

        const nodes = document.querySelectorAll("h2, h3");
        const sidebar: SidebarItem[] = [];

        for (const item of Array.from(nodes)) {
            const [a, text] = Array.from(item.childNodes);
            const sidebarItem = { name: text.textContent!, href: (a as HTMLLinkElement).href };

            if (item.tagName === "H2") {
                sidebar.push(sidebarItem);
            } else {
                if (!sidebar[sidebar.length - 1].children) sidebar[sidebar.length - 1].children = [];
                sidebar[sidebar.length - 1].children!.push(sidebarItem);
            }
        }

        this.setState({ items, sidebar });
    }

    render() {
        return (
            <div style={{ minWidth: "300px", display: "flex", flexDirection: "column" }}>
                {this.state.items.map(item => {
                    if (item.href === this.props.params.name) return (
                        <div>
                            <a href={`/topics/${this.props.params.topic}/${item.href}`}>{item.name}</a>
                            <div style={{ paddingLeft: "10px", display: "flex", flexDirection: "column" }}>
                                {this.state.sidebar.map(this.makeSidebar)}
                            </div>
                        </div>
                    );
                    return <a href={`/topics/${this.props.params.topic}/${item.href}`}>{item.name}</a>
                })}
            </div>
        );
    }

    makeSidebar(sidebarItem: SidebarItem): any {
        if (sidebarItem.children) return <div style={{ paddingLeft: "10px", display: "flex", flexDirection: "column" }}>
            <a href={sidebarItem.href}>{sidebarItem.name}</a>
            {sidebarItem.children.map(this.makeSidebar)}
        </div>;
        return <a style={{ paddingLeft: "10px" }} href={sidebarItem.href}>{sidebarItem.name}</a>;
    }
}

interface Props {
    source: Source;
    params: Params;
}
