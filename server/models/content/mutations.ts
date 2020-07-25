import { DocumentType } from '@typegoose/typegoose';
import { Page } from '..';
import { WordModel } from '../word';
import { Content, ContentModel } from './index';

export async function insertText(text: string, page: DocumentType<Page>): Promise<void> {
    const words = text.trim().split(' ');
    let wordCount = Number(words.length);
    if (!words.length) return;

    let previousWord = null;
    let nextWord = words.pop() || null;

    wordCount = wordCount - 1;

    let previousContent: null | DocumentType<Content> = null;

    let inserts = [];

    while (wordCount > 0) {
        const [previousWordNode, nextWordNode] = await Promise.all([
            WordModel.findOne({ characters: previousWord || undefined }),
            WordModel.findOne({ characters: nextWord || undefined }),
        ]);

        if (!previousWordNode && !nextWordNode) {
            throw new Error(
                `Couldn't find Trie Nodes for words. A trie node for both words must exist before a word order can be created. `,
            );
        }

        const Content: DocumentType<Content> = await new ContentModel({
            page,
            previousWord,
            nextWord,
            previousWordNode,
            nextWordNode,
            previousContent,
            nextContent: null,
        });
        inserts.push(Content);

        if (previousContent) previousContent.nextContent = Content;
        previousContent = Content;

        if (inserts.length === 15000) {
            await ContentModel.insertMany(inserts);
            inserts = [];
            console.info(`Words remaining: ${wordCount}`);
        }

        previousWord = nextWord;
        nextWord = words.pop() || null;
        wordCount = wordCount - 1;
    }

    if (inserts.length) ContentModel.insertMany(inserts);
}
