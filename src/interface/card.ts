import { Nullable } from './common';
import { Price } from './query';

export interface CardInfo {
  title: string;
  description: string;
  price: Price;
  logo: Nullable<string>;
}
