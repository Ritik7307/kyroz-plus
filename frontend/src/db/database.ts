import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { kotSchema } from './schemas/kot.schema';

// Dev mode plugin
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
if (process.env.NODE_ENV === 'development') {
    addRxPlugin(RxDBDevModePlugin);
}

export type KyrozDatabase = RxDatabase;

let dbPromise: Promise<KyrozDatabase> | null = null;

export const getDatabase = () => {
    if (typeof window === 'undefined') {
        // Return null/reject on SSR
        return Promise.reject(new Error('RxDB cannot run on the server side.'));
    }
    if (!dbPromise) {
        dbPromise = _create();
    }
    return dbPromise;
};

const _create = async (): Promise<KyrozDatabase> => {
    console.log('DatabaseService: creating database..');
    const db = await createRxDatabase({
        name: 'kyrozdb',
        storage: getRxStorageDexie(),
        multiInstance: true,
        ignoreDuplicate: true
    });

    console.log('DatabaseService: creating collections');
    await db.addCollections({
        kots: {
            schema: kotSchema
        }
    });

    return db;
};
