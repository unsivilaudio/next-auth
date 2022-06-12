import { useState, useEffect } from 'react';

const withFetch = props => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (loading && (data || error)) {
            setLoading(false);
        }
    }, [loading, data, error]);

    async function doRequest(url, params) {
        if (loading) return;
        const defaultParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (params) params = Object.assign(defaultParams, params);
        console.log(params);

        setError(false);
        setData(false);
        setLoading(true);
        return fetch(url, params)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error);
                }
                return data;
            })
            .then(setData)
            .catch(setError);
    }

    return { doRequest, data, error, loading };
};

export default withFetch;
