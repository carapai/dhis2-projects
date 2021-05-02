import { domain } from './Domains';
export const changeMessage = domain.createEvent<string>("change message");
