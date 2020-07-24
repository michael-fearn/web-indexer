import { prop, Ref, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { Page } from '..';
import { getNextWords } from './queries';
import { TrieNode, TrieNodeModel } from '../trie-node';

export class WordOrder {
    @prop({ required: true, index: true, ref: Page })
    page!: Ref<Page>;

    @prop({ required: true, index: true })
    fromWord!: string;

    @prop({ required: true, index: true })
    toWord!: string;

    @prop({ required: true, ref: TrieNode })
    from!: Ref<TrieNode>;

    @prop({ required: true, ref: TrieNode })
    to!: Ref<TrieNode>;

    @prop({ default: 1 })
    occurrences!: number;

    public static insertText(text: string, page: DocumentType<Page>): Promise<void> {
        text;
        page;
        throw new Error('insertText is meant to be overwritten');
    }

    public static getNextWords(word: string, count = 5): Promise<DocumentType<WordOrder>[]> {
        word;
        count;
        throw new Error('getNextWords is meant to be overwritten');
    }
}

const WordOrderModel = getModelForClass(WordOrder);

async function insertText(text: string, page: DocumentType<Page>): Promise<void> {
    const words = text.trim().split(' ');
    let wordCount = Number(words.length);

    let toWord = words.pop();
    let fromWord = words.pop();

    wordCount = wordCount - 2;

    let inserts = [];

    while (wordCount > 0) {
        const [from, to] = await Promise.all([
            TrieNodeModel.findOne({ characters: fromWord }),
            TrieNodeModel.findOne({ characters: toWord }),
        ]);

        if (!from || !to) {
            throw new Error("couldn't find words.");
        }

        const wordOrder = new WordOrderModel({ page, fromWord, toWord, from, to });
        inserts.push(wordOrder);

        if (inserts.length === 15000) {
            await WordOrderModel.insertMany(inserts);
            inserts = [];
            console.info(`Words remaining: ${wordCount}`);
        }

        toWord = fromWord;
        fromWord = words.pop();
        wordCount = wordCount - 1;
    }

    if (inserts.length) {
        WordOrderModel.insertMany(inserts);
    }
}

WordOrderModel.insertText = insertText;
WordOrderModel.getNextWords = getNextWords;

export { WordOrderModel };
