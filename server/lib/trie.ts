export class Node {
    letter: string;
    parent: Node | null;
    end = false;
    occurrences?: number;
    children: { [letter: string]: Node } = {};

    constructor(letter: string, parent?: Node) {
        this.letter = letter;
        this.parent = parent || null;
    }

    public addChild(node: Node): void {
        this.children[node.letter] = node;
    }

    get characters(): string {
        const output: string[] = [];
        let node: Node | null = ((): this => this)();

        while (node !== null) {
            output.unshift(node.letter);
            node = node.parent;
        }

        return output.join('');
    }
}

export class Trie {
    public Node = Node;
    public root = new Node('');

    constructor(bodyOfText?: string) {
        if (bodyOfText)
            bodyOfText.split(' ').forEach((word) => this.insert(word.trim().toLowerCase()));
    }

    public insert(word: string): void {
        let node = this.root;

        for (let index = 0; index < word.length; index++) {
            const letter = word[index];
            if (!node.children[letter]) {
                node.addChild(new Node(letter, node));
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

        return Trie.wordsFromNode(node);
    }

    public get allWords(): string[] {
        return Trie.wordsFromNode(this.root);
    }

    private static wordsFromNode(node: Node): string[] {
        function iterate(children: { [letter: string]: Node }): string[] {
            return Object.values(children)
                .map(Trie.wordsFromNode)
                .flatMap((nested) => nested);
        }
        if (node.end) return [node.characters, ...iterate(node.children)];
        else return iterate(node.children);
    }
}
