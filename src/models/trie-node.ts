// import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
// export class TrieNode {
//     @prop({ default: false })
//     isRoot!: boolean;

//     @prop({ ref: TrieNode })
//     parent?: Ref<TrieNode>;

//     @prop({ items: TrieNode })
//     children?: Ref<TrieNode>[];

//     @prop({ default: false })
//     end!: boolean;

//     @prop({ required: true })
//     key!: string;

//     @prop()
//     occurrences?: number;
// }

// export const TrieNodeModel = getModelForClass(TrieNode);
