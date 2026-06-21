export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  photo: string | null;
  ratingAvg: number | null;
  ratingCount: number;
  soldCount: number;
  isFeatured: boolean;
  brand: {
    name: string;
    slug: string;
  } | null;
  category: {
    name: string;
    slug: string;
  } | null;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  productCount: number;
};
