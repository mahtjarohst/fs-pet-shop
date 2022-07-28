import express from "express";
import pg from "pg";

const app = express();
const PORT = 8000;

app.use(express.json());

const pool = new pg.Pool({
  database: "petshop",
});

app.get("/pets", (req, res) => {
  pool.query("SELECT * FROM pets").then((res) => {
    res.send(data.rows);
  });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.get("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM pets").then((data) => {
    if (data.rows[id]) {
      res.send(data.rows[id]);
    } else {
      res.sendStatus(404);
    }
  });
});

app.delete("/pets/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM pets WHERE id = $1 RETURNING *;", [id]).then((data) => {
    if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

app.patch("/pets/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, kind } = req.body;
  if (Number.isNaN(id)) {
    res.status(400).send(`invalid id "${req.params}`);
  }
  pool
    .query(
      `
            UPDATE pets
            SET name = COALESCE($1, name),
            age = COALESCE($2, age),
            kind = COALESCE($3, kind)
            WHERE id = $4
            RETURNING *;
            `,
      [name, age, kind, id]
    )
    .then((result) => {
      res.send(result.rows[0]);
    });
});

app.post("/pets/", (req, res) => {
  const { age, name, kind } = req.body;
  pool
    .query(
      "INSERT INTO pets (age, name, kind) VALUES ($1, $2, $3) RETURNING *",
      [age, name, kind]
    )
    .then((result) => {
      console.log(result.rows);
      req.send(result.rows[0]);
    });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
