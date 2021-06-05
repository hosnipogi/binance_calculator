import { RefObject } from 'react';

export type T = {
  reference: RefObject<HTMLInputElement | HTMLSelectElement>;
  func: any;
  placeholder?: string;
  value: string | number | { coin: string; price: string }[];
  type?: 'number' | 'range' | 'text' | 'select' | 'input';
};
