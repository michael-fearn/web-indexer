import { Router, Request, Response, NextFunction } from 'express';
import { TrieController, IndexerController } from './controllers/';

// function handleError(err: Error, req: Request, res: Response): void {
//     if (err?.name?.includes(':')) {
//         const [code, message] = err.name.split(':');
//         res.status(Number(code)).send(message);
//     } else {
//         console.error(err.stack);
//         res.status(500);
//     }
// }

function requireQueryParam(param: string) {
    return function middleware(req: Request, res: Response, next: NextFunction): void {
        if (req.query[param] === undefined) {
            next(new Error(`400:Missing a required query parameter: ${param}.`));
        }
    };
}

export const router = Router()
    // provides auto complete for typing
    .get('/hello', (req, res) => res.send('world'))
    .post('/query/trie', TrieController.characters)
    .post('/index/', IndexerController.indexUrl)
    // provides
    .get('/query/word/:word')
    .get('/query/page/:match', requireQueryParam('type'));
// .use(handleError);
