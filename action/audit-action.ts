'use server'

import { prisma } from '@/lib/prisma'

export async function getAuditLogs(params: {
    page: number
    pageSize: number
    entity?: string
    action?: string
    userId?: string
}) {
    const { page, pageSize, entity, action, userId } = params
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (entity) {
        where.entity = entity
    }

    if (action) {
        where.action = action
    }

    if (userId) {
        where.userId = userId
    }

    const [data, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        }),
        prisma.auditLog.count({ where }),
    ])

    return {
        data,
        pageCount: Math.ceil(total / pageSize),
        total,
    }
}
