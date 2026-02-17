import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '@/action/product-action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useProducts({ page, pageSize }: { page: number; pageSize: number }) {
    return useQuery({
        queryKey: ['products', page, pageSize],
        queryFn: () => getProducts({ page, pageSize }),
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (formData: FormData) => createProduct(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: { id: string; formData: FormData }) => updateProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}
