import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { Page } from '.';
import { Word } from './word';

export class Content {
    @prop({ required: true, index: true, ref: Page })
    page!: Ref<Page>;

    @prop({ required: true, ref: Word })
    word!: Ref<Word>;
}

export const ContentModel = getModelForClass(Content);
