import cheerio from 'cheerio';
import Axios from 'axios';
import { URL } from 'url';

const regex = {
    scriptTag: new RegExp(
        /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gi,
    ),
    styleTag: new RegExp(/<style((.|\n|\r)*?)<\/style>/gi),
    specialCharacters: new RegExp(/\&(.*?)\;/gi),
    onlyLetters: new RegExp(/[^a-zA-Z ]/gi),
    spacing: new RegExp(/\s\s+/g),
    elements: new RegExp(/<[^>]*>/gi),
};

export class Index {
    private pageData: Promise<CheerioStatic>;
    private _urls: URL[] | undefined;
    private _html: string | undefined;
    private _plainText: string | undefined;

    constructor(public url: URL) {
        this.pageData = Axios.get(url.href).then((response) => cheerio.load(response.data));
    }

    public get urls(): Promise<URL[]> {
        if (this._urls) return Promise.resolve(this._urls);

        return this.pageData
            .then(($) =>
                [...new Set($('a').toArray())].reduce((urls, element) => {
                    const href = $(element).attr('href');
                    href ? urls.push(new URL(href, this.url.origin)) : null;
                    return urls;
                }, [] as URL[]),
            )
            .then((urls) => {
                this._urls = urls;
                return this._urls;
            });
    }

    public get html(): Promise<string> {
        if (this._html) return Promise.resolve(this._html);

        return this.pageData
            .then(($) => $.html())
            .then((html) => {
                this._html = html.replace(regex.scriptTag, '').replace(regex.styleTag, '');
                return this._html;
            });
    }

    public get plainText(): Promise<string> {
        if (this._plainText) return Promise.resolve(this._plainText);

        return this.html
            .then((html) =>
                html
                    .replace(regex.elements, ' ')
                    .replace(regex.specialCharacters, ' ')
                    .replace(regex.onlyLetters, ' ')
                    .replace(regex.spacing, ' ')
                    .trim(),
            )
            .then((plainText) => {
                this._plainText = plainText.toLowerCase();
                return this._plainText;
            });
    }
}
