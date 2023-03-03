import db from "../database/database.js";

export default async function sessionValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
  
    try {
      const session = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
      
      if (session.rowCount === 0) return res.sendStatus(401);
  
      res.locals.session = session.rows[0];
  
      next();
  
    } catch (error) {
      res.status(500).send(error.message);
    }
  }