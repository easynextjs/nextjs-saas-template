import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../api";
import {
  CreateProductInput,
  UpdateProductInput,
  DeleteProductInput,
} from "../schema";

export function useProducts(workspaceId: number) {
  return useQuery({
    queryKey: ["products", workspaceId],
    queryFn: () => getProducts({ workspaceId }),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.workspaceId],
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProduct(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.workspaceId],
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteProductInput) => deleteProduct(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.workspaceId],
      });
    },
  });
}
