export interface Product {
  id: number;
  nome: string;
  descricao?: string | null;
  marca: string;
  precoVenda: number;
  precoCusto: number;
  ativo: boolean;
  imagesUrl: string[];
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: number;
  produtoId: number;
  quantidade: number;
  createdAt: string;
  updatedAt: string;
  product: Product; // relação 1:1
}
