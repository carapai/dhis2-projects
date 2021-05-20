export interface IItem {
  id: string;
  name: string;
}

export interface IPanel {
  id: string;
  name: string;
  bg: string;
  items: IItem[];
}

export interface IFolder {
  id: string;
  name: string;
}

export interface IDashboard {
  id: string;
  name: string;
  isDefault: boolean;
  bg: string;
  folder: IFolder;
  panels: IPanel[];

}
