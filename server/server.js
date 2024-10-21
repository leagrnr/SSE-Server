const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const sendEvent = () => {
        const latitude = (Math.random() * 180 - 90).toFixed(8);
        const longitude = (Math.random() * 360 - 180).toFixed(8);
        const latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        
        const timestamp = new Date().toLocaleTimeString();
        const data = JSON.stringify({ message: "Position", time: timestamp, latlng: latlng });
        res.write(`data: ${data}\n\n`); // Envoie le message au format SSE
    };

    sendEvent();

    // Interval de 5 secondes entre les messages
    const intervalId = setInterval(sendEvent, 5000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}).listen(3000, () => {
    console.log('Serveur SSE en écoute sur http://localhost:3000');
});
