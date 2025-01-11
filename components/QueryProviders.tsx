"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

const QueryProviders: React.FC<ProvidersProps> = ({ children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProviders;