import {
  createCategory,
  deleteCategory,
  deleteCategoryBulk,
  getCategories,
  updateCategory,
} from '@/action/category-action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
type Params = {
  page: number;
  pageSize: number;
};

export function useCategories(params: Params) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  });
}
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
export function useDeleteCategoryBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
