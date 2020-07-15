import { TrieNodeModel } from './models';
import { mongoose } from './common/db';
import { Index } from './lib';
(async (): Promise<void> => {
    await mongoose;
    const index = new Index(
        new URL('https://blog.cleancoder.com/uncle-bob/2019/11/08/OpenLetterLinuxFoundation.html'),
    );
    await TrieNodeModel.insertText(await index.plainText);
    new TrieNodeModel({});
})();
