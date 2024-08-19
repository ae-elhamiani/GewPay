// const WebSocket = require('ws');

// class WebSocketService {
//   initialize(server) {
//     this.wss = new WebSocket.Server({ server });

//     this.wss.on('connection', (ws) => {
//       ws.on('message', (message) => {
//         const data = JSON.parse(message);
//         if (data.type === 'subscribe' && data.storeId) {
//           ws.storeId = data.storeId;
//         }
//       });
//     });
//   }

//   broadcastStoreUpdate(storeId, data) {
//     this.wss.clients.forEach((client) => {
//       if (client.storeId === storeId && client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ type: 'storeUpdate', data }));
//       }
//     });
//   }
// }

// module.exports = new WebSocketService();