import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const API_BASE = "http://localhost:5000/api";

function App() {
    const [cats, setCats] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBreeds();
        fetchCats();
    }, []);

    const fetchCats = async (breed = "", limit = 10) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/cats?breed=${breed}&limit=${limit}`);
            setCats(response.data);
        } catch (error) {
            console.error("Error fetching cats", error);
        }
        setLoading(false);
    };

    const fetchBreeds = async () => {
        try {
            const response = await axios.get(`${API_BASE}/breeds`);
            setBreeds(response.data.map(breed => ({ value: breed.id, label: breed.name })));
        } catch (error) {
            console.error("Error fetching breeds", error);
        }
    };

    return (
        <div className="app">
            <h1>🐱 Cat Gallery</h1>
            <Select
                options={breeds}
                placeholder="Filter by Breed"
                onChange={(selected) => {
                    setSelectedBreed(selected ? selected.value : "");
                    fetchCats(selected ? selected.value : "");
                }}
                isClearable
            />
            <div className="gallery">
                {loading ? <p>Loading...</p> : cats.map(cat => (
                    <img key={cat.id} src={cat.url} alt="Cat" className="cat-image" />
                ))}
            </div>
            <button onClick={() => fetchCats(selectedBreed, 10)}>Load More</button>
        </div>
    );
}

export default App;

