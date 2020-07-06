import { getQueueSize, addJobs, processAJob } from './models/queue';
import { createPage } from './models/page';

(async () => {
    let queueSize = await getQueueSize();

    if (queueSize < 1) {
        const page = await createPage(new URL('https://modcloth.com'), null);
        await addJobs(page);
    }

    const concurrentRequests = 10;
    const loop = 0;
    const loopLimit = 100;

    while (queueSize > 0 && loop < loopLimit) {
        await Promise.all(new Array(concurrentRequests).fill(undefined).map(processAJob));

        queueSize = await getQueueSize();
    }
})();
