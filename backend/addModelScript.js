const readline = require("readline");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "room_planner"
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  const name = await ask("Nume model: ");
  const category = await ask("Categorie: ");

  const folderName = name.toLowerCase().replace(/\s+/g, "");
  const modelPath = `/models/${category}/${folderName}/${folderName}.glb`;
  const path = `/models/${category}/${folderName}`;
  const thumbnailPath = `/models/${category}/${folderName}/${folderName}.png`;

  const default_scale_x = 1.0;
  const default_scale_y = 1.0;
  const default_scale_z = 1.0;

  db.query(
    "INSERT INTO models (name, modelPath, default_scale_x, default_scale_y, default_scale_z, thumbnailPath, path, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, modelPath, default_scale_x, default_scale_y, default_scale_z, thumbnailPath, path, category],
    (err, result) => {
      if (err) {
        console.error("Eroare la inserare:", err.message);
      } else {
        console.log("Model adăugat cu succes! ID:", result.insertId);
      }
      db.end();
      rl.close();
    }
  );
})();
