import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { Page } from '.';

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
