import { format, isBefore } from 'date-fns';
import { sample } from 'lodash-es';

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export type FormData = { projectId: string; dlcName: string; releaseDate: Date | '' };

export const getProjectOptions = () => {
  return [
    { label: 'WatchDogs 2', value: 'watchdogs' },
    { label: 'Shadow of Mordor', value: 'mordor' },
    { label: "Assasins' creed", value: 'ac' },
    { label: 'GTA V', value: 'gta' },
  ];
};

export const getProjectNextDLC = async () => {
  await delay();
  return sample(['FUGU', 'Unsorted AWE', 'Looren', 'Final thief']);
};

export const formatDateForInput = (dt: Date) => format(dt, 'yyyy-MM-dd');

export const sendRequest = async (data: FormData) => {
  await delay();
  window.alert(JSON.stringify(data, null, 2));
  // Immitating remote validation logic
  if (data.dlcName.toLocaleLowerCase() === 'oblivion') throw new Error();
};

export const minLength =
  (length = 5) =>
  (value: { length?: number }) => {
    if (!value?.length || value.length < length) return `Should be at least ${length} symbols`;
  };

export const minDate = (min: Date) => (value: Date) => {
  if (isBefore(value, min)) return `Should be after ${formatDateForInput(min)}`;
};
