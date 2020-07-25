import { DocumentType } from '@typegoose/typegoose';
import { WordModel, Word } from './index';
import { uniq } from 'lodash';

export class WordInsert {
    constructor() {
        // this method is being attached to the WordModel.
        this.insertText = this.insertText.bind(this);
    }

    private root!: DocumentType<Word>;

    private nodeRefs: { [_id: string]: DocumentType<Word> } = {};

    public async setRoot(): Promise<void> {
        if (!this.root) {
            let node = await WordModel.findOne({ root: true });

            if (!node) {
                node = new WordModel({
                    root: true,
                    occurrences: 0,
                    isEnd: false,
                    children: getEmptyDictionary(),
                });
            }
            this.root = node;
        }
    }

    public async insertText(text: string): Promise<DocumentType<Word>[]> {
        const promiseArrayHoldingNestedDocs = [];
        const words = text.split(' ');
        for (const word of words) {
            // promise wrapping an array of promises, await the wrapper to free promises to be handled by Promise.all
            const promise = Promise.all(await this.insert(word.trim().toLowerCase(), false));
            promiseArrayHoldingNestedDocs.push(promise);
        }

        const Words = await Promise.all(promiseArrayHoldingNestedDocs).then((arr) =>
            arr.flatMap((val) => val),
        );

        // All the nodes have been created / updated, and have been given references to one another. Save them all at once.
        const { newNodes, updatedNodes } = uniq(Words).reduce(
            (group, doc) => {
                if (doc.isNew) group.newNodes.push(doc);
                else group.updatedNodes.push(doc);
                return group;
            },
            {
                newNodes: [],
                updatedNodes: [],
            } as {
                newNodes: DocumentType<Word>[];
                updatedNodes: DocumentType<Word>[];
            },
        );
        const docs = [
            ...(await WordModel.insertMany(newNodes)),
            ...(await Promise.all(updatedNodes.map((node) => node.save()))),
            await this.root.save(),
        ];
        delete this.nodeRefs;
        return docs;
    }

    private async insert(word: string, write = true): Promise<Promise<DocumentType<Word>>[]> {
        await this.setRoot();

        const modifiedNodes: Promise<DocumentType<Word>>[] = [];
        function applyWrite(doc: DocumentType<Word>): Promise<DocumentType<Word>> {
            return write ? doc.save() : Promise.resolve(doc);
        }

        let parentNode = this.root;

        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            const isEnd = index === word.length - 1;

            let childNode;
            if (!parentNode.children[letter]) {
                childNode = new WordModel({
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
                const ref = parentNode.children[letter]?.toHexString() || '';
                childNode = this.nodeRefs[ref];
                if (!childNode) {
                    childNode = await WordModel.findOne({ _id: parentNode.children[letter] });
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
        throw new Error('There might be some trouble with the isEnd of word logic on Word.insert.');
    }
}

import { mongoose } from '@typegoose/typegoose';

function getEmptyDictionary(): { [letter: string]: mongoose.Types.ObjectId | null } {
    return {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
        f: null,
        g: null,
        h: null,
        i: null,
        j: null,
        k: null,
        l: null,
        m: null,
        n: null,
        o: null,
        p: null,
        q: null,
        r: null,
        s: null,
        t: null,
        u: null,
        v: null,
        w: null,
        x: null,
        y: null,
        z: null,
    };
}
