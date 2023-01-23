const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializationDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializationDatabase();

const project = () => {
  app.get(`/players/`, async (request, response) => {
    const playerTeam = `SELECT * FROM cricket_team;`;
    const booksArray = await db.all(playerTeam);
    Response.send(booksArray);
  });
};
module.exports = project;
