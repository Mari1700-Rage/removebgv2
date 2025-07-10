'use client'

import { Toaster } from "@/components/ui/Toaster";
import { Provider, TablesSchema, useCreateQueries, useCreateStore } from "@/lib/schema";
import { ThemeProvider } from "next-themes";
// import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { createQueries, createStore } from 'tinybase/with-schemas';
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const store = useCreateStore(() => createStore()
        .setTablesSchema(TablesSchema)
    );

    // Create a persister in IndexedDb 
    // useCreatePersister(
    //     store,
    //     (store) => {
    //         return createIndexedDbPersister(store, "store");
    //     },
    //     [],
    //     async (persister) => {
    //         await persister?.startAutoLoad();
    //         await persister?.startAutoSave();
    //     }
    // );

    // Force set the initial theme to light if not already set
    useEffect(() => {
        // Check if we're in the browser and if theme is not already set
        if (typeof window !== 'undefined' && !localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'light');
        }
    }, []);

    const queries = useCreateQueries(store, createQueries, []);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true} // Keep system preference detection
            disableTransitionOnChange
        >
            <Provider store={store} queries={queries}>
                {children}
                <Toaster richColors closeButton />
            </Provider>
        </ThemeProvider>
    )
}