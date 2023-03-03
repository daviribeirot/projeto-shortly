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

export async function signIn(req, res) {

    const {email, password} = req.body;

    try {
    const findUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = findUser.rows[0];

        if (!user || !bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

        const token = uuidV4(); 

        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [user.id, token]);
        res.status(200).send({token});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getMe(req, res){

    const session = res.locals.session;

    try {
        const findUser = await db.query(`
        SELECT
          users.id,
          users.name,
          SUM("visitCount") AS "visitCount"
        FROM
          users
          JOIN urls ON users.id = urls."userId"
        WHERE
          users.id = $1
        GROUP BY
          users.id;`, [session.userId]);

        const findUserUrls = await db.query(`
        SELECT
          id,
          url,
          "shortUrl",
          "visitCount"
        FROM
          urls
        WHERE
          "userId" = $1
        `, [session.userId]);
    
        if (findUser.rowCount === 0) return res.sendStatus(404);

        const userUrls = findUserUrls?.rows.map(u => ({
          id: u.id,
          shortUrl: u.shortUrl,
          url: u.url,
          visitCount: u.visitCount
        }));
    
        const shortenedBody = findUser?.rows.map(u => ({
          id: u.id,
          name: u.name,
          visitCount: u.visitCount,
          shortenedUrls: [
            ...userUrls
          ]
        }));
    
        res.status(200).send(shortenedBody[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}