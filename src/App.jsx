// App.jsx — V4 : Connexion Supabase active (joueurs + matchs synchronisés)

import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

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

const kFactor = 32;

export default function App() {
  const [players, setPlayers] = useState([]);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [format, setFormat] = useState("classé");
  const [hero1, setHero1] = useState("");
  const [hero2, setHero2] = useState("");
  const [newPlayer, setNewPlayer] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (!error) setPlayers(data);
  };

  const calculateElo = (playerElo, opponentElo, result) => {
    const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
    return Math.round(playerElo + kFactor * (result - expected));
  };

  const addPlayer = async () => {
    if (!newPlayer || players.find(p => p.name === newPlayer)) return;
    const { error } = await supabase.from("players").insert({ name: newPlayer, elo: 1000, wins: 0, losses: 0 });
    if (!error) {
      setNewPlayer("");
      fetchPlayers();
    }
  };

  const reportMatch = async () => {
    if (!player1 || !player2 || !winner || player1 === player2) return;
    const p1 = players.find(p => p.name === player1);
    const p2 = players.find(p => p.name === player2);
    const isP1Winner = winner === player1;

    const newElo1 = format === "classé" ? calculateElo(p1.elo, p2.elo, isP1Winner ? 1 : 0) : p1.elo;
    const newElo2 = format === "classé" ? calculateElo(p2.elo, p1.elo, isP1Winner ? 0 : 1) : p2.elo;

    // Ajouter le match dans la base
    await supabase.from("matches").insert({
      player1,
      player2,
      hero1,
      hero2,
      winner,
      format,
      date
    });

    // Mettre à jour les deux joueurs
    await supabase.from("players").update({
      elo: newElo1,
      wins: isP1Winner ? p1.wins + 1 : p1.wins,
      losses: !isP1Winner ? p1.losses + 1 : p1.losses
    }).eq("name", player1);

    await supabase.from("players").update({
      elo: newElo2,
      wins: !isP1Winner ? p2.wins + 1 : p2.wins,
      losses: isP1Winner ? p2.losses + 1 : p2.losses
    }).eq("name", player2);

    fetchPlayers();
    setShowMatchForm(false);
  };

  const mainStyle = {
    background: "#2d1a13",
    color: "#f1d6b8",
    fontFamily: "Georgia, serif",
    minHeight: "100vh",
    padding: 20
  };

  const cardStyle = {
    background: "#3c2214",
    border: "2px solid #a67c52",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 0 10px rgba(0,0,0,0.3)"
  };

  const buttonStyle = {
    backgroundColor: "#8b0000",
    color: "white",
    border: "none",
    padding: "6px 12px",
    margin: "5px 0",
    borderRadius: 8,
    cursor: "pointer"
  };

  const selectStyle = {
    backgroundColor: "#442b1c",
    color: "#f1d6b8",
    border: "1px solid #a67c52",
    borderRadius: 8,
    padding: 5,
    marginBottom: 5,
    width: "100%"
  };

  return (
    <div style={mainStyle}>
      <h1 style={{ fontSize: 28, textAlign: "center", marginBottom: 20 }}>⚔️ Classement Flesh and Blood (cloud)</h1>

      <div style={cardStyle}>
        <input value={newPlayer} onChange={e => setNewPlayer(e.target.value)} placeholder="Nouveau joueur" style={{ ...selectStyle, width: "80%", display: "inline-block" }} />
        <button onClick={addPlayer} style={{ ...buttonStyle, marginLeft: 10 }}>Ajouter</button>
      </div>

      <button onClick={() => setShowMatchForm(true)} style={{ ...buttonStyle, marginBottom: 20 }}>➕ Créer un match</button>

      {showMatchForm && (
        <div style={cardStyle}>
          <h3>Créer un match</h3>
          <select onChange={e => setPlayer1(e.target.value)} value={player1} style={selectStyle}>
            <option value="">Choisir Joueur 1</option>
            {players.map(p => <option key={p.name}>{p.name}</option>)}
          </select>
          <select onChange={e => setHero1(e.target.value)} value={hero1} style={selectStyle}>
            <option value="">Choisir Héros J1</option>
            {heroes.map(h => <option key={h}>{h}</option>)}
          </select>
          <select onChange={e => setPlayer2(e.target.value)} value={player2} style={selectStyle}>
            <option value="">Choisir Joueur 2</option>
            {players.map(p => <option key={p.name}>{p.name}</option>)}
          </select>
          <select onChange={e => setHero2(e.target.value)} value={hero2} style={selectStyle}>
            <option value="">Choisir Héros J2</option>
            {heroes.map(h => <option key={h}>{h}</option>)}
          </select>
          <select onChange={e => setWinner(e.target.value)} value={winner} style={selectStyle}>
            <option value="">Vainqueur</option>
            {[player1, player2].filter(Boolean).map(p => <option key={p}>{p}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={selectStyle} />
          <select onChange={e => setFormat(e.target.value)} value={format} style={selectStyle}>
            <option value="classé">Classé</option>
            <option value="amical">Amical</option>
          </select>
          <button onClick={reportMatch} style={buttonStyle}>Enregistrer le match</button>
          <button onClick={() => setShowMatchForm(false)} style={{ ...buttonStyle, backgroundColor: '#444', marginLeft: 10 }}>Fermer</button>
        </div>
      )}

      <h2 style={{ fontSize: 24, marginTop: 20 }}>🏆 Classement (données cloud)</h2>
      {players.sort((a, b) => b.elo - a.elo).map(p => (
        <div key={p.name} style={cardStyle}>
          <strong>{p.name}</strong> — {p.elo} ELO<br />
          Victoires : {p.wins} | Défaites : {p.losses}
        </div>
      ))}
    </div>
  );
}
