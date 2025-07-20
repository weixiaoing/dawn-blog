
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
export const queryClient = new QueryClient()
export const AppProvider = ({ children }: { children: React.ReactNode }) => {

  return <QueryClientProvider client={queryClient}>

      {children}

  </QueryClientProvider>
} 