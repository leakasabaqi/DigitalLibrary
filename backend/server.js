const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API OK"));
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("DB WORKING 🔥");
  });
});

app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/books", (req, res) => {
  const {
    titulli,
    autori_id,
    kategoria_id,
    isbn,
    viti_botimit,
    gjuha,
    numri_faqeve,
    formati,
    madhesia_mb,
    shtegu_skedarit,
    foto_kopertines,
  } = req.body;

  const sql = `INSERT INTO books 
    (titulli, autori_id, kategoria_id, isbn, viti_botimit, gjuha, numri_faqeve, formati, madhesia_mb, shtegu_skedarit, foto_kopertines) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      titulli,
      autori_id,
      kategoria_id,
      isbn,
      viti_botimit,
      gjuha,
      numri_faqeve,
      formati,
      madhesia_mb,
      shtegu_skedarit,
      foto_kopertines,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json("Libri u shtua!");
    },
  );
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const {
    titulli,
    autori_id,
    kategoria_id,
    isbn,
    viti_botimit,
    gjuha,
    numri_faqeve,
    foto_kopertines,
  } = req.body;
  const sql =
    "UPDATE books SET titulli=?, autori_id=?, kategoria_id=?, isbn=?, viti_botimit=?, gjuha=?, numri_faqeve=?, foto_kopertines=? WHERE id=?";
  db.query(
    sql,
    [
      titulli,
      autori_id,
      kategoria_id,
      isbn,
      viti_botimit,
      gjuha,
      numri_faqeve,
      foto_kopertines,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Libri u përditësua!");
    },
  );
});

app.delete("/books/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json("Libri u fshi!");
  });
});

app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/categories", (req, res) => {
  const { emertimi, pershkrimi, ikona, kategoria_prind_id } = req.body;
  const sql =
    "INSERT INTO categories (emertimi, pershkrimi, ikona, kategoria_prind_id) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [
      emertimi,
      pershkrimi,
      ikona,
      kategoria_prind_id === "" ? null : kategoria_prind_id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Kategoria u shtua!");
    },
  );
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { emertimi, pershkrimi, ikona, kategoria_prind_id } = req.body;
  const sql =
    "UPDATE categories SET emertimi=?, pershkrimi=?, ikona=?, kategoria_prind_id=? WHERE id=?";
  db.query(
    sql,
    [
      emertimi,
      pershkrimi,
      ikona,
      kategoria_prind_id === "" ? null : kategoria_prind_id,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Kategoria u përditësua!");
    },
  );
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
    if (err) return res.status(500).send(err);
    db.query("DELETE FROM categories WHERE id = ?", [id], (err2, result) => {
      db.query("SET FOREIGN_KEY_CHECKS = 1");
      if (err2) return res.status(500).send(err2.sqlMessage);
      res.json("Kategoria u fshi!");
    });
  });
});

app.get("/plans", (req, res) => {
  db.query("SELECT * FROM plans", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/plans", (req, res) => {
  const {
    emertimi,
    pershkrimi,
    cmimi_mujor,
    librat_max_mujor,
    a_ka_shkarkim,
    statusi,
  } = req.body;
  const sql =
    "INSERT INTO plans (emertimi, pershkrimi, cmimi_mujor, librat_max_mujor, a_ka_shkarkim, statusi) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      emertimi,
      pershkrimi,
      cmimi_mujor,
      librat_max_mujor,
      a_ka_shkarkim,
      statusi,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Plani u shtua!");
    },
  );
});

app.put("/plans/:id", (req, res) => {
  const { id } = req.params;
  const {
    emertimi,
    pershkrimi,
    cmimi_mujor,
    librat_max_mujor,
    a_ka_shkarkim,
    statusi,
  } = req.body;
  const sql =
    "UPDATE plans SET emertimi = ?, pershkrimi = ?, cmimi_mujor = ?, librat_max_mujor = ?, a_ka_shkarkim = ?, statusi = ? WHERE id = ?";
  db.query(
    sql,
    [
      emertimi,
      pershkrimi,
      cmimi_mujor,
      librat_max_mujor,
      a_ka_shkarkim,
      statusi,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Plani u përditësua!");
    },
  );
});

app.delete("/plans/:id", (req, res) => {
  db.query("DELETE FROM plans WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2")
        return res.status(400).send("Plani është aktiv!");
      return res.status(500).send(err.sqlMessage);
    }
    res.json("Plani u fshi!");
  });
});

app.get("/users", (req, res) => {
  db.query(
    "SELECT id, username, email, emri, mbiemri, roli FROM users",
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    },
  );
});

app.post("/users", (req, res) => {
  const { username, email, passwordHash, emri, mbiemri, roli } = req.body;
  const sql =
    "INSERT INTO users (username, email, passwordHash, emri, mbiemri, roli) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [username, email, passwordHash, emri, mbiemri, roli],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json("Përdoruesi u shtua!");
    },
  );
});

app.put("/users/:id", (req, res) => {
  const { username, email, emri, mbiemri, roli } = req.body;
  const sql =
    "UPDATE users SET username=?, email=?, emri=?, mbiemri=?, roli=? WHERE id=?";
  db.query(
    sql,
    [username, email, emri, mbiemri, roli, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json("Përdoruesi u përditësua!");
    },
  );
});

app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json("Përdoruesi u fshi!");
  });
});

app.post("/subscriptions", (req, res) => {
  const { perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike } = req.body;
  const sql = "INSERT INTO subscriptions (perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Abonimi u krijua me sukses!");
  });
});

app.get("/subscriptions", (req, res) => {
  // Ky query i bashkon tabelat që të marrësh emrat direkt
  const sql = `
        SELECT s.*, u.emri, u.mbiemri, p.emertimi AS plani_emri 
        FROM subscriptions s
        JOIN users u ON s.perdoruesi_id = u.id
        JOIN plans p ON s.plani_id = p.id
    `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.put("/subscriptions/:id", (req, res) => {
  const subId = req.params.id;
  const { perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike } = req.body;

  const sql = "UPDATE subscriptions SET perdoruesi_id = ?, plani_id = ?, data_fillimit = ?, data_skadimit = ?, statusi = ?, pagesa_automatike = ? WHERE id = ?";

  db.query(sql, [perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike, subId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json("Abonimi u përditësua me sukses!");
  });
});

app.delete("/subscriptions/:id", (req, res) => {
  const subId = req.params.id;
  const sql = "DELETE FROM subscriptions WHERE id = ?";

  db.query(sql, [subId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json("Abonimi u fshi me sukses!");
  });
});


const authorRoutes = require("./authorRoutes");
app.use("/", authorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});
