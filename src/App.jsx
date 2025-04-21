// App.jsx — Version debug forcée avec log en début d'app et test console visible

import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

console.log("✅ App.jsx chargé !");

const heroes = [
  "Arakni - 5L!", "Arakni, Huntsman", "Arakni, Marionette", "Aurora, Showstopper", "Azalea, Ace in the Hole",
  "Betsy, Skin in the Game", "Bravo, Showstopper", "Cindra, Dracai of Retribution", "Dash, Inventor Extraordinaire",
  "Dash I/O", "Dorinthea Ironsong", "Enigma, Ledger of Ancestry", "Fai, Rising Rebellion", "Fang, Dracai Reborn",
  "Florian, Rotwood Harbinger", "Gravy Bones", "Ira, Scarlet Revenger", "Jarl Vetreiđi", "Kano, Dracai of Aether",
  "Kassai of the Golden Sand", "Katsu, the Wanderer", "Kayo, Armed and Dangerous", "Levia, Shadowborn Abomination",
  "Marlynn, Trickster's Delight", "Maxx 'The Hype' Nitro", "Nuu, Alluring Desire", "Olympia, Prodigy of War",
  "Oscilio, Constella Intelligence", "Prism, Awakener of Sol", "Puffin, High Seas Enforcer", "Rhinar, Reckless Rampage",
  "Riptide, Lurker of the Deep", "Ser Boltyn, Breaker of Dawn", "Teklovossen, Esteemed Magnate",
  "Uzuri, Switchblade", "Valda, Seismic Shaker", "Verdance, Thorn of the Rose", "Victor Goldmane, High and Mighty",
  "Vynnset, Iron Maiden", "Zen, Tamer of Purpose"
].sort();

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
    const { error } = await supabase.from("players").insert({ name: newPlayer, elo: 1000, wins: 0, losses: 0 });
    if (error) {
      console.error("❌ Erreur ajout joueur:", error);
    } else {
      console.log("✅ Joueur ajouté dans Supabase !");
      setNewPlayer("");
      fetchPlayers();
    }
  };

  return (
    <div>
      <h1>📊 Test Supabase + Debug</h1>

      <input
        value={newPlayer}
        onChange={e => setNewPlayer(e.target.value)}
        placeholder="Nouveau joueur"
        style={{ marginRight: 8 }}
      />
      <button onClick={addPlayer}>Ajouter joueur</button>

      <h2>Joueurs (depuis Supabase)</h2>
      <ul>
        {players.map(p => (
          <li key={p.name}>{p.name} — {p.elo} ELO</li>
        ))}
      </ul>
    </div>
  );
}