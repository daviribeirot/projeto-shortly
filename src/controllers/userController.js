import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import db from "../database/database.js";

export async function signUp(req, res) {

    const { name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const findEmail = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (findEmail.rowCount > 0) return res.sendStatus(409);

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hashedPassword]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
}