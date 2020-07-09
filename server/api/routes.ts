import { Router, Request, Response, NextFunction } from 'express';

function handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err.name.includes(':')) {
        const [code, message] = err.name.split(':');
        res.status(Number(code)).send(message);
    } else {
        console.error(err.stack);
        res.status(500);
    }
}

function requireQueryParam(param: string) {
    return function middleware(req: Request, res: Response, next: NextFunction): void {
        if (req.query[param] === undefined) {
            next(new Error(`400:Missing a required query parameter: ${param}.`));
        }
    };
}

const router = Router();
router.use(handleError);

router
    // provides auto complete for typing
    .get('/query/trie/:characters')
    // provides
    .get('/query/word/:word')
    .get('/query/page/:match', requireQueryParam('type'));
