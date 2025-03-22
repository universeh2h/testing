export interface NavItems {
  nama: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItems[];
}

export interface NavbarState {
  openItems: Record<string, boolean>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}
