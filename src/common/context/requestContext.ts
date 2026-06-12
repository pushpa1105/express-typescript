import { AsyncLocalStorage } from "node:async_hooks";

export interface ICurrentUser {
    getUserId(): string | undefined;
}

export const asyncLocalStorage = new AsyncLocalStorage<{
    user: {
        _id: string,
        role?: string,
        activeWorkspace?: string
    }
}>()

export class AsyncLocalStorageCurrentUser implements ICurrentUser {
    getUserId(): string | undefined {
        return asyncLocalStorage?.getStore?.()?.user?._id
    }
}
