import { domain } from './Domains';
import {
  changeMessage,
  addMessage,
  clear
} from "./Events";
import { Store } from './types';
export const messageStore = domain.createStore<Store>({
  message: '',
  results: []
}).on(changeMessage, (state, message: string) => {
  return { ...state, message }
}).on(addMessage, (state, message: string) => {
  return { ...state, results: [...state.results, message] }
}).on(clear, (state) => {
  return { ...state, results: [], message: '' }
});
