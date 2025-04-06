"use client";

import { AdminPageTemplate } from "@/components/templates/admin-page";
import { CreateProductDialog } from "../components/CreateProductDialog";
import { ProductsTable } from "../components/ProductsTable";

export function ProductsPage() {
  return (
    <AdminPageTemplate title="제품 목록" actions={<CreateProductDialog />}>
      <ProductsTable />
    </AdminPageTemplate>
  );
}
