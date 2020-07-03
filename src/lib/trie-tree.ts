class TrieNode {
    key: string;
    parent: TrieNode | null;
    end = false;
    occurrences?: number;
    children: { [letter: string]: TrieNode } = {};

    constructor(letter: string, parent?: TrieNode) {
        this.key = letter;
        this.parent = parent || null;
    }

    public addChild(node: TrieNode) {
        this.children[node.key] = node;
    }

    get word(): string {
        const output: string[] = [];
        let node: TrieNode | null = (() => this)();

        while (node !== null) {
            output.unshift(node.key);
            node = node.parent;
        }

        return output.join('');
    }
}

export class TrieTree {
    root = new TrieNode('');

    public insert(word: string): void {
        let node = this.root;

        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            if (!node.children[letter]) {
                node.addChild(new TrieNode(letter, node));
            }
            if (index === word.length - 1) {
                const child = node.children[letter];
                child.end = true;
                child.occurrences = (child.occurrences || 0) + 1;

                return;
            }
            node = node.children[letter];
        }
    }

    public contains(word: string): { occurrences: number } | false {
        let node = this.root;

        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            const child = node.children[letter];
            if (!child) return false;
            node = child;
        }

        if (node.end) {
            return { occurrences: node.occurrences || 0 };
        } else {
            return false;
        }
    }

    public find(prefix: string): string[] {
        let node = this.root;

        for (let index = 0; index < prefix.length; index++) {
            const letter = prefix[index];
            const child = node.children[letter];
            if (!child) return [];
            node = child;
        }

        return TrieTree.getAllWords(node);
    }

    private static getAllWords(node: TrieNode): string[] {
        function iterate(children: { [letter: string]: TrieNode }) {
            return Object.values(children)
                .map(TrieTree.getAllWords)
                .flatMap((nested) => nested);
        }
        if (node.end) return [node.word, ...iterate(node.children)];
        else return iterate(node.children);
    }
}
