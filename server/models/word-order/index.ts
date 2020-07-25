import {
    prop,
    Ref,
    getModelForClass,
    DocumentType,
    Severity,
    modelOptions,
} from '@typegoose/typegoose';
import { Page } from '../';
import { TrieNode } from '../trie-node';
import { insertText } from './mutations';
import { getNextWords } from './queries';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class WordOrder {
    @prop({ index: true, ref: Page })
    page!: Ref<Page>;

    @prop({ default: null, index: true })
    previousWord!: string | null;

    @prop({ default: null, index: true })
    nextWord!: string | null;

    @prop({ default: null, ref: TrieNode })
    previousTrieNode!: Ref<TrieNode> | null;

    @prop({ default: null, ref: TrieNode })
    nextTrieNode!: Ref<TrieNode> | null;

    @prop({ default: null, ref: WordOrder })
    previousWordOrder!: Ref<WordOrder> | null;

    @prop({ default: null, ref: WordOrder })
    nextWordOrder!: Ref<WordOrder> | null;

    public static async insertText(text: string, page: DocumentType<Page>): Promise<void> {
        return insertText(text, page);
    }

    public static getNextWords(word: string, limit = 5): Promise<DocumentType<WordOrder>[]> {
        return getNextWords(word, limit);
    }
}

export const WordOrderModel = getModelForClass(WordOrder);
