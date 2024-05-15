"use client"; // This is a client component 👈🏽


import React, { useState } from 'react';

const TenorGifPicker = ({ onGifSelect }) => {
    const [search, setSearch] = useState('');
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);

    // const fetchGifs = async (query) => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=AIzaSyDWyW73HF2dgDeCAnrQdVi2070pHkWDXwg&limit=10`);
    //         const json = await response.json();
    //         console.log(json); // Check what the JSON looks like
    //         setGifs(json.results || []); // Use an empty array as a fallback
    //     } catch (error) {
    //         console.error('Failed to fetch GIFs:', error);
    //     }
    //     setLoading(false);
    // };
    

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        if (event.target.value.length > 2) {
            fetchGifs(event.target.value);
        }
    };

    return (
        <div>
            <input type="text" value={search} onChange={handleSearchChange} placeholder="Search GIFs" />
            {loading && <p>Loading...</p>}
            <div>
                {gifs.map(gif => (
                    <img key={gif.id} src={gif.media[0].tinygif.url} alt={gif.title}
                         onClick={() => onGifSelect(gif)}
                         style={{ cursor: 'pointer', margin: 5, width: '100px', height: '100px' }} />
                ))}
            </div>
        </div>
    );
};

export default TenorGifPicker;
