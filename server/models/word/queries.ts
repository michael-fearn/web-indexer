import { Word, WordModel } from '.';
import { DocumentType } from '@typegoose/typegoose';

export async function queryCharacters(
    characters: string,
    limit = 5,
): Promise<DocumentType<Word>[]> {
    return WordModel.aggregate(
        [
            {
                $match: {
                    characters,
                },
            },
            {
                $graphLookup: {
                    from: 'Words',
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
