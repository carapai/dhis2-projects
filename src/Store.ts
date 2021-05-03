import { domain, reportDomain } from './Domains';
import {
  changeMessage,
  changeProgram
} from "./Events";
import { Store, ReportFilters } from './types';

export const dashboards = domain.createStore<Store>({ message: '' })
  .on(changeMessage, (state, message: string) => {
    return { ...state, message }
  });

export const reportFilterStore = reportDomain.createStore<ReportFilters>({ program: '', orgUnit: '' })
  .on(changeProgram, (state, program: string) => {
    return { ...state, program }
  });
