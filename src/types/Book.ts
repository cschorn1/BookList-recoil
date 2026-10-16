export type BookStatus = 'Lido' | 'Não lido';

export interface NewBook {
  isMock?: boolean;
  title: string;
  author: string;
  description?: string;
  image: string;
  genre: string;
  status: BookStatus;
}

export interface Book extends NewBook {
  _id: string;
}

export function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const book = value as Record<string, unknown>;

  return (
    typeof book._id === "string" &&
    book._id.length > 0 &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    (book.description === undefined || typeof book.description === "string") &&
    typeof book.image === "string" &&
    typeof book.genre === "string" &&
    (book.status === "Lido" || book.status === "Não lido") &&
    (book.isMock === undefined || typeof book.isMock === "boolean")
  );
}