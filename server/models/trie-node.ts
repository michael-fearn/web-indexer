import { prop, Ref, getModelForClass, DocumentType, mongoose } from '@typegoose/typegoose';
import { getEmptyDictionary } from './dictionary';
import { uniq } from 'lodash';

export class TrieNode {
    @prop({ default: false, index: true })
    root!: boolean;

    @prop({ ref: TrieNode, index: true, default: null })
    parent?: Ref<TrieNode>;

    @prop({ required: true })
    children!: { [letter: string]: mongoose.Types.ObjectId | null };

    @prop({ default: 0 })
    end!: boolean;

    @prop({ default: '' })
    letter?: string;
    @prop()
    occurrences!: number;

    @prop({ default: '', unique: true, index: true })
    characters?: string;

    public static insertText(text: string): Promise<DocumentType<TrieNode>[]> {
        text;
        throw new Error('insertText is meant to be overwritten');
    }
}
const TrieNodeModel = getModelForClass(TrieNode);

class TrieNodeUtils {
    private _root!: DocumentType<TrieNode>;

    private nodeRefs: { [_id: string]: DocumentType<TrieNode> } = {};

    public get root(): Promise<DocumentType<TrieNode>> {
        return (async (): Promise<DocumentType<TrieNode>> => {
            try {
                if (this._root) return Promise.resolve(this._root);

                let node = await TrieNodeModel.findOne({ root: true });
                if (!node) {
                    node = await TrieNodeModel.create({
                        root: true,
                        occurrences: 0,
                        end: false,
                        children: getEmptyDictionary(),
                    });
                }
                this._root = node;
                return node;
            } catch (err) {
                throw new Error(err);
            }
        })();
    }
    public insertText = async (text: string): Promise<DocumentType<TrieNode>[]> => {
        const promiseArrayHoldingNestedDocs = [];
        const words = text.split(' ');
        for (const word of words) {
            // promise wrapping an array of promises, await the wrapper to free promises to be handled by Promise.all
            const promise = Promise.all(await this.insert(word.trim().toLowerCase(), false));
            promiseArrayHoldingNestedDocs.push(promise);
        }

        const trieNodes = await Promise.all(promiseArrayHoldingNestedDocs).then((arr) =>
            arr.flatMap((val) => val),
        );

        delete this.nodeRefs;
        // All the nodes have been created / updated, and have been given references to one another. Save them all at once.
        return Promise.all(uniq(trieNodes).map((node) => node.save()));
    };

    private async insert(word: string, write = true): Promise<Promise<DocumentType<TrieNode>>[]> {
        const modifiedNodes: Promise<DocumentType<TrieNode>>[] = [];
        function applyWrite(doc: DocumentType<TrieNode>): Promise<DocumentType<TrieNode>> {
            return write ? doc.save() : Promise.resolve(doc);
        }

        let parentNode = await this.root;
        modifiedNodes.push(applyWrite(parentNode));
        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            const isEnd = index === word.length - 1;

            let childNode;
            if (!parentNode.children[letter]) {
                childNode = new TrieNodeModel({
                    letter,
                    characters: parentNode.characters + letter,
                    end: isEnd,
                    occurrences: 0,
                    children: getEmptyDictionary(),
                });

                parentNode.children[letter] = childNode._id;
                this.nodeRefs[childNode._id.toHexString()] = childNode;

                modifiedNodes.push(applyWrite(childNode));
            } else {
                childNode = this.nodeRefs[parentNode.children[letter]?.toHexString() || ''];
                if (!childNode) {
                    childNode = await TrieNodeModel.findOne({ _id: parentNode.children[letter] });
                    if (childNode) this.nodeRefs[childNode._id.toHexString()] = childNode;
                }
                if (!childNode)
                    throw new Error("Some how you've looked up a reference that doesn't exit!");
            }
            if (isEnd) {
                childNode.occurrences += 1;
                if (!childNode.isNew) modifiedNodes.push(applyWrite(childNode));
                return modifiedNodes;
            }
            parentNode = childNode;
        }
        throw new Error(
            'There might be some trouble with the end of word logic on TrieNode.insert.',
        );
    }
}

const trieNodeUtils = new TrieNodeUtils();
TrieNodeModel.insertText = trieNodeUtils.insertText;

export { TrieNodeModel };
