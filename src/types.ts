export type DeviceId = 'light' | 'kettle' | 'fan';
export type DevicesState = Record<DeviceId, boolean>;
export type Position = { x: number; y: number };
export type Phase = 'home' | 'playing' | 'exiting' | 'won';
export type InspectId = 'mug' | 'pan' | 'plant' | 'book' | 'fridge' | 'sink';
export type TargetAction =
  | { kind: 'toggle'; id: DeviceId }
  | { kind: 'inspect'; id: InspectId }
  | { kind: 'exit' };

export const INITIAL_DEVICES: DevicesState = { light: true, kettle: true, fan: true };
export const DEVICE_NAMES: Record<DeviceId, string> = {
  light: 'Выключить свет',
  kettle: 'Выключить чайник',
  fan: 'Выключить вентилятор',
};
export const STATIONS: Record<DeviceId | InspectId | 'exit', Position> = {
  light: { x: 1153, y: 717 },
  kettle: { x: 828, y: 714 },
  fan: { x: 1065, y: 718 },
  exit: { x: 1265, y: 704 },
  mug: { x: 905, y: 708 },
  pan: { x: 635, y: 704 },
  plant: { x: 405, y: 709 },
  book: { x: 1018, y: 714 },
  fridge: { x: 280, y: 713 },
  sink: { x: 464, y: 707 },
};
export const INSPECTIONS: Record<InspectId, string> = {
  mug: 'Любимая кружка. Чай без неё — не чай!',
  pan: 'Сковородка чистая. Можно отдыхать.',
  plant: 'Маленький базилик отлично себя чувствует.',
  book: 'Поваренная книга: 101 рецепт уюта.',
  fridge: 'Холодильник исправно хранит продукты.',
  sink: 'В раковине порядок. Как приятно!',
};
