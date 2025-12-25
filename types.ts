
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  LIST = 'list',
  LUCKY_DRAW = 'lucky_draw',
  GROUPING = 'grouping'
}
