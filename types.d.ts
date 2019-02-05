import { Source } from 'callbag';

export default function fromPromise<T>(promise: Promise<T>): Source<T>;
