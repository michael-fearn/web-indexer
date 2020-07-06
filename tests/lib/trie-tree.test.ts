import { Trie } from '../../src/lib/trie';

describe('Trie', () => {
    test('insertion', () => {
        const trie = new Trie();
        trie.insert('Hello');
        expect(trie.contains('H')).toBeFalsy();
        expect(trie.contains('He')).toBeFalsy();
        expect(trie.contains('Hel')).toBeFalsy();
        expect(trie.contains('Hell')).toBeFalsy();
        expect(trie.contains('Hello')).toBeTruthy();
    });

    test('find', () => {
        const trie = new Trie();
        trie.insert('the');
        trie.insert('that');
        trie.insert('then');
        trie.insert('they');
        trie.insert('their');
        trie.insert("they're");
        trie.insert('train');

        const found = trie.find('th');
        const shouldContain = ['the', 'that', 'then', 'they', 'their', "they're"];

        expect(found.every((word) => shouldContain.includes(word))).toBeTruthy();
    });
    test('allWords', () => {
        const trie = new Trie();
        trie.insert('the');
        trie.insert('that');
        trie.insert('then');
        trie.insert('they');
        trie.insert('their');
        trie.insert("they're");
        trie.insert('train');

        const found = trie.allWords;
        const shouldContain = ['the', 'that', 'then', 'they', 'their', "they're", 'train'];

        expect(found.every((word) => shouldContain.includes(word))).toBeTruthy();
    });

    test('contains', () => {
        const trie = new Trie();
        trie.insert('the');
        trie.insert('the');
        trie.insert('that');
        trie.insert('then');
        trie.insert('they');

        expect(trie.contains('the')).toEqual({ occurrences: 2 });
        expect(trie.contains('tha')).toBeFalsy();
        expect(trie.contains('then')).toEqual({ occurrences: 1 });
        expect(trie.contains('they')).toEqual({ occurrences: 1 });
    });
});
