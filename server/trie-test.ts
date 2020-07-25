import { WordModel } from './models';
import { mongoose } from './common/db';
import { Index } from './lib';
(async (): Promise<void> => {
    await mongoose;
    const index = new Index(new URL('https://www.nerdfitness.com/blog/'));
    await WordModel.insertText(await index.plainText);
    new WordModel({});
})();
