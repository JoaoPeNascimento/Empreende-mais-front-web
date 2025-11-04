import { Product } from "../types/types";

const API_URL = "http://localhost:3001/api/v1/products";

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar produto (status ${response.status})`);
  }

  const data: Product = await response.json();
  return data;
}
