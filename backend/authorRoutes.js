const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/authors", (req, res) => {
  const { emri, mbiemri, biografia, vendi, foto_profili } = req.body;
  const sql =
    "INSERT INTO Authors (emri, mbiemri, biografia, vendi, foto_profili) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [emri, mbiemri, biografia, vendi, foto_profili],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({ message: "Autori u shtua me sukses", id: result.insertId });
    },
  );
});

router.get("/authors", (req, res) => {
  const sql = "SELECT * FROM Authors";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

router.put("/authors/:id", (req, res) => {
  const { emri, mbiemri, biografia, vendi, foto_profili } = req.body;
  const sql =
    "UPDATE Authors SET emri=?, mbiemri=?, biografia=?, vendi=?, foto_profili=? WHERE id=?";

  db.query(
    sql,
    [emri, mbiemri, biografia, vendi, foto_profili, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Autori u përditësua" });
    },
  );
});

router.delete("/authors/:id", (req, res) => {
  const sql = "DELETE FROM Authors WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Autori u fshi" });
  });
});

module.exports = router;
