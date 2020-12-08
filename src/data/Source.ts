// https://github.com/discordjs/website/blob/master/src/data/DocsSource.js

const json = (res: Response) => {
    if (!res.ok) throw new Error('Failed to fetch guides data file from GitHub');
    return res.json();
};

export default class Source {
    public readonly name: string | undefined;
    public readonly repo: string;
    public readonly source: string;
    public cache: Guide[] | null = null;

    public constructor(options: SourceOptions) {
        this.name = options.name;
        this.repo = options.repo;
        this.source = options.source ?? `https://github.com/${this.repo}/blob/`;
    }

    // public fetchTags(): Promise<string[]> {
    //     if (this.tags) return Promise.resolve(this.tags);
    //     return fetch(`https://api.github.com/repos/${this.repo}/tags`)
    //         .then(json)
    //         .then(tags => {
    //             this.tags = [this.defaultTag];
    //             localStorage['source'] = JSON.stringify(tags);
    //             return this.tags;
    //         })
    //         .catch(err => {
    //             if (localStorage[`source-${this.id}`]) {
    //                 console.error(err);
    //                 return JSON.parse(localStorage[`source-${this.id}`]);
    //             }
    //             throw err;
    //         });
    // }

    public async fetchGuides(overwrite: boolean = false): Promise<Guide[]> {
        if (this.cache && !overwrite) return this.cache;
        // this.cache = await fetch(`https://raw.githubusercontent.com/${this.repo}/guides/masyer.json`).then(json);
        this.cache = await fetch(`https://gist.githubusercontent.com/Solaris9/b50e04f5701d8f1774b3b45285c7961f/raw/6905ad542f8007c280b412bcf952fcffbb80ab05/guides.json`).then(json);
        // this.cache = require("./guide.json");
        return this.cache!;
    }
}

export interface Guide {
    topic: string;
    name: string;
    content: string;
    frontmatter: FrontMatter;
}

export interface FrontMatter {
    [key: string]: unknown;
    preview: string;
    title: string;
    categories: string[];
    authors: string[];
    tags: string[];
}

export interface SourceOptions {
    readonly name?: string;
    readonly repo: string;
    readonly source?: string;
}