import { domain, reportDomain } from './Domains';
export const changeMessage = domain.createEvent<string>("change message");
export const changeProgram = reportDomain.createEvent<string>('change program')
