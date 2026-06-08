import { Product } from "../types/types";
import { findCatalogProductById } from "@/data/catalogProducts";
import { buildApiUrl } from "./http";

export async function fetchProductById(id: number): Promise<Product> {
  const localProduct = findCatalogProductById(id);

  if (localProduct) {
    return localProduct;
  }

  const response = await fetch(buildApiUrl(`/api/v1/products/${id}`));

  if (!response.ok) {
    throw new Error(`Erro ao buscar produto (status ${response.status})`);
  }

  const data: Product = await response.json();
  return data;
}
