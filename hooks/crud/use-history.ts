import { getTransactions } from '@/action/history-action'
import { useQuery } from '@tanstack/react-query'

export function useTransactions({ page, pageSize, query }: { page: number; pageSize: number; query?: string }) {
    return useQuery({
        queryKey: ['transactions', page, pageSize, query],
        queryFn: () => getTransactions({ page, pageSize, query }),
    })
}
