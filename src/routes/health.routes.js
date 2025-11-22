const express = require("express");
const router = express.Router();
const { getDb } = require("../config/db");

router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.raw("SELECT NOW() AS now");
    res.json({
      status: "ok",
      dbTime: result[0][0].now,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
