export interface MenuEntry {
  text: string;
  route?: string;
  icon: string;
  tooltip?: string;
  children?: MenuEntry[];
}
