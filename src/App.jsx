// App.jsx — Version V2.0 avec ajout de joueurs, historique, filtres et stats locales

import React, { useEffect, useState } from "react";

const initialPlayers = [
  { name: "Florian", elo: 1000, games: [], wins: 0, losses: 0 },
  { name: "Alex", elo: 1000, games: [], wins: 0, losses: 0 },
];

const heroes = [
  "Arakni, 5L!", "Arakni, Huntsman", "Arakni, Marionette", "Aurora, Showstopper", "Azalea, Ace in the Hole",
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
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : initialPlayers;
  });

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [format, setFormat] = useState("classé");
  const [hero1, setHero1] = useState("");
  const [hero2, setHero2] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  function calculateElo(playerElo, opponentElo, result) {
    const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
    return Math.round(playerElo + kFactor * (result - expected));
  }

  const reportMatch = () => {
    if (!player1 || !player2 || !winner || player1 === player2) return;
    const p1 = players.find(p => p.name === player1);
    const p2 = players.find(p => p.name === player2);
    const isP1Winner = winner === player1;

    const newElo1 = format === "classé" ? calculateElo(p1.elo, p2.elo, isP1Winner ? 1 : 0) : p1.elo;
    const newElo2 = format === "classé" ? calculateElo(p2.elo, p1.elo, isP1Winner ? 0 : 1) : p2.elo;

    const updatePlayer = (player, newElo, isWinner, hero) => ({
      ...player,
      elo: newElo,
      games: [...player.games, {
        opponent: player.name === player1 ? player2 : player1,
        date,
        result: isWinner ? "Victoire" : "Défaite",
        format,
        hero
      }],
      wins: isWinner ? player.wins + 1 : player.wins,
      losses: !isWinner ? player.losses + 1 : player.losses,
    });

    setPlayers(players.map(p => {
      if (p.name === player1) return updatePlayer(p, newElo1, isP1Winner, hero1);
      if (p.name === player2) return updatePlayer(p, newElo2, !isP1Winner, hero2);
      return p;
    }));
  };

  const addPlayer = () => {
    if (newPlayer && !players.find(p => p.name === newPlayer)) {
      setPlayers([...players, { name: newPlayer, elo: 1000, games: [], wins: 0, losses: 0 }]);
      setNewPlayer("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>📊 Classement Flesh and Blood</h1>

      <div style={{ marginBottom: 20 }}>
        <input value={newPlayer} onChange={e => setNewPlayer(e.target.value)} placeholder="Nouveau joueur" />
        <button onClick={addPlayer}>Ajouter</button>
      </div>

      <div>
        <select onChange={e => setPlayer1(e.target.value)} value={player1}>
          <option value="">Choisir Joueur 1</option>
          {players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <select onChange={e => setHero1(e.target.value)} value={hero1}>
          <option value="">Choisir Héros J1</option>
          {heroes.map(h => <option key={h}>{h}</option>)}
        </select>

        <select onChange={e => setPlayer2(e.target.value)} value={player2}>
          <option value="">Choisir Joueur 2</option>
          {players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <select onChange={e => setHero2(e.target.value)} value={hero2}>
          <option value="">Choisir Héros J2</option>
          {heroes.map(h => <option key={h}>{h}</option>)}
        </select>

        <select onChange={e => setWinner(e.target.value)} value={winner}>
          <option value="">Vainqueur</option>
          {[player1, player2].filter(Boolean).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input type="date" value={date} onChange={e => setDate(e.target.value)} />

        <select onChange={e => setFormat(e.target.value)} value={format}>
          <option value="classé">Classé</option>
          <option value="amical">Amical</option>
        </select>

        <button onClick={reportMatch}>Enregistrer la partie</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Filtrer l'historique :</label>
        <select onChange={e => setFilter(e.target.value)} value={filter}>
          <option value="tous">Tous</option>
          <option value="classé">Classé</option>
          <option value="amical">Amical</option>
        </select>
      </div>

      <h2>🏆 Classement</h2>
      {players.sort((a, b) => b.elo - a.elo).map(p => (
        <div key={p.name} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <strong>{p.name}</strong> — {p.elo} ELO<br />
          Victoires : {p.wins} | Défaites : {p.losses}<br />
          <details>
            <summary>📜 Historique</summary>
            <ul>
              {p.games
                .filter(g => filter === "tous" || g.format === filter)
                .map((g, i) => (
                  <li key={i}>
                    {g.date} — {g.format} — {g.result} vs {g.opponent} ({g.hero})
                  </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
