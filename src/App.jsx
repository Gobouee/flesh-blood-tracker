import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

console.log("✅ App.jsx chargé !");

const heroes = [
  "Arakni - 5L!", "Azalea, Ace in the Hole", "Bravo, Showstopper", "Dash I/O"
];

export default function App() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (error) {
      console.error("❌ Erreur chargement joueurs:", error);
    } else {
      console.log("✅ Joueurs chargés depuis Supabase:", data);
      setPlayers(data);
    }
  };

  const addPlayer = async () => {
    console.log("Tentative d'ajout de joueur:", newPlayer);
    if (!newPlayer || players.find(p => p.name === newPlayer)) return;
    const { error } = await supabase.from("players").insert({
      name: newPlayer,
      elo: 1000,
      wins: 0,
      losses: 0
    });
    if (error) {
      console.error("❌ Erreur ajout joueur:", error);
    } else {
      console.log("✅ Joueur ajouté !");
      setNewPlayer("");
      fetchPlayers();
    }
  };

  return (
    <div>
      <h1>📊 Test Supabase + Debug</h1>

      <input
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        placeholder="Nouveau joueur"
        style={{ marginRight: 8 }}
      />
      <button onClick={addPlayer}>Ajouter joueur</button>

      <h2>Joueurs :</h2>
      <ul>
        {players.map((p) => (
          <li key={p.name}>{p.name} — {p.elo} ELO</li>
        ))}
      </ul>
    </div>
  );
}
