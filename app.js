const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/players/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get players API

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const playerTeam = `SELECT * FROM cricket_team;`;
  const playersArray = await db.all(playerTeam);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//post player API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;

  const addPlayer = `INSERT INTO cricket_team (player_id,player_name,jersey_number,role)
    VALUES ('${playerId}','${playerName}','${jerseyNumber}','${role}'
        );`;

  const dbResponse = await db.run(addPlayer);
  const player = dbResponse.lastID;
  response.send("Player Added to Team");
});

//GET player by ID

app.get("/players/:playerId/", async (request, response) => {
  const playerByIds = `SELECT * FROM cricket_team WHERE player_id;`;
  const playersId = db.all(playerByIds);
  response.send(playersId);
});

//PUT player

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayer = `UPDATE players SET player_name = '${playerName}',
  jersey_number = '${jerseyNumber}', role = '${role}'
    WHERE player_id = ${playerId};`;
  await db.run(updatePlayer);
  response.send("Successfully updated");
});

// Delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayer = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
