import axios from 'axios';

export interface DialData {
  code: string;
  maneuvers: string[];
  imageUrl: string;
}

export async function loadDial(shipXws: string): Promise<DialData> {
  const version = '3.9.1';
  const base = `https://cdn.jsdelivr.net/npm/xwing-data2@${version}`;
  const { data } = await axios.get<{ dial: string[]; code: string }>(
    `${base}/data/dials/${shipXws}.json`
  );
  return {
    code: data.code,
    maneuvers: data.dial,
    imageUrl: `${base}/images/dials/${data.code}.png`,
  };
}
