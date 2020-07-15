import { getEmptyDictionary } from './dictionary';
import { DocumentType } from '@typegoose/typegoose';
import { TrieNodeModel, TrieNode } from './index';
import { uniq } from 'lodash';

export class TrieNodeUtils {
    constructor() {
        // this method is being attached to the TrieNodeModel.
        this.insertText = this.insertText.bind(this);
    }

    private root!: DocumentType<TrieNode>;

    private nodeRefs: { [_id: string]: DocumentType<TrieNode> } = {};

    public async setRoot(): Promise<void> {
        if (!this.root) {
            let node = await TrieNodeModel.findOne({ root: true });

            if (!node) {
                node = new TrieNodeModel({
                    root: true,
                    occurrences: 0,
                    isEnd: false,
                });
            }
            this.root = node;
        }
    }

    public async insertText(text: string): Promise<DocumentType<TrieNode>[]> {
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
        const { newNodes, updatedNodes } = uniq(trieNodes).reduce(
            (group, doc) => {
                if (doc.isNew) group.newNodes.push(doc);
                else group.updatedNodes.push(doc);
                return group;
            },
            {
                newNodes: [],
                updatedNodes: [],
            } as {
                newNodes: DocumentType<TrieNode>[];
                updatedNodes: DocumentType<TrieNode>[];
            },
        );
        return [
            ...(await TrieNodeModel.insertMany(newNodes)),
            ...(await Promise.all(updatedNodes.map((node) => node.save()))),
            await this.root.save(),
        ];
    }

    private async insert(word: string, write = true): Promise<Promise<DocumentType<TrieNode>>[]> {
        await this.setRoot();

        const modifiedNodes: Promise<DocumentType<TrieNode>>[] = [];
        function applyWrite(doc: DocumentType<TrieNode>): Promise<DocumentType<TrieNode>> {
            return write ? doc.save() : Promise.resolve(doc);
        }

        let parentNode = this.root;

        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            const isEnd = index === word.length - 1;

            let childNode;
            if (!parentNode.children[letter]) {
                childNode = new TrieNodeModel({
                    letter,
                    characters: parentNode.characters + letter,
                    occurrences: 0,
                    parent: parentNode._id,
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
                const { characters } = childNode;
                if (characters.length > 1 || characters === 'a' || characters === 'i') {
                    childNode.isEnd = isEnd;
                    childNode.occurrences += 1;
                }
                if (!childNode.isNew) modifiedNodes.push(applyWrite(childNode));
                return modifiedNodes;
            }
            parentNode = childNode;
        }
        throw new Error(
            'There might be some trouble with the isEnd of word logic on TrieNode.insert.',
        );
    }
}
