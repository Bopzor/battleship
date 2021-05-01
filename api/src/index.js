const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Game = require('./game.js');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/1', (req, res) => {
  res.send(renderBoard(game.shipsPlayerOne));
});

app.get('/2', (req, res) => {
  res.send(renderBoard(game.shipsPlayerTwo));
});


const game = new Game();

const renderBoard = (ships) => {
  let html = `
    <table>
      <tr>
        <td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
      </tr>
  `;

  for (let i = 1; i <= 10; i++) {
    html += `<tr><td>${i}</td>`;

    for (let j = 1; j <= 10; j++) {
      html += '<td class="';
        if (ships.ship([i, j])) {
          html += 'ship ';

          if (ships.isAlreadyHit([i, j])) {
              html += 'hit';
          }

        }

        html += '"></td>';
      }

      html += '</tr>';
    }

      html += '</table>';

  return `
    <!DOCTYPE html>
    <html>

    <head>
      <title>Battlesheep Board</title>
      <style type="text/css">
        table {
          border-collapse: collapse;
        }

        td {
          border: 1px solid black;
          width: 20px;
          height: 20px;
          text-align: center;
        }

        .ship {
          background-color: gray;
        }

        .hit {
          background-color: red;
          opacity: 0.6;
        }
      </style>
    </head>

    <body>
      <div id="board">${html}</div>

    </body>

    </html>
  `;
}

io.on('connect', (socket) => {
  game.players.push({ socket: socket.id, id: game.players.length + 1 });

  io.emit('message', { action: 'join' });

  socket.on('setTroups', (ships) => {
    game.setPlayerShips({ socket: socket.id, ships });

    socket.emit('message', { action: 'ready' });

    if (!game.start()) {
      io.emit('message', { action: 'idle' });

      return;
    }

    io.emit('message', { action: 'start', game });
  });

  socket.on('played', (cell) => {
    if (game.state === 'end') {
      console.log('Game ended');
      return;
    }

    if (game.state !== 'start') {
      console.log('Game not started');
      return;
    }

    switch (game.play(socket.id, cell)) {
      case 'hit':
        io.emit('message', { action: 'hit', cell });

        break;

      case 'sank':
        io.emit('message', { action: 'sank', cell, ship: game.getShip(socket.id, cell) });


        if (game.win(socket.id)) {
          io.emit('message', { action: 'win', socket: socket.id });

          game.state = 'end';

          return;
        }

        break;

      case 'missed':
        io.emit('message', { action: 'missed', cell });

        break;

      case 'win':
        game.state = 'end';

        io.emit('message', { action: 'win', socket: socket.id });

        break;

      case 'end':
        io.emit('message', { action: 'end' });

        break;

      case 'not your turn':
        socket.emit('message', { action: 'not your turn' });

        break;
    }
  });

  socket.on('getGame', () => {
    io.emit('message', { action: 'game', game });
  });

  socket.on('disconnect', () => {
    const idx = game.players.indexOf(p => p.socket === socket.id);

    game.players.splice(idx, 1);

    console.log(game.players);

    io.emit('message', { action: 'leave' });
  })
});

server.listen(3000, () => console.log('API listening on PORT: 3000'));
