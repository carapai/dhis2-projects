import { domain } from './Domains';
export const changeMessage = domain.createEvent<string>("change message");
export const addMessage = domain.createEvent<string>();
export const clear = domain.createEvent();
