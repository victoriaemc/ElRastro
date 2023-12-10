import { useState, useEffect } from "react";

const useGet = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIspending] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() =>{
        const abortCont = new AbortController();

        fetch(url, {signal: abortCont.signal })
            .then(res => {
                if(!res.ok){
                  throw Error("could not fetch data for that resource");
                }
                return res.json();
    
            })
            .then (data => {
                setData(data);
                setIspending(false)
                setError(null)
            })
            .catch(err => {
                if (err.name === 'AbortError'){
                    console.log("fetch aborted");
                }else {
                    setIspending(false)
                    setError(err.message);
                }
            })

            return () => abortCont.abort();

      }, [url]);
    return {data, isPending, error}
}

export default useGet;