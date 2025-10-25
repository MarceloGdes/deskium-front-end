export interface NavItem {
  id: number;
  name: string;
  icon: string;
  route: string;
  tabs: NavModel[];
}

export interface NavModel {
  id: number;
  title: string;
  content: any;
  closable: boolean;
}
