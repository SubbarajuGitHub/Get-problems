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
  const { player_id, player_name, jersey_number, role } = playerDetails;

  const addPlayer = `INSERT INTO cricket_team (player_id,player_name,jersey_number,role)
    VALUES ('${player_id}','${player_name}','${jersey_number}','${role}'
        );`;

  const dbResponse = await db.run(addPlayer);
  const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });
});

//GET player by ID

app.get("/players/:playerId/", async (request, response) => {
  const playerByIds = `SELECT * FROM cricket_team;`;
  const playersId = db.all(playerByIds);
  response.send(playersId);
});

//PUT player

app.put("/players/:playerId/", async (request, response) => {
  const { player_Id } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;

  const updatePlayer = `UPDATE players SET player_name = '${Maneesh}',jersey_number = '${54}', role = '${
    All - rounder
  }
    WHERE player_id = ${player_Id};`;
  await db.run(updatePlayer);
  response.send("Successfully updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { player_id } = request.params;

  const deletePlayer = `DELETE FROM cricketTeam WHERE player_id = ${player_id};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
