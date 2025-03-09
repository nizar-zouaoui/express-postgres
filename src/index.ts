import pool from "db";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4080;

app.use(express.json());

app.get("/", async (_: Request, res: Response) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.json(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req: Request, res: Response) => {
  const { name, location } = req.body;
  try {
    await pool.query("INSERT INTO users (name, location) VALUES ($1, $2)", [
      name,
      location,
    ]);
    res.status(201).send(`Your keys were ${name}, ${location}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/setup", async (_: Request, res: Response) => {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50), location VARCHAR(50))"
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
