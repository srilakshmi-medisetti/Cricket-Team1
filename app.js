const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

const databasePath = path.join(__dirname, 'cricketTeam.db')
const app = express()
app.use(express.json())
let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.database,
    })
    app.listen(3000, () => console.log('http://localhost/3000/'))
  } catch (error) {
    console.log(`DB Error ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const convertDbObjectAndResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`
  const playersArray = await database.all(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer =>
      convertDbObjectAndResponseObject(eachPlayer),
    ),
  )
})
app.post('/players/', async (request, response) => {
  const detailes = request.body
  const {playerName, jerseyNumber, role} = detailes
  const postPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)VALUES ("${playerName}",${jerseyNumber},"${role}");`
  const player = await database.run(postPlayerQuery)
  response.send('Player Added to Team')
})
app.get('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
  const data = await database.get(playerQuery)
  response.send(convertDbObjectAndResponseObject(data))
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.body
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = detailes
  const updatePlayerQuery = `UPDATE cricket_team SET player_name="${playerName}",jersey_number="${jerseyNumber}",role="${role}" WHERE player_id=${playerId};`
  await database.run(updatePlayerQuery)
  response.send('Player Detailes Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`
  await database.run(deletePlayerQuery)
  response.send('Player Removed')
})
module.exports = app
