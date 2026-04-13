import { Inventory } from "@/types/types";
import { buildApiUrl } from "./http";

export const fetchInventory = async (): Promise<Inventory[]> => {
  const response = await fetch(buildApiUrl("/api/v1/inventory"));

  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }

  const data: Inventory[] = await response.json();
  return data;
};
