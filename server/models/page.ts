import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export class Page {
    @prop({ required: true })
    url!: string;

    // @prop({ required: true })
    // urlHash!: string;

    // @prop({ required: true, type: String })
    // hrefs!: string[];

    public static async updateOrInsert(url: string): Promise<DocumentType<Page>> {
        let page = await PageModel.findOne({ url });
        if (!page) page = await PageModel.create({ url });

        return page;
    }
}

export const PageModel = getModelForClass(Page);
