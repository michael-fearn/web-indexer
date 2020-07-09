import { prop, getModelForClass } from '@typegoose/typegoose';

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
