import { DocumentType } from '@typegoose/typegoose';
import { Page } from '../';
import { TrieNodeModel } from '../trie-node';
import { WordOrder, WordOrderModel } from './index';

export async function insertText(text: string, page: DocumentType<Page>): Promise<void> {
    const words = text.trim().split(' ');
    let wordCount = Number(words.length);
    if (!words.length) return;

    let previousWord = null;
    let nextWord = words.pop() || null;

    wordCount = wordCount - 1;

    let previousWordOrder: null | DocumentType<WordOrder> = null;

    let inserts = [];

    while (wordCount > 0) {
        const [previousTrieNode, nextTrieNode] = await Promise.all([
            TrieNodeModel.findOne({ characters: previousWord || undefined }),
            TrieNodeModel.findOne({ characters: nextWord || undefined }),
        ]);

        if (!previousTrieNode && !nextTrieNode) {
            throw new Error(
                `Couldn't find Trie Nodes for words. A trie node for both words must exist before a word order can be created. `,
            );
        }

        const wordOrder: DocumentType<WordOrder> = await new WordOrderModel({
            page,
            previousTrieNode,
            nextTrieNode,
            previousWord,
            nextWord,
            previousWordOrder,
            nextWordOrder: null,
        });
        inserts.push(wordOrder);

        if (previousWordOrder) previousWordOrder.nextWordOrder = wordOrder;
        previousWordOrder = wordOrder;

        if (inserts.length === 15000) {
            await WordOrderModel.insertMany(inserts);
            inserts = [];
            console.info(`Words remaining: ${wordCount}`);
        }

        previousWord = nextWord;
        nextWord = words.pop() || null;
        wordCount = wordCount - 1;
    }

    if (inserts.length) WordOrderModel.insertMany(inserts);
}
