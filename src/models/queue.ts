import mongoDbQueue from 'mongodb-queue';
import { connection } from '../common/db';
import { DocumentType } from '@typegoose/typegoose';
import { Page, findOrCreatePage, PageModel } from './page';
import { findOrCreateLink } from '.';

export const linkQueue = connection.then((conn) => mongoDbQueue(conn.connection.db, 'link-queue'));

export function getQueueSize(): Promise<number> {
    return new Promise(async (resolve, reject) => {
        (await linkQueue).size((err, count) => {
            if (err) {
                reject(err);
            }
            resolve(count);
        });
    });
}

interface Payload {
    parentId: string;
    url: string;
}

export async function addJobs(page: DocumentType<Page>) {
    const queue = await linkQueue;
    (await page.hrefs).map(async (url) => {
        const child = await PageModel.findOne({ url });
        if (child) {
            findOrCreateLink(page, child);
        } else {
            const payload: Payload = { parentId: page.id, url };
            //eslint-disable-next-line  @typescript-eslint/no-empty-function
            queue.add(JSON.stringify(payload), () => {});
        }
    });
}

export async function processAJob() {
    const queue = await linkQueue;
    return new Promise((resolve, reject) => {
        queue.get(async (err, message) => {
            if (err) reject(err);
            if (message) {
                const payload = JSON.parse(message.payload) as Payload;
                const parent = await PageModel.findById(payload.parentId);
                findOrCreatePage(new URL(payload.url), parent).then((page) => {
                    // eslint-disable-next-line  @typescript-eslint/no-empty-function
                    queue.ack(message.ack, () => {});

                    addJobs(page).then(resolve);
                });
            }
        });
    });
}
