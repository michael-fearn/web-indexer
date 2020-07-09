import { DocumentType } from '@typegoose/typegoose';
import { Page, Link, PageModel, LinkModel } from './models';
import { linkQueue } from './common/queue';
import { Index } from './lib';

export async function addJobs(page: DocumentType<Page>): Promise<void> {
    await Promise.all(
        page.hrefs.map((url) => {
            return PageModel.findOne({ url }).then((child) => {
                if (child) {
                    findOrCreateLink(page, child);
                    return;
                }
                return linkQueue.add({ parentId: page.id, url });
            });
        }),
    );
}

export async function processAJob(): Promise<void> {
    return linkQueue
        .get()
        .then(({ payload, ack }) =>
            PageModel.findById(payload.parentId).then((parent) =>
                findOrCreatePage(new URL(payload.url), parent).then((page) =>
                    linkQueue.remove(ack).then(() => addJobs(page)),
                ),
            ),
        );
}

export async function findOrCreateLink(
    parent: DocumentType<Page>,
    child: DocumentType<Page>,
): Promise<DocumentType<Link>> {
    let start = performance.now();
    const { url: parentUrl, urlHash: parentUrlHash } = parent;
    const { url: childUrl, urlHash: childUrlHash } = child;

    const existingLink = await LinkModel.findOne({ parentUrlHash, childUrlHash });
    console.log('searching for existing Link:', performance.now() - start);
    start = performance.now();
    if (existingLink) return existingLink;

    const newLink = LinkModel.create({
        parent,
        parentUrl,
        parentUrlHash,
        child,
        childUrl,
        childUrlHash,
    });
    console.log('Creating new Link:', performance.now() - start);
    return newLink;
}

export async function findOrCreatePage(
    url: URL,
    parent: DocumentType<Page> | null,
): Promise<DocumentType<Page>> {
    let child = await PageModel.findOne({ url: url.href });

    if (!child) {
        const { html, urls } = new Index(url);
        const hrefs = (await urls).map((url) => url.href);

        child = await PageModel.create({
            url: url.href,
            urlHash: url.href,
            hrefs,
            html: await html,
        });
    }
    if (parent) findOrCreateLink(parent, child);

    return child;
}
