import { Inventory } from "@/types/types";

const API_URL = process.env.API_URL || "http://localhost:3001/api/estoque";

export const fetchInventory = async (): Promise<Inventory[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }

  const data: Inventory[] = await response.json();
  return data;
};
