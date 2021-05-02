import { domain } from './Domains';
import {
  changeMessage
} from "./Events";
import { Store } from './types';

export const dashboards = domain.createStore<Store>({
  message: ''
})
  .on(changeMessage, (state, message: string) => {
    return { ...state, message }
  });
