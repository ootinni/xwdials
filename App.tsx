import { useState, useEffect } from 'react';
import { loadDial, DialData } from './data';

type Slot = {
  shipXws: string;
  dial?: DialData;
  selected?: string;
  revealed: boolean;
};

const DEFAULT_SHIPS = [
  'xwing', 'tiefighter', 'tiesf', 'yt2400',
  'awing', 't70xwing', 'tieadvanced', 'lambda',
];

export default function App() {
  const [slots, setSlots] = useState<Slot[]>(
    DEFAULT_SHIPS.map(id => ({ shipXws: id, revealed: false }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      slots.map(s =>
        loadDial(s.shipXws).then(d => ({ ...s, dial: d }))
      )
    ).then(newSlots => {
      setSlots(newSlots);
      setLoading(false);
    });
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
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl mb-4 font-bold">X‑Wing 2.0 Dial Manager</h1>
      {loading && <p>Loading dials...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {!loading && slots.map((s, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-lg flex flex-col">
            <h2 className="font-semibold mb-2 text-center">{s.shipXws}</h2>

            {s.dial && (
              <div className="relative">
                <img
                  src={s.dial.imageUrl}
                  alt={`${s.shipXws} dial`}
                  className={\`w-full rounded \${s.selected && !s.revealed ? 'opacity-20' : ''}\`}
                />
                {s.selected && !s.revealed && (
                  <div
                    onClick={() => reveal(i)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30 rounded">
                    <span className="text-white bg-blue-600 px-3 py-1 rounded">Tap to reveal</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">
              {s.dial && !s.selected && (
                <select
                  onChange={e => pick(i, e.target.value)}
                  defaultValue=""
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>Select maneuver …</option>
                  {s.dial.maneuvers.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}

              {s.selected && s.revealed && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-center font-medium">
                  {s.selected}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
