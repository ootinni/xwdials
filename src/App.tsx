import { useState, useEffect } from 'react';
import { loadDial, DialData } from './data';

type DialSlot = {
  shipXws: string;
  dial?: DialData;
  selected?: string;
  revealed: boolean;
};

const DEFAULT_SHIPS = [
  'xwing', 'tiefighter', 'tieadvanced', 'yt2400',
  'awing', 't70xwing', 'tiesf', 'lambda',
];

export default function App() {
  const [slots, setSlots] = useState<DialSlot[]>(
    DEFAULT_SHIPS.map((xws) => ({ shipXws: xws, revealed: false })),
  );
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const newSlots = await Promise.all(slots.map(async (slot) => {
      const dial = await loadDial(slot.shipXws);
      return { ...slot, dial };
    }));
    setSlots(newSlots);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const pick = (i: number, move: string) => {
    setSlots(slots.map((s, idx) =>
      idx === i ? { ...s, selected: move, revealed: false } : s
    ));
  };

  const reveal = (i: number) => {
    setSlots(slots.map((s, idx) =>
      idx === i ? { ...s, revealed: true } : s
    ));
  };

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {loading && <div>Loading dials...</div>}
      {!loading && slots.map((slot, i) => (
        <div key={i} className="border p-4 rounded">
          <h2 className="font-semibold text-lg">{slot.shipXws}</h2>

          {!slot.dial && <p>Loading dial...</p>}

          {slot.dial && !slot.selected && (
            <select
              className="border p-2 rounded mt-2 w-full"
              defaultValue=""
              onChange={e => pick(i, e.target.value)}>
              <option value="" disabled>Select maneuver</option>
              {slot.dial.maneuvers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          {slot.selected && !slot.revealed && (
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => reveal(i)}>
              Tap to Reveal
            </button>
          )}

          {slot.revealed && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-center">
              {slot.selected}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
