import { linkQueue } from './common/queue';
import { findOrCreatePage, addJobs } from './helpers';

(async (): Promise<void> => {
    const queueSize = await linkQueue.getSize();

    if (queueSize < 1) {
        const page = await findOrCreatePage(new URL('https://modcloth.com'), null);
        await addJobs(page);
        console.log('fired');
    }

    // const concurrentRequests = 5;
    // const loop = 0;
    // const loopLimit = 100;

    // while (queueSize > 0 && loop < loopLimit) {
    //     const promises: Promise<any>[] = [];
    //     for (let i = 0; i < concurrentRequests; i++) {
    //         promises.push(processAJob());
    //     }
    //     console.log('fired');
    //     await Promise.all(promises);
    //     // const promises = await Promise.all(
    //     //     new Array(concurrentRequests).fill(undefined).map(processAJob),
    //     // );
    //     console.log({ promises });

    //     queueSize = await getQueueSize();
    // }
    // console.log('finished');
    await findOrCreatePage(new URL('https://modcloth.com'), null);
})();
