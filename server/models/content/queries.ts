import { ContentModel, Content } from '.';
import { DocumentType } from '@typegoose/typegoose';

export function getNextWords(word: string, limit = 1): Promise<DocumentType<Content>[]> {
    return ContentModel.aggregate(
        [
            {
                $match: {
                    fromWord: word,
                },
            },
            {
                $group: {
                    _id: {
                        fromWord: '$fromWord',
                        toWord: '$toWord',
                        to: '$to',
                        from: '$from',
                    },
                    pages: {
                        $addToSet: '$page',
                    },
                    occurrences: {
                        $sum: 1,
                    },
                    fromWord: {
                        $first: '$fromWord',
                    },
                    toWord: {
                        $first: '$toWord',
                    },
                    to: {
                        $first: '$to',
                    },
                    from: {
                        $first: '$from',
                    },
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
