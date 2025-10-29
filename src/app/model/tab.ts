export interface NavItem {
  id: number;
  name: string;
  icon: string;
  route: string;
  tabs: Tab[];
}

export interface Tab {
  id: number;
  title: string;
  content: any;
  closable: boolean;
}
