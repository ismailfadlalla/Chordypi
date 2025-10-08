import { useState, useEffect } from 'react';
import { analyzeSong } from '../services/api';

const useChordAnalysis = (url) => {
    const [chords, setChords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChords = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await analyzeSong(url);
                if (response.status === 'success') {
                    setChords(response.chords);
                } else {
                    throw new Error(response.error);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchChords();
        }
    }, [url]);

    return { chords, loading, error };
};

export default useChordAnalysis;