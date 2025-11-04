export interface Product {
  id: number;
  nome: string;
  descricao?: string | null;
  marca: string;
  precoVenda: number;
  precoCusto: number;
  ativo: boolean;
  imagesUrl: string[];
  createdAt: string;
  updatedAt: string;
  category: Category;
  inventory?: Inventory | null;
}

export interface Inventory {
  id: number;
  produtoId: number;
  quantidade: number;
  createdAt: string;
  updatedAt: string;
  product: Product; // relação 1:1
}

export interface Category {
  id: number;
  nome: string;
  descricao?: string | null;
  createdAt: string;
  updatedAt: string;
}
