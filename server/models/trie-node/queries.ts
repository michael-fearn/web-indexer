import { TrieNode, TrieNodeModel } from '.';

export async function queryCharacters(characters: string): Promise<TrieNode[]> {
    return TrieNodeModel.aggregate<TrieNode>(
        [
            {
                $match: {
                    characters,
                },
            },
            {
                $graphLookup: {
                    from: 'trienodes',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    as: 'nodes',
                    maxDepth: 100,
                    depthField: 'depth',
                },
            },
            {
                $unwind: {
                    path: '$nodes',
                    includeArrayIndex: 'index',
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$nodes',
                },
            },
            {
                $match: {
                    isEnd: true,
                },
            },
            {
                $sort: {
                    occurrences: -1,
                },
            },
            {
                $limit: 15,
            },
        ],
        // eslint-disable-next-line
        () => {},
    );
}
