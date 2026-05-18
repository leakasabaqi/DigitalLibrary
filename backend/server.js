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

app.get("/api/stats", (req, res) => {
  const queries = {
    totalBooks: "SELECT COUNT(*) as count FROM books",
    totalUsers: "SELECT COUNT(*) as count FROM users",
    totalSubscriptions: "SELECT COUNT(*) as count FROM subscriptions",
    latestBook: "SELECT titulli FROM books ORDER BY id DESC LIMIT 1",
  };

  const results = {};
  const keys = Object.keys(queries);

  let completed = 0;
  keys.forEach((key) => {
    db.query(queries[key], (err, data) => {
      if (err) return res.status(500).json(err);
      results[key] = data[0];
      completed++;
      if (completed === keys.length) res.json(results);
    });
  });
});

app.get("/books", (req, res) => {
  const sql = `
    SELECT b.*, a.emri AS autor_emri, a.mbiemri AS autor_mbiemri
    FROM books b
    LEFT JOIN authors a ON b.autori_id = a.id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/books/search", (req, res) => {
  const q = req.query.q || "";
  const sql = `
    SELECT b.*, a.emri AS autor_emri, a.mbiemri AS autor_mbiemri
    FROM books b
    LEFT JOIN authors a ON b.autori_id = a.id
    WHERE b.titulli LIKE ? OR a.emri LIKE ? OR a.mbiemri LIKE ?
  `;
  const like = `%${q}%`;
  db.query(sql, [like, like, like], (err, result) => {
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
      // Get the inserted user
      const userId = result.insertId;
      const selectSql =
        "SELECT id, username, email, emri, mbiemri, roli FROM users WHERE id = ?";
      db.query(selectSql, [userId], (err2, userResult) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "Përdoruesi u shtua!", user: userResult[0] });
      });
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

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT id, username, email, emri, mbiemri, roli FROM users WHERE (email = ? OR username = ?) AND passwordHash = ? AND roli != 'admin'";
  db.query(sql, [email, email, password], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(401).json("Kredencialet e gabuara!");
    res.json({ message: "Login i suksesshëm!", user: result[0] });
  });
});

app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT id, username, email, emri, mbiemri, roli FROM users WHERE (email = ? OR username = ?) AND passwordHash = ? AND roli = 'admin'";
  db.query(sql, [email, email, password], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(401).json("Kredencialet e gabuara!");
    res.json({ message: "Admin login i suksesshëm!", user: result[0] });
  });
});

app.post("/subscriptions", (req, res) => {
  const {
    perdoruesi_id,
    plani_id,
    data_fillimit,
    data_skadimit,
    statusi,
    pagesa_automatike,
  } = req.body;
  const sql =
    "INSERT INTO subscriptions (perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      perdoruesi_id,
      plani_id,
      data_fillimit,
      data_skadimit,
      statusi,
      pagesa_automatike,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Abonimi u krijua me sukses!");
    },
  );
});

app.get("/subscriptions", (req, res) => {
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
  const {
    perdoruesi_id,
    plani_id,
    data_fillimit,
    data_skadimit,
    statusi,
    pagesa_automatike,
  } = req.body;

  const sql =
    "UPDATE subscriptions SET perdoruesi_id = ?, plani_id = ?, data_fillimit = ?, data_skadimit = ?, statusi = ?, pagesa_automatike = ? WHERE id = ?";

  db.query(
    sql,
    [
      perdoruesi_id,
      plani_id,
      data_fillimit,
      data_skadimit,
      statusi,
      pagesa_automatike,
      subId,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json("Abonimi u përditësua me sukses!");
    },
  );
});

app.delete("/subscriptions/:id", (req, res) => {
  const subId = req.params.id;
  const sql = "DELETE FROM subscriptions WHERE id = ?";

  db.query(sql, [subId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json("Abonimi u fshi me sukses!");
  });
});

app.get("/currently-reading/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT rh.*, b.titulli, b.foto_kopertines, b.numri_faqeve
    FROM readinghistory rh
    JOIN books b ON rh.libri_id = b.id
    WHERE rh.perdoruesi_id = ? AND rh.statusi = 'duke e lexuar'
  `;
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.get("/reading-history", (req, res) => {
  const userId = req.query.perdoruesi_id;
  let sql = `
    SELECT 
      rh.*, 
      u.emri, 
      u.mbiemri, 
      b.titulli AS libri_titulli,
      b.numri_faqeve,
      b.foto_kopertines
    FROM readinghistory rh
    JOIN users u ON rh.perdoruesi_id = u.id
    JOIN books b ON rh.libri_id = b.id
  `;
  const params = [];
  if (userId) {
    sql += " WHERE rh.perdoruesi_id = ?";
    params.push(userId);
  }

  db.query(sql, params, (err, data) => {
    if (err) {
      console.error("GABIM NË GET:", err.sqlMessage);
      return res.status(500).json(err);
    }
    res.json(data);
  });
});
app.post("/reading-history", (req, res) => {
  const sql =
    "INSERT INTO readinghistory (`perdoruesi_id`, `libri_id`, `data_fillimit`, `data_fundit`, `faqja_aktuale`, `perqindja_leximit`, `statusi`) VALUES (?)";

  const values = [
    req.body.perdoruesi_id,
    req.body.libri_id,
    req.body.data_fillimit || new Date().toISOString().slice(0, 10),
    req.body.data_fundit || null,
    req.body.faqja_aktuale || 0,
    req.body.perqindja_leximit || 0,
    req.body.statusi || "duke e lexuar",
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("GABIM NË RUJTJE (POST):", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json("Sukses!");
  });
});

app.put("/reading-history/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE readinghistory SET `perdoruesi_id`=?, `libri_id`=?, `data_fillimit`=?, `data_fundit`=?, `faqja_aktuale`=?, `perqindja_leximit`=?, `statusi`=? WHERE id = ?";

  const values = [
    req.body.perdoruesi_id,
    req.body.libri_id,
    req.body.data_fillimit,
    req.body.data_fundit,
    req.body.faqja_aktuale,
    req.body.perqindja_leximit,
    req.body.statusi,
    id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("GABIM NE PUT:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json("U përditësua me sukses!");
  });
});

app.delete("/reading-history/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM readinghistory WHERE id = ?", [id], (err, data) => {
    if (err) {
      console.error("GABIM NE DELETE:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json("U fshi me sukses!");
  });
});

app.get("/reviews", (req, res) => {
  const sql = `
        SELECT r.*, u.emri, u.mbiemri, b.titulli 
        FROM reviews r
        JOIN users u ON r.perdoruesi_id = u.id
        JOIN books b ON r.libri_id = b.id
    `;
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Gabim SQL:", err);
      return res.status(500).json(err);
    }
    res.json(data);
  });
});

app.post("/reviews", (req, res) => {
  const sql =
    "INSERT INTO reviews (`perdoruesi_id`, `libri_id`, `vleresimi`, `komenti`) VALUES (?)";
  const values = [
    req.body.perdoruesi_id,
    req.body.libri_id,
    req.body.vleresimi,
    req.body.komenti,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("Vlerësimi u shtua!");
  });
});

app.put("/reviews/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE reviews SET perdoruesi_id=?, libri_id=?, vleresimi=?, komenti=? WHERE id=?";
  const values = [
    req.body.perdoruesi_id,
    req.body.libri_id,
    req.body.vleresimi,
    req.body.komenti,
    id,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U përditësua!");
  });
});

// DELETE - Fshij nga tabela reviews
app.delete("/reviews/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM reviews WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U fshi!");
  });
});

app.get("/wishlists", (req, res) => {
  const userId = req.query.perdoruesi_id;
  let sql = `
    SELECT w.*, u.emri, u.mbiemri, b.titulli, b.foto_kopertines
    FROM wishlists w
    JOIN users u ON w.perdoruesi_id = u.id
    JOIN books b ON w.libri_id = b.id
  `;
  const params = [];
  if (userId) {
    sql += " WHERE w.perdoruesi_id = ?";
    params.push(userId);
  }
  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/wishlists", (req, res) => {
  const sql = "INSERT INTO wishlists (`perdoruesi_id`, `libri_id`) VALUES (?)";
  const values = [req.body.perdoruesi_id, req.body.libri_id];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("Shtuar!");
  });
});

app.put("/wishlists/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE wishlists SET perdoruesi_id = ?, libri_id = ? WHERE id = ?";
  db.query(
    sql,
    [req.body.perdoruesi_id, req.body.libri_id, id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("U përditësua!");
    },
  );
});

app.delete("/wishlists/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM wishlists WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U fshi!");
  });
});

app.get("/collections", (req, res) => {
  const sql = `
        SELECT c.*, u.emri, u.mbiemri 
        FROM collections c
        JOIN users u ON c.perdoruesi_id = u.id
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/collections", (req, res) => {
  const sql =
    "INSERT INTO collections (`perdoruesi_id`, `emertimi`, `pershkrimi`, `a_eshte_publike`) VALUES (?)";
  const values = [
    req.body.perdoruesi_id,
    req.body.emertimi,
    req.body.pershkrimi,
    req.body.a_eshte_publike,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Koleksioni u krijua me sukses!", id: data.insertId });
  });
});

app.get("/collections/:id/books", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT cb.id, cb.libri_id, cb.data_shtimit, b.titulli, b.foto_kopertines,
           a.emri AS autor_emri, a.mbiemri AS autor_mbiemri
    FROM collectionbooks cb
    JOIN books b ON cb.libri_id = b.id
    LEFT JOIN authors a ON b.autori_id = a.id
    WHERE cb.koleksioni_id = ?
    ORDER BY cb.data_shtimit DESC
  `;
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.put("/collections/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE collections SET perdoruesi_id = ?, emertimi = ?, pershkrimi = ?, a_eshte_publike = ? WHERE id = ?";
  const values = [
    req.body.perdoruesi_id,
    req.body.emertimi,
    req.body.pershkrimi,
    req.body.a_eshte_publike,
    id,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U përditësua!");
  });
});

app.delete("/collections/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM collectionbooks WHERE koleksioni_id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    db.query("DELETE FROM collections WHERE id = ?", [id], (err2, data) => {
      if (err2) return res.status(500).json(err2);
      res.json("U fshi!");
    });
  });
});

// GET - Merr lidhjet mes koleksioneve dhe librave
app.get("/collection-books", (req, res) => {
  const sql = `
        SELECT cb.id, c.emertimi as koleksioni, b.titulli as libri, cb.koleksioni_id, cb.libri_id, cb.data_shtimit
        FROM collectionbooks cb
        JOIN collections c ON cb.koleksioni_id = c.id
        JOIN books b ON cb.libri_id = b.id
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// PUT - Edito lidhjen mes koleksionit dhe librit
app.get("/collection-books", (req, res) => {
  const sql = `
        SELECT 
            cb.id, 
            c.emertimi as koleksioni, 
            u.emri as pronari_emri, 
            u.mbiemri as pronari_mbiemri,
            b.titulli as libri, 
            cb.koleksioni_id, 
            cb.libri_id, 
            cb.data_shtimit
        FROM collectionbooks cb
        JOIN collections c ON cb.koleksioni_id = c.id
        JOIN users u ON c.perdoruesi_id = u.id
        JOIN books b ON cb.libri_id = b.id
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
app.put("/collection-books/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE collectionbooks SET koleksioni_id = ?, libri_id = ? WHERE id = ?";
  db.query(
    sql,
    [req.body.koleksioni_id, req.body.libri_id, id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("U përditësua me sukses!");
    },
  );
});
// POST - Shto libër në koleksion
app.post("/collection-books", (req, res) => {
  const sql =
    "INSERT INTO collectionbooks (`koleksioni_id`, `libri_id`) VALUES (?)";
  const values = [req.body.koleksioni_id, req.body.libri_id];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U shtua me sukses!");
  });
});

// DELETE - Largo nga koleksioni
app.delete("/collection-books/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM collectionbooks WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U hoq!");
  });
});

// GET - Lexo të gjithë shënuesit
app.get("/bookmarks", (req, res) => {
  const sql = `
        SELECT bm.*, u.emri, u.mbiemri, b.titulli 
        FROM bookmarks bm
        JOIN users u ON bm.perdoruesi_id = u.id
        JOIN books b ON bm.libri_id = b.id
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// POST - Shto shënues të ri
app.post("/bookmarks", (req, res) => {
  const sql =
    "INSERT INTO bookmarks (`perdoruesi_id`, `libri_id`, `faqja`, `shenime`) VALUES (?)";
  const values = [
    req.body.perdoruesi_id,
    req.body.libri_id,
    req.body.faqja,
    req.body.shenime,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("Shënuesi u ruajt!");
  });
});

app.put("/bookmarks/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE bookmarks SET faqja = ?, shenime = ? WHERE id = ?";
  db.query(sql, [req.body.faqja, req.body.shenime, id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("U përditësua!");
  });
});

app.delete("/bookmarks/:id", (req, res) => {
  db.query(
    "DELETE FROM bookmarks WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("U fshi!");
    },
  );
});

// GET - Merr të gjitha kërkesat për libra
app.get("/book-requests", (req, res) => {
  const sql = `
        SELECT br.*, u.emri, u.mbiemri 
        FROM bookrequests br
        JOIN users u ON br.perdoruesi_id = u.id
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
// POST - Krijo kërkesë të re
app.post("/book-requests", (req, res) => {
  const sql =
    "INSERT INTO bookrequests (`perdoruesi_id`, `titulli_librit`, `autori`, `statusi`) VALUES (?)";
  const values = [
    req.body.perdoruesi_id,
    req.body.titulli_librit,
    req.body.autori,
    req.body.statusi || "Ne Pritje",
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("Kërkesa u dërgua me sukses!");
  });
});

// PUT - Përditëso statusin ose të dhënat e kërkesës
app.put("/book-requests/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE bookrequests SET titulli_librit = ?, autori = ?, statusi = ? WHERE id = ?";
  db.query(
    sql,
    [req.body.titulli_librit, req.body.autori, req.body.statusi, id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Kërkesa u përditësua!");
    },
  );
});

// DELETE - Fshij kërkesën
app.delete("/book-requests/:id", (req, res) => {
  db.query(
    "DELETE FROM bookrequests WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Kërkesa u fshi!");
    },
  );
});

// Payment endpoint
app.post("/api/payments", (req, res) => {
  const { perdoruesi_id, plani_id, cmimi_mujor, card_number, expiry, cvv, cardholder_name } = req.body;

  if (!perdoruesi_id || !plani_id) {
    return res.status(400).json("Missing required fields");
  }

  if (!card_number || !expiry || !cvv || !cardholder_name) {
    return res.status(400).json("Card details are required");
  }

  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  const dataSkadimit = endDate.toISOString().split("T")[0];

  const sql =
    "INSERT INTO subscriptions (perdoruesi_id, plani_id, data_fillimit, data_skadimit, statusi, pagesa_automatike) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [perdoruesi_id, plani_id, startDate, dataSkadimit, "aktiv", 1],
    (err, result) => {
      if (err) return res.status(500).json(err.sqlMessage);

      const subId = result.insertId;
      const selectSql = `SELECT s.*, p.emertimi AS plani_emri 
                         FROM subscriptions s 
                         JOIN plans p ON s.plani_id = p.id 
                         WHERE s.id = ?`;

      db.query(selectSql, [subId], (err2, subResult) => {
        if (err2) return res.status(500).json(err2);
        res.json(subResult[0]);
      });
    },
  );
});

const authorRoutes = require("./authorRoutes");
app.use("/", authorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});
