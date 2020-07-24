import { Request, Response } from 'express';
import { queryCharacters } from '../../models/trie-node/queries';
import { WordOrderModel } from '../../models';

export class TrieController {
    public static async characters(req: Request, res: Response): Promise<unknown> {
        let { characters } = req.body;
        if (!characters) characters = '';

        const completions = await queryCharacters(characters.trim().toLowerCase());

        const completionsWithPredictions = await Promise.all(
            completions.map((doc) =>
                WordOrderModel.getNextWords(doc.characters).then((predictions) => ({
                    ...doc,
                    predictions,
                })),
            ),
        );

        return res.jsonp({ completionsWithPredictions });
    }
}
