'use server'

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { productFormSchema } from '@/schema/product-schema';
import { Prisma } from '@/generated/prisma/client';
import { logAudit } from '@/lib/audit-service';

export async function getProducts(params: {
    page: number
    pageSize: number
    query?: string
}) {
    const { page, pageSize, query } = params
    const skip = page * pageSize

    const where: Prisma.productWhereInput = query
        ? {
              OR: [
                  { name: { contains: query } },
                  { sku: { contains: query } },
              ],
          }
        : {}

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
            },
        }),
        prisma.product.count({ where }),
    ])

    const formattedData = data.map((item) => ({
        ...item,
        price: item.price.toNumber(),
    }))

    return {
        data: formattedData,
        pageCount: Math.ceil(total / pageSize),
        total,
    }
}

export async function createProduct(formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        stock: formData.get('stock') as string,
        sku: formData.get('sku') as string,
        categoryId: formData.get('categoryId') as string,
    }

    const validatedFields = productFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        throw new Error('Invalid fields')
    }

    const { name, description, price, stock, sku, categoryId } = validatedFields.data

    await prisma.product.create({
        data: {
            id: crypto.randomUUID(),
            name,
            description,
            price,
            stock,
            sku,
            categoryId,
            updatedAt: new Date(),
        },
    })

    await logAudit({
        action: 'CREATE',
        entity: 'Product',
        entityId: sku,
        details: { name, sku, price, stock },
    })

    revalidatePath('/products')
}

export async function updateProduct(params: { id: string; formData: FormData }) {
    const { id, formData } = params
    
    const rawData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        stock: formData.get('stock') as string,
        sku: formData.get('sku') as string,
        categoryId: formData.get('categoryId') as string,
    }

    const validatedFields = productFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        throw new Error('Invalid fields')
    }

    const { name, description, price, stock, sku, categoryId } = validatedFields.data

    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            stock,
            sku,
            categoryId,
            updatedAt: new Date(),
        },
    })

    await logAudit({
        action: 'UPDATE',
        entity: 'Product',
        entityId: id,
        details: { name, sku, price, stock },
    })

    revalidatePath('/products')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    })

    await logAudit({
        action: 'DELETE',
        entity: 'Product',
        entityId: id,
    })

    revalidatePath('/products')
}
