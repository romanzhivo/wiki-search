const requests = {
    getData: function (SEARCH_URL, method) {
        return fetch(SEARCH_URL, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: method || 'GET',
        }).then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        });
    }
}

export default requests;