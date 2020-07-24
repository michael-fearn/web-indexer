import express from 'express';
import { router } from './api/routes';
import bodyParser from 'body-parser';
import { mongoose } from './common/db';
import cors from 'cors';
mongoose.then(() => {
    const app = express();
    // app.get('/hello', (req, res) => res.send('world'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(router);
    app.listen(4000, () => console.log('listening on 4000.'));
});
