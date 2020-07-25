import { Request, Response, NextFunction } from 'express';
import { Index } from '../../lib';
import { ContentModel, PageModel } from '../../models';

export class IndexerController {
    public static async indexUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { url: rawUrl } = req.body;
        // if (typeof encodedUrl !== 'string') throw new Error('url must be string;');

        // const rawUrl = new Buffer(encodedUrl, 'base64').toString('ascii');
        try {
            const url = new URL(rawUrl);

            const existingPage = null; // await PageModel.findOne({ url: url.href });
            if (!existingPage) {
                const index = new Index(url);

                const page = await PageModel.updateOrInsert(index.url.href);
                // await WordModel.insertText(await index.plainText);
                await ContentModel.insertText(await index.plainText, page);
                res.send('Successfully indexed.');
            } else {
                res.send('Url already indexed.');
            }
        } catch (err) {
            next(err);
        }
    }
}
