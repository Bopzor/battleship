# Battleship

Backend for battleship game I made to learn socket.io.

## ON

To set his troups, a player must emit a message :

`socket.emit('setTroups', ships)`

Where `ships` is an array:
```
  [
    {
      start: cell,
      direction: 'x' || 'y',
      size: 5,
    },
    {
      start: cell,
      direction: 'x' || 'y',
      size: 4,
    },
    {
      start: cell,
      direction: 'x' || 'y',
      size: 3,
    },
    {
      start: cell,
      direction: 'x' || 'y',
      size: 3,
    },
    {
      start: cell,
      direction: 'x' || 'y',
      size: 2,
    },
  ]
```

A `cell` is an array of two int between 1 and 10 representing the row and the column. eg: `[1, 1]`

`direction`: if the ship is place horizontally (`x`) or vertically (`y`).

To play, a player must emit a message with the selected `cell`:

`socket.emit('played', cell);`

## EMIT
All emitted event from the server follow this syntax:

```
io.emit('message', { action: 'event', [opts] });
```


When a player join, the server send a message to all connected players:

```
{
  action: 'join',
}
```

When a player has set his troups, the server send a message to all connected players:

```
{
  action: 'ready',
}
```


If two players are connected but one as not set his troups yet, the server send a message to all connected players:

```
{
  action: 'idle',
}
```

When the two players have set their troups, the server send a message to all connected players:

```
{
  action: 'start',
}
```

When a player hit a ship, the server send a message and wait for other player to play:

```
{
  action: 'hit',
  cell,
}
```

When a player sank a ship, the server send a message and wait for other player to play:

```
{
  action: 'sank',
  cell,
}
```

When a player miss a ship, the server send a message and wait for other player to play:

```
{
  action: 'missed',
  cell,
}
```

When a player has sank all opponent's ships, the server send a 'win' event and send the winner socket id

```
{
  action: 'win',
  socket: socket.id,
}
```

When the game end, send an 'end' event

```
{
  action: 'end',
}
```

If it is not the player's turn, the server emit this event to him:

```
{
  action: 'not your turn',
}
```

On player disconnection:

```
{
  action: 'leave',
}
```