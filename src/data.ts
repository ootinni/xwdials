import axios from 'axios';

export interface DialData {
  code: string;
  maneuvers: string[];
}

export async function loadDial(shipXws: string): Promise<DialData> {
  const version = '3.9.1';
  const url = `https://cdn.jsdelivr.net/npm/xwing-data2@${version}/data/dials/${shipXws}.json`;
  const res = await axios.get<{ code: string; dial: string[] }>(url);
  return { code: res.data.code, maneuvers: res.data.dial };
}
