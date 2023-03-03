import db from "../database/database.js";
import { nanoid } from "nanoid";

export async function createUrl(req, res){
    const { url } = req.body;
    const session = res.locals.session;

    try {
        const shortUrl = nanoid(6);

        await db.query(`INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3);`, [session.userId, url, shortUrl]) 
        const findUrl = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        const data = findUrl.rows[0];
        
        return res.status(201).send({
            id: data.id,
            shortUrl: data.shortUrl,
          });

    } catch (error) {
        res.status(500).send(error.message)
    }


}