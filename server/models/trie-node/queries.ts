import { TrieNode, TrieNodeModel } from '.';
import { DocumentType } from '@typegoose/typegoose';

export async function queryCharacters(
    characters: string,
    limit = 5,
): Promise<DocumentType<TrieNode>[] | void> {
    return TrieNodeModel.aggregate(
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
                $addFields: {
                    children: '$$REMOVE',
                },
            },
            {
                $sort: {
                    occurrences: -1,
                },
            },
            {
                $limit: limit,
            },
        ],
        // eslint-disable-next-line
        () => {},
    );
}
