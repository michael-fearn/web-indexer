import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { TrieNode } from './trie-node';
export class Word {
    @prop({ required: true })
    trieNode!: Ref<TrieNode>;

    @prop({ required: true, index: true })
    word!: string;

    @prop({ required: true, index: true })
    occurrences!: number;
}

export const WordModel = getModelForClass(Word);
