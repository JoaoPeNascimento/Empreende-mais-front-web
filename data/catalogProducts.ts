import { Inventory, Product } from "@/types/types";

const now = "2026-06-08T00:00:00.000Z";

const categories = {
  conjuntos: {
    id: 1,
    nome: "Conjuntos",
    descricao: "Looks completos Donna Glamour",
    createdAt: now,
    updatedAt: now,
  },
  blusas: {
    id: 2,
    nome: "Blusas e shorts",
    descricao: "Combinacoes com blusas, croppeds e shorts",
    createdAt: now,
    updatedAt: now,
  },
  vestidos: {
    id: 3,
    nome: "Vestidos",
    descricao: "Vestidos Donna Glamour",
    createdAt: now,
    updatedAt: now,
  },
};

export const catalogProducts: Product[] = [
  {
    id: 1001,
    nome: "Conjunto",
    descricao: "Cores disponiveis: marrom, verde oliva e preto.",
    marca: "Donna Glamour",
    precoVenda: 110,
    precoLabel: "R$ 110,00",
    precoCusto: 0,
    ativo: true,
    imagesUrl: ["/catalogo/catalogo1.jpeg"],
    createdAt: now,
    updatedAt: now,
    category: categories.conjuntos,
    cores: ["marrom", "verde oliva", "preto"],
  },
  {
    id: 1002,
    nome: "Blusa xadrez + Short saia",
    descricao: "Blusa xadrez R$ 45,00. Short saia R$ 65,00.",
    marca: "Donna Glamour",
    precoVenda: 110,
    precoLabel: "R$ 45,00 + R$ 65,00",
    precoCusto: 0,
    ativo: true,
    imagesUrl: ["/catalogo/catalogo2.jpeg"],
    createdAt: now,
    updatedAt: now,
    category: categories.blusas,
  },
  {
    id: 1003,
    nome: "Cropped couro + Saia Plisada jeans",
    descricao: "Cropped couro R$ 85,00. Saia Plisada 100% jeans, do 36 ao 44, R$ 110,00.",
    marca: "Donna Glamour",
    precoVenda: 195,
    precoLabel: "R$ 85,00 + R$ 110,00",
    precoCusto: 0,
    ativo: true,
    imagesUrl: ["/catalogo/catalogo3.jpeg"],
    createdAt: now,
    updatedAt: now,
    category: categories.blusas,
    tamanhos: ["36", "38", "40", "42", "44"],
  },
  {
    id: 1004,
    nome: "Vestido jeans com lycra",
    descricao: "Vestido jeans com lycra disponivel nos tamanhos P, M e G.",
    marca: "Donna Glamour",
    precoVenda: 110,
    precoLabel: "R$ 110,00",
    precoCusto: 0,
    ativo: true,
    imagesUrl: ["/catalogo/catalogo4.jpeg"],
    createdAt: now,
    updatedAt: now,
    category: categories.vestidos,
    tamanhos: ["P", "M", "G"],
  },
  {
    id: 1005,
    nome: "Blusa acetinada + Short saia alfaiataria",
    descricao: "Blusa acetinada R$ 65,00. Short saia alfaiataria, tamanhos P, M e G, R$ 85,00.",
    marca: "Donna Glamour",
    precoVenda: 150,
    precoLabel: "R$ 65,00 + R$ 85,00",
    precoCusto: 0,
    ativo: true,
    imagesUrl: ["/catalogo/catalogo5.jpeg"],
    createdAt: now,
    updatedAt: now,
    category: categories.blusas,
    tamanhos: ["P", "M", "G"],
  },
];

export const catalogInventory: Inventory[] = catalogProducts.map((product) => ({
  id: product.id,
  produtoId: product.id,
  quantidade: 1,
  createdAt: now,
  updatedAt: now,
  product,
}));

export const findCatalogProductById = (id: number) =>
  catalogProducts.find((product) => product.id === id) || null;
