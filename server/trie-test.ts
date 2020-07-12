import { TrieNodeModel } from './models';
import { mongoose } from './common/db';
(async (): Promise<void> => {
    await mongoose;
    await TrieNodeModel.insertText('Hello Hello2');
    new TrieNodeModel({});
})();
