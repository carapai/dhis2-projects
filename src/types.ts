export interface Store {
  message: string;
}

export interface Relation {
  relation?: string;
  type?: string;
}

interface Options {
  whichEvents: 'any' | 'first' | 'last' | 'all'
  relationships: { [key: string]: Relation };
}
export interface ReportFilters {
  filter: string;
  program: string;
  orgUnits: string[];
  periods: string[];
  programs: { [key: string]: any };
  stages: { [key: string]: Options };
  enrollmentRelationships: { [key: string]: Relation };
  programRelationships: { [key: string]: Relation };
  selectedFields: any[];
  relationshipTypes: { [key: string]: any };
}
