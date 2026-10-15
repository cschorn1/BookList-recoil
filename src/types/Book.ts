export type BookStatus = 'Lido' | 'Não lido';

export interface Book {
  _id?: string;
  isMock?: boolean;
  title: string;
  author: string;
  description?: string;
  image: string;
  genre: string;
  status: BookStatus;
}