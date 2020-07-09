import { prop, Ref, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { Trie } from '../lib';
import { Word } from './word';
export class TrieNode {
    @prop({ default: false, index: true })
    isRoot!: boolean;

    @prop({ ref: TrieNode, index: true })
    parent?: Ref<TrieNode>;

    @prop({ items: TrieNode })
    children?: Ref<TrieNode>[];

    @prop({ default: false })
    end!: boolean;

    @prop({ required: true })
    key!: string;

    @prop({ required: true })
    characters!: string;

    // TODO: public static writeTrie(trie: Trie): Promise<DocumentType<Word>[]> {}
}

export const TrieNodeModel = getModelForClass(TrieNode);
