export interface BaseComponent {
    tag: string;
    className?: string;
    text?: string;
}

export interface StartStop {
    id: number;
    status: "started" | "stopped";
}

export interface CarData {
  name: string,
  color: string,
  id: number
}

export interface CallbackFunction {
    (): void;
}

export interface CarBlockButtonInterface {
    text: string;
    className: string;
    id: number;
}

export interface CarEngine {
    velocity: number,
    distance: number
}
export interface FinisherData {
  finisher: number,
  time: string,
  color: string
};

export interface NewWinnerData {
    id: number;
    time: number;
}

export interface WinnerData {
    id: number;
    wins: number;
    time: number;
}
export interface UpdatingWinnerData {
    wins: number;
    time: number;
}

export type SortTypes = 'id'|'wins'|'time';

export type OrderTypes = 'ASC'|'DESC';