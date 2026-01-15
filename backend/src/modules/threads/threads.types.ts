

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description
  };
}

export type ThreadDetail = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    slug: string;
    name: string;
  },
  author: {
    displayName: string | null;
    handle: string | null;
  }
}