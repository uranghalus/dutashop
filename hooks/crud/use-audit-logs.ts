import { getAuditLogs } from '@/action/audit-action'
import { useQuery } from '@tanstack/react-query'

export function useAuditLogs({
    page,
    pageSize,
    entity,
    action,
    userId,
}: {
    page: number
    pageSize: number
    entity?: string
    action?: string
    userId?: string
}) {
    return useQuery({
        queryKey: ['audit-logs', page, pageSize, entity, action, userId],
        queryFn: () => getAuditLogs({ page, pageSize, entity, action, userId }),
    })
}
