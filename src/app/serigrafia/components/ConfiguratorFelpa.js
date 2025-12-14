'use client';

import { useState } from "react";

export default function ConfiguratorFelpa() {
  const [color, setColor] = useState("Bianco");
  const [size, setSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [position, setPosition] = useState("Fronte");
  const [numColors, setNumColors] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const availableColors = ["Bianco", "Nero", "Blu", "Rosso"];
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const positions = ["Fronte", "Retro"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Solo file PDF consentiti");
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File troppo grande (max 10MB)");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Devi caricare un file PDF");
      return;
    }

    const formData = new FormData();
    formData.append("color", color);
    formData.append("size", size);
    formData.append("quantity", quantity);
    formData.append("position", position);
    formData.append("numColors", numColors);
    formData.append("file", file);

    try {
      const res = await fetch("/api/order/felpa", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Ordine inviato correttamente!");
      } else {
        setError(data.error || "Errore durante l'invio");
      }
    } catch (err) {
      setError("Errore di rete o server");
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4">Configura la tua Felpa Serigrafia</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Colore */}
        <label>
          Colore Felpa
          <select className="w-full border p-2 rounded" value={color} onChange={(e) => setColor(e.target.value)}>
            {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {/* Taglia */}
        <label>
          Taglia
          <select className="w-full border p-2 rounded" value={size} onChange={(e) => setSize(e.target.value)}>
            {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        {/* Quantità */}
        <label>
          Quantità
          <input type="number" min={1} className="w-full border p-2 rounded" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>

        {/* Posizione stampa */}
        <label>
          Posizione della serigrafia
          <select className="w-full border p-2 rounded" value={position} onChange={(e) => setPosition(e.target.value)}>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        {/* Numero colori */}
        <label>
          Numero colori stampa
          <input type="number" min={1} max={10} className="w-full border p-2 rounded" value={numColors} onChange={(e) => setNumColors(e.target.value)} />
        </label>

        {/* Upload file */}
        <label>
          Carica il file PDF per la stampa
          <input type="file" accept="application/pdf" className="w-full mt-2" onChange={handleFileChange} />
        </label>

        {/* Errori */}
        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition">
          Aggiungi al carrello
        </button>
      </form>
    </div>
  );
}
