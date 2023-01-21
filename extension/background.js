const serverhost = "http://127.0.0.1:8000/";

// receives text from content.js and sends it to the API to tag NEs
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.status === 'ping-api') { // received message from content.js to ping API
        const text = request.text;
        const url = serverhost + 'ner/tag/';
        // send text to server to tag NEs
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // CORS
            },
            body: JSON.stringify({
                text: text
            })
        })
        .then((response) => response.json())
        .then((named_entities) => {
            sendResponse({'ne': named_entities});
        })
        .catch((error) => {
            console.log("Error: " + error);
            sendResponse([]);
        });
    }
    return true; // required to keep message port open in content.js (awaiting response)
});