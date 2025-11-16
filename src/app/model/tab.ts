export interface NavItem {
  id: number;
  name: string;
  icon: string;
  route: string;
}

export interface Tab {
  id: number;
  title: string;
  route: string;
  closable: boolean;
}
