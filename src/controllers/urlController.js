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
        res.status(500).send(error.message);
    }
}

export async function getUrlById(req,res){

    const { id } = req.params;

    try {
       const url = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);

       if (url.rowCount === 0) return res.sendStatus(404);

        res.send(url.rows[0]).status(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function goToUrl(req, res){

    const { shortUrl } = req.params;

    try {
      const url = await db.query(`SELECT url, id, "visitCount" FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
      console.log(url.rows[0])

      if (!url.rows[0]) return res.sendStatus(404);
      
      await db.query(`UPDATE urls SET "visitCount" = $1 WHERE id = $2;`, [url.rows[0].visitCount + 1, url.rows[0].id]);
      
     res.redirect(url.rows[0].url);
  
    } catch (error) {
      res.status(500).send(error.message);
    }
}