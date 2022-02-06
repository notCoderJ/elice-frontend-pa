import { Price } from '../interface/query';

export const PARAM_LIST = ['price'];

interface ParamTable {
  [index: string]: { [key: string]: Price };
}

export const PARAM_TABLE: ParamTable = Object.freeze({
  price: {
    free: { enroll_type: 0, is_free: true },
    paid: { enroll_type: 0, is_free: false },
    subscribe: { enroll_type: 4, is_free: false },
  },
});
