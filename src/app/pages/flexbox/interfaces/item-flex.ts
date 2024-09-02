export interface Item {
  selected: boolean;
  id : number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
  width?: number;
  height?: number;
}
