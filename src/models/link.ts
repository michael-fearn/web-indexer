import { prop, Ref, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { Page } from './';

export class Link {
    @prop({ ref: 'Page', required: true })
    parent!: Ref<Page>;

    @prop({ required: true })
    parentUrl!: string;

    @prop({ required: true })
    parentUrlHash?: string;

    @prop({ ref: 'Page', required: true })
    child!: Ref<Page>;

    @prop({ required: true })
    childUrl!: string;

    @prop({ required: true })
    childUrlHash?: string;
}

export const LinkModel = getModelForClass(Link);

export async function findOrCreateLink(parent: DocumentType<Page>, child: DocumentType<Page>) {
    const { url: parentUrl, urlHash: parentUrlHash } = parent;
    const { url: childUrl, urlHash: childUrlHash } = child;

    const existingLink = await LinkModel.findOne({ parentUrlHash, childUrlHash });
    if (existingLink) return existingLink;

    return LinkModel.create({ parent, parentUrl, parentUrlHash, child, childUrl, childUrlHash });
}
