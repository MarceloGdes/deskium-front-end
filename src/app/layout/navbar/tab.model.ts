export interface NavItem {
  id: number;
  name: string;
  icon: string;
  route: string;
  tabs: TabModel[];
}

export interface TabModel {
  id: number;
  title: string;
  content: any;
  closable: boolean;
}
