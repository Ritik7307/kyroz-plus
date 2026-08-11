import { useEffect, useState } from 'react';
import { getDatabase, KyrozDatabase } from './database';
import { replicateRxCollection } from 'rxdb/plugins/replication';

export const useDatabase = () => {
    const [db, setDb] = useState<KyrozDatabase | null>(null);

    useEffect(() => {
        let isMounted = true;
        const initDB = async () => {
            try {
                const database = await getDatabase();
                if (isMounted) {
                    setDb(database);
                    
                    // Setup replication
                    const token = localStorage.getItem('token');
                    if (token && database.kots) {
                        console.log('Starting RxDB Sync...');
                        replicateRxCollection({
                            collection: database.kots,
                            replicationIdentifier: 'kot-sync',
                            push: {
                                handler: async (docs) => {
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sync/push`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(docs),
                                    });
                                    if (!response.ok) throw new Error('Push failed');
                                    return []; // RxDB expects conflicts, returning [] means success
                                }
                            },
                            pull: {
                                handler: async (checkpoint) => {
                                    const minTimestamp = checkpoint ? checkpoint.updatedAt : 0;
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sync/pull?minTimestamp=${minTimestamp}`, {
                                        method: 'POST', 
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });
                                    if (!response.ok) throw new Error('Pull failed');
                                    const data = await response.json();
                                    return {
                                        documents: data.documents,
                                        checkpoint: data.checkpoint
                                    };
                                }
                            }
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to init database", err);
            }
        };
        initDB();
        return () => { isMounted = false; };
    }, []);

    return db;
};
