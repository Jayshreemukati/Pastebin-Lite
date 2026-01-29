const express = require("express");
const db = require("../db");
const getNow = require("../getNow");

const router = express.Router();

/* CREATE PASTE */
router.post("/pastes", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Invalid content" });
    }

    const now = new Date();
    const expiresAt = ttl_seconds
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

    // ❌ id mat bhejo
    const [result] = await db.query(
      `INSERT INTO pastes (content, created_at, expires_at, max_views)
       VALUES (?, ?, ?, ?)`,
      [content, now, expiresAt, max_views || null]
    );

    // ✅ MySQL ka auto generated id use karo
    res.json({
      id: result.insertId,
      url: `${req.protocol}://${req.get("host")}/p/${result.insertId}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



/* FETCH PASTE */
router.get("/pastes/:id", async (req, res) => {
  const now = getNow(req);

  const [rows] = await db.query(
    "SELECT * FROM pastes WHERE id = ?",
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  const paste = rows[0];

  if (
    (paste.expires_at && new Date(paste.expires_at) <= now) ||
    (paste.max_views && paste.views >= paste.max_views)
  ) {
    return res.status(404).json({ error: "Not found" });
  }

  await db.query(
    "UPDATE pastes SET view_count  = view_count  + 1 WHERE id = ?",
    [paste.id]
  );

  res.json({
    content: paste.content,
    remaining_views: paste.max_views
      ? paste.max_views - paste.views - 1
      : null,
    expires_at: paste.expires_at
  });
  
});

module.exports = router;
