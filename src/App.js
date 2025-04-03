import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Diccionario de traducción de tipos
const tipoTraducido = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta', electric: 'Eléctrico',
  ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador',
  psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma', dark: 'Siniestro',
  dragon: 'Dragón', steel: 'Acero', fairy: 'Hada'
};

function App() {
  const [pokemon, setPokemon] = useState('');
  const [data, setData] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const baseURL = "https://pokeapi-backend-jdom.onrender.com";

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const fetchPokemonByName = async (name) => {
    try {
      const res = await axios.get(`${baseURL}/api/pokemon-info/${name}`);
      setData(res.data);
      await fetchEvolution(name);
    } catch (err) {
      alert('Pokémon no encontrado');
      setData(null);
      setEvolution([]);
    }
  };

  const fetchPokemon = async () => {
    if (pokemon.trim() !== '') {
      await fetchPokemonByName(pokemon);
    }
  };

  const fetchEvolution = async (name) => {
    try {
      const res = await axios.get(`${baseURL}/api/evolution/${name}`);
      setEvolution(res.data);
    } catch (err) {
      console.error('Error al obtener evolución');
      setEvolution([]);
    }
  };

  const handleEvolutionClick = (name) => {
    setPokemon(name);
    fetchPokemonByName(name);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Buscar Pokémon</h1>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value)}
          placeholder="Ej: charizard"
          className="form-control w-25 me-2"
        />
        <button onClick={fetchPokemon} className="btn btn-primary">
          Buscar
        </button>
      </div>

      {data && (
        <div className="card text-center mb-5 p-4 shadow">
          <h2 className="text-uppercase">#{data.id} - {data.name.toUpperCase()}</h2>
          <img src={data.sprite} alt={data.name} className="mx-auto" />
          <p><strong>Tipo:</strong> {data.types.map(t => tipoTraducido[t.type.name] || t.type.name).join(', ')}</p>
          <p><strong>Altura:</strong> {(data.height / 10).toFixed(1)} m</p>
          <p><strong>Peso:</strong> {(data.weight / 10).toFixed(1)} kg</p>
          <p><strong>Descripción:</strong> {data.description}</p>
        </div>
      )}

      {(data?.stats && evolution.length > 0) && (
        <div className="row mt-5">
          {/* Stats */}
          <div className="col-md-6">
            <h5 className="text-center mb-3">Estadísticas base</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <Bar
                data={{
                  labels: data.stats.map(s => s.stat.name.toUpperCase()),
                  datasets: [
                    {
                      label: 'Base Stat',
                      data: data.stats.map(s => s.base_stat),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Evolutions */}
          <div className="col-md-6">
            <h5 className="text-center mb-3">Línea evolutiva</h5>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {evolution.map((evo) => (
                <div
                  key={evo.id}
                  onClick={() => handleEvolutionClick(evo.name)}
                  className="text-center"
                  style={{ cursor: 'pointer' }}
                >
                  <img src={evo.sprite} alt={evo.name} className="mb-2" />
                  <p className="mb-0">#{evo.id} - {capitalize(evo.name)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
