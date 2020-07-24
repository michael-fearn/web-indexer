import { WordOrderModel, WordOrder } from '.';
import { DocumentType } from '@typegoose/typegoose';

export function getNextWords(word: string, count = 5): Promise<DocumentType<WordOrder>[]> {
    return WordOrderModel.aggregate(
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
                $limit: count,
            },
        ],
        // eslint-disable-next-line
        () => {},
    );
}
