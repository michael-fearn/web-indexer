import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { Index } from '../lib';
import { findOrCreateLink } from '.';

export class Page {
    @prop({ required: true })
    url!: string;

    @prop({ required: true })
    urlHash!: string;

    @prop({ required: true, items: String })
    hrefs!: string[];

    @prop({ required: true })
    html!: string;
}

export const PageModel = getModelForClass(Page);

export async function findOrCreatePage(url: URL, parent: DocumentType<Page> | null) {
    let child = await PageModel.findOne({ url: url.href });

    if (!child) {
        const { html, urls } = new Index(url);
        const hrefs = (await urls).map((url) => url.href);

        child = await PageModel.create({
            url: url.href,
            urlHash: url.href,
            hrefs,
            html: await html,
        });
    }
    if (parent) findOrCreateLink(parent, child);

    return child;
}
