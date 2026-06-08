import { Inventory } from "@/types/types";
import { catalogInventory } from "@/data/catalogProducts";

export const fetchInventory = async (): Promise<Inventory[]> => {
  return catalogInventory;
};
