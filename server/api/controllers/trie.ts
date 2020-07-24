import { Request, Response } from 'express';
import { queryCharacters } from '../../models/trie-node/queries';
import { WordOrderModel } from '../../models';

export class TrieController {
    public static async characters(req: Request, res: Response): Promise<unknown> {
        let { characters } = req.body;
        if (!characters) characters = '';

        const completions = await queryCharacters(characters.trim().toLowerCase());

        let predictions;
        if (completions) {
            predictions = Promise.all(
                completions.map((doc) => WordOrderModel.getNextWords(doc.characters)),
            ).then((nested) => nested.flatMap((predictions) => predictions));
        }

        return res.jsonp({ completions, predictions });
    }
}
