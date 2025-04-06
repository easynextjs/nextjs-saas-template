import { Tables } from "@/lib/supabase/types_db";
import { createMainClient } from "@/lib/remote/main/client";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductsInput,
  UpdateProductInput,
} from "./schema";

export type Product = Tables<"product">;

export async function getProducts(input: GetProductsInput) {
  const client = createMainClient();
  return client.get<Product[]>(`/products?workspaceId=${input.workspaceId}`);
}

export async function createProduct(input: CreateProductInput) {
  const client = createMainClient();
  return client.post<Product>(`/products`, input);
}

export async function updateProduct(input: UpdateProductInput) {
  const client = createMainClient();
  return client.put<Product>(`/products/${input.id}`, input);
}

export async function deleteProduct(input: DeleteProductInput) {
  const client = createMainClient();
  return client.delete<boolean>(
    `/products/${input.id}?workspaceId=${input.workspaceId}`
  );
}
