import mongoDbQueue from 'mongodb-queue';
import { Mongoose, mongo } from 'mongoose';
import { mongoose } from './db';
interface Payload {
    parentId: string;
    url: string;
}

interface QueueMessage {
    ack: string;
    payload: Payload;
    tries: number;
}

class LinkQueue {
    private queue: Promise<mongoDbQueue.Queue>;
    constructor(connection: Promise<Mongoose>) {
        this.queue = connection.then((conn) => mongoDbQueue(conn.connection.db, 'link-queue'));
    }

    public getSize(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            (await this.queue).size((err, count) => {
                if (err) reject(err);
                resolve(count);
            });
        });
    }

    public add(payload: Payload): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.queue).add(JSON.stringify(payload), (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    public get(): Promise<QueueMessage> {
        return new Promise(async (resolve, reject) => {
            (await this.queue).get(async (err, msg) => {
                if (err) reject(err);
                else if (msg) resolve({ ...msg, payload: JSON.parse(msg.payload) });
                else reject('LinkQueue.get => No message.');
            });
        });
    }

    public remove(ack: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.queue).ack(ack, (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }
}

export const linkQueue = new LinkQueue(mongoose);
