import { useState,useEffect } from "react";

export interface Artist {
    name: string;
    fullName: string;
    folder: string;
    count : number;
    style: string;
    relevance: number;
}

export function useArtists(){
    const [artists,setArtists] = useState<Artist[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState<string| null>(null);

    useEffect (()=> {
        async function fetchArtists(){
            try {
                const response = await fetch('/artists.json');
                if (!response.ok){
                    throw new Error(`HTTP Fehler: ${response.status}`);
                }
            const data = await response.json();
            setArtists(data);
            } catch(err: any){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchArtists();
    },[]);

    return {artists,loading,error};
}
