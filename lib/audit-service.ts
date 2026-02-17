import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/get-session'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'OTHER'

interface LogAuditParams {
    action: AuditAction
    entity: string
    entityId: string
    details?: Record<string, any>
    userId?: string
}

export async function logAudit(params: LogAuditParams) {
    try {
        const session = await getServerSession()
        const userId = params.userId || session?.user?.id

        await prisma.auditLog.create({
            data: {
                action: params.action,
                entity: params.entity,
                entityId: params.entityId,
                details: params.details ? JSON.stringify(params.details) : null,
                userId: userId || null,
            },
        })
    } catch (error) {
        console.error('Failed to create audit log:', error)
        // We don't want to throw here to avoid blocking the main action
    }
}
