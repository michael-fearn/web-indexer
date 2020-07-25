import {
    prop,
    Ref,
    getModelForClass,
    DocumentType,
    mongoose,
    modelOptions,
    Severity,
} from '@typegoose/typegoose';
import { TrieNodeUtils } from './utils';

@modelOptions({ options: { allowMixed: Severity.ALLOW } }) // for the children
export class TrieNode {
    @prop({ default: false, index: true })
    root!: boolean;

    @prop({ ref: TrieNode, index: true, default: null })
    parent?: Ref<TrieNode>;

    @prop({ required: true })
    children!: { [letter: string]: mongoose.Types.ObjectId };

    @prop({ default: false, index: true })
    isEnd!: boolean;

    @prop({ default: '' })
    letter?: string;

    @prop()
    occurrences!: number;

    @prop({ default: '', unique: true, index: true })
    characters!: string;

    public static insertText(text: string): Promise<DocumentType<TrieNode>[]> {
        text;
        throw new Error('insertText is meant to be overwritten');
    }
}
const TrieNodeModel = getModelForClass(TrieNode);

const trieNodeUtils = new TrieNodeUtils();
TrieNodeModel.insertText = trieNodeUtils.insertText;

export { TrieNodeModel };
