import { FilterOptions } from '../interface/filter';

export const FILTER_OPTIONS: FilterOptions = Object.freeze({
  price: [
    { label: '무료', value: 'free' },
    { label: '유료', value: 'paid' },
    { label: '구독', value: 'subscribe' },
  ],
});
