import db from "../database/database.js";
import { nanoid } from "nanoid";

export async function createUrl(req, res) {
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
        res.status(500).send(error.message);
    }
}

export async function getUrlById(req, res) {

    const { id } = req.params;

    try {
        const url = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);

        if (url.rowCount === 0) return res.sendStatus(404);

        res.send(url.rows[0]).status(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function goToUrl(req, res) {

    const  { shortUrl }  = req.params;

    try {
        const urlExists = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);

        if (urlExists.rowCount === 0) return res.sendStatus(404);

        const data = urlExists.rows[0];
        
        await db.query(`UPDATE urls SET "visitCount" = $1 WHERE id = $2`, [data.visitCount + 1, data.id]);
        res.redirect(data.url);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;
    const session = res.locals.session;

    try {
        const findUrl = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);

        if (findUrl.rowCount === 0) return res.sendStatus(404);
        const data = findUrl.rows[0];

        if (data.userId !== session.userId) return res.sendStatus(401);

        await db.query("DELETE FROM urls WHERE id=$1", [id]);

        res.sendStatus(204);
    } catch (error) {

        return res.status(500).send(error.message);
    }
}

export async function getRanking(req, res){

    try {
         const findRankingInfos = await db.query(`
        SELECT
          users.id,
          users.name,
          COUNT(urls.id) AS "linksCount",
          COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
        FROM
          users
          LEFT JOIN urls ON users.id = urls."userId"
        GROUP BY
          users.id
        ORDER BY
          "visitCount" DESC
        LIMIT
          10;`); 

        res.status(200).send(findRankingInfos.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

