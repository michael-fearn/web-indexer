import { mongoose } from '@typegoose/typegoose';

export function getEmptyDictionary(): { [letter: string]: mongoose.Types.ObjectId | null } {
    return {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
        f: null,
        g: null,
        h: null,
        i: null,
        j: null,
        k: null,
        l: null,
        m: null,
        n: null,
        o: null,
        p: null,
        q: null,
        r: null,
        s: null,
        t: null,
        u: null,
        v: null,
        w: null,
        x: null,
        y: null,
        z: null,
    };
}