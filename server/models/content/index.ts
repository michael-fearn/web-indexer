import {
    prop,
    Ref,
    getModelForClass,
    DocumentType,
    Severity,
    modelOptions,
} from '@typegoose/typegoose';
import { Page } from '..';
import { Word } from '../word';
import { insertText } from './mutations';
import { getNextWords } from './queries';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Content {
    @prop({ index: true, ref: Page })
    page!: Ref<Page>;

    @prop({ default: null, index: true })
    previousWord!: string | null;

    @prop({ default: null, index: true })
    nextWord!: string | null;

    @prop({ default: null, ref: Word })
    previousWordNode!: Ref<Word> | null;

    @prop({ default: null, ref: Word })
    nextWorNdNode!: Ref<Word> | null;

    @prop({ default: null, ref: Content })
    previousContent!: Ref<Content> | null;

    @prop({ default: null, ref: Content })
    nextContent!: Ref<Content> | null;

    public static async insertText(text: string, page: DocumentType<Page>): Promise<void> {
        return insertText(text, page);
    }

    public static getNextWords(word: string, limit = 5): Promise<DocumentType<Content>[]> {
        return getNextWords(word, limit);
    }
}

export const ContentModel = getModelForClass(Content);
