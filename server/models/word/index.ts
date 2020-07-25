import {
    prop,
    Ref,
    getModelForClass,
    DocumentType,
    mongoose,
    modelOptions,
    Severity,
} from '@typegoose/typegoose';
import { WordInsert } from './mutations';

@modelOptions({ options: { allowMixed: Severity.ALLOW } }) // for the children
export class Word {
    @prop({ default: false, index: true })
    root!: boolean;

    @prop({ ref: Word, index: true, default: null })
    parent?: Ref<Word>;

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

    public static insertText(text: string): Promise<DocumentType<Word>[]> {
        return new WordInsert().insertText(text);
    }
}

export const WordModel = getModelForClass(Word);
