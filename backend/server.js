// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // --- TESTIMET ---
// app.get("/", (req, res) => res.send("API OK"));
// app.get("/test-db", (req, res) => {
//   db.query("SELECT 1", (err, result) => {
//     if (err) return res.send(err);
//     res.send("DB WORKING 🔥");
//   });
// });

// // --- ROUTES ---
// const authorRoutes = require("./authorRoutes");
// app.use("/", authorRoutes);
// // app.use("/authors", authorRoutes);

// // --- BOOKS ---
// app.get("/books", (req, res) => {
//   db.query("SELECT * FROM books", (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json(result);
//   });
// });

// app.post("/books", (req, res) => {
//   const {
//     titulli,
//     autori_id,
//     kategoria_id,
//     isbn,
//     viti_botimit,
//     gjuha,
//     numri_faqeve,
//     formati,
//     madhesia_mb,
//     shtegu_skedarit,
//     foto_kopertines,
//   } = req.body;
//   const sql =
//     "INSERT INTO books (titulli, autori_id, kategoria_id, isbn, viti_botimit, gjuha, numri_faqeve, formati, madhesia_mb, shtegu_skedarit, foto_kopertines) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   db.query(
//     sql,
//     [
//       titulli,
//       autori_id,
//       kategoria_id,
//       isbn,
//       viti_botimit,
//       gjuha,
//       numri_faqeve,
//       formati,
//       madhesia_mb,
//       shtegu_skedarit,
//       foto_kopertines,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       res.json("Libri u shtua!");
//     },
//   );
// });

// app.put("/books/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     titulli,
//     autori_id,
//     kategoria_id,
//     isbn,
//     viti_botimit,
//     gjuha,
//     numri_faqeve,
//     foto_kopertines,
//   } = req.body;
//   const sql =
//     "UPDATE books SET titulli=?, autori_id=?, kategoria_id=?, isbn=?, viti_botimit=?, gjuha=?, numri_faqeve=?, foto_kopertines=? WHERE id=?";
//   db.query(
//     sql,
//     [
//       titulli,
//       autori_id,
//       kategoria_id,
//       isbn,
//       viti_botimit,
//       gjuha,
//       numri_faqeve,
//       foto_kopertines,
//       id,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Libri u përditësua!");
//     },
//   );
// });

// app.delete("/books/:id", (req, res) => {
//   db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json("Libri u fshi!");
//   });
// });

// // --- CATEGORIES (KËTU ISHTE PROBLEMI YT) ---
// app.get("/categories", (req, res) => {
//   db.query("SELECT * FROM categories", (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data);
//   });
// });

// app.post("/categories", (req, res) => {
//   const { emertimi, pershkrimi, ikona, kategoria_prind_id } = req.body;
//   const sql =
//     "INSERT INTO categories (emertimi, pershkrimi, ikona, kategoria_prind_id) VALUES (?, ?, ?, ?)";
//   db.query(
//     sql,
//     [
//       emertimi,
//       pershkrimi,
//       ikona,
//       kategoria_prind_id === "" ? null : kategoria_prind_id,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Kategoria u shtua!");
//     },
//   );
// });

// app.put("/categories/:id", (req, res) => {
//   const { id } = req.params;
//   const { emertimi, pershkrimi, ikona, kategoria_prind_id } = req.body;
//   const sql =
//     "UPDATE categories SET emertimi=?, pershkrimi=?, ikona=?, kategoria_prind_id=? WHERE id=?";
//   db.query(
//     sql,
//     [
//       emertimi,
//       pershkrimi,
//       ikona,
//       kategoria_prind_id === "" ? null : kategoria_prind_id,
//       id,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Kategoria u përditësua!");
//     },
//   );
// });

// app.delete("/categories/:id", (req, res) => {
//   const { id } = req.params;

//   // Fikim kontrollin e lidhjeve (Foreign Keys) për këtë kërkesë
//   db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
//     if (err) return res.status(500).send(err);

//     const sql = "DELETE FROM categories WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//       // Rindezim kontrollin e lidhjeve
//       db.query("SET FOREIGN_KEY_CHECKS = 1");

//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Kategoria u fshi me sukses (bashkë me thyerjen e lidhjeve)!");
//     });
//   });
// });

// // --- USERS ---
// app.get("/users", (req, res) => {
//   db.query(
//     "SELECT id, username, email, emri, mbiemri, roli FROM users",
//     (err, data) => {
//       if (err) return res.status(500).json(err);
//       res.json(data);
//     },
//   );
// });

// app.post("/users", (req, res) => {
//   const { username, email, passwordHash, emri, mbiemri, roli } = req.body;
//   const sql =
//     "INSERT INTO users (username, email, passwordHash, emri, mbiemri, roli) VALUES (?, ?, ?, ?, ?, ?)";
//   db.query(
//     sql,
//     [username, email, passwordHash, emri, mbiemri, roli],
//     (err, result) => {
//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Përdoruesi u shtua!");
//     },
//   );
// });

// app.put("/users/:id", (req, res) => {
//   const { username, email, emri, mbiemri, roli } = req.body;
//   const sql =
//     "UPDATE users SET username=?, email=?, emri=?, mbiemri=?, roli=? WHERE id=?";
//   db.query(
//     sql,
//     [username, email, emri, mbiemri, roli, req.params.id],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       res.json("Përdoruesi u përditësua!");
//     },
//   );
// });

// app.delete("/users/:id", (req, res) => {
//   db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json("Përdoruesi u fshi!");
//   });
// });

// // --- PLANS ---
// app.get("/plans", (req, res) => {
//   db.query("SELECT * FROM plans", (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data);
//   });
// });

// app.post("/plans", (req, res) => {
//   const {
//     emertimi,
//     pershkrimi,
//     cmimi_mujor,
//     librat_max_mujor,
//     a_ka_shkarkim,
//     statusi,
//   } = req.body;
//   const sql =
//     "INSERT INTO plans (emertimi, pershkrimi, cmimi_mujor, librat_max_mujor, a_ka_shkarkim, statusi) VALUES (?, ?, ?, ?, ?, ?)";
//   db.query(
//     sql,
//     [
//       emertimi,
//       pershkrimi,
//       cmimi_mujor,
//       librat_max_mujor,
//       a_ka_shkarkim,
//       statusi,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).send(err.sqlMessage);
//       res.json("Plani u shtua!");
//     },
//   );
// });

// app.put("/plans/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     emertimi,
//     pershkrimi,
//     cmimi_mujor,
//     librat_max_mujor,
//     a_ka_shkarkim,
//     statusi,
//   } = req.body;

//   const sql = `
//     UPDATE plans
//     SET emertimi = ?, pershkrimi = ?, cmimi_mujor = ?, librat_max_mujor = ?, a_ka_shkarkim = ?, statusi = ?
//     WHERE id = ?
//   `;

//   const values = [
//     emertimi,
//     pershkrimi,
//     cmimi_mujor,
//     librat_max_mujor,
//     a_ka_shkarkim,
//     statusi,
//     id,
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err.sqlMessage);
//     }
//     res.json("Plani u përditësua me sukses!");
//   });
// });

// app.delete("/plans/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = "DELETE FROM plans WHERE id = ?";

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error(err);
//       // Nëse plani është i lidhur me ndonjë pajtim (subscription) të përdoruesve
//       if (err.code === "ER_ROW_IS_REFERENCED_2") {
//         return res
//           .status(400)
//           .send("Nuk mund të fshihet: Ky plan është aktiv te disa përdorues!");
//       }
//       return res.status(500).send(err.sqlMessage);
//     }
//     res.json("Plani u fshi me sukses!");
//   });
// });

// // --- LISTEN (DUHET TË JETË GJITHMONË NË FUND) ---
// app.listen(5000, () => {
//   console.log("Server running on port 5000 🔥");
// });

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// --- 1. TESTIMET (Gjithmonë në fillim) ---
app.get("/", (req, res) => res.send("API OK"));
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("DB WORKING 🔥");
  });
});

// --- 2. BOOKS (Librat) ---
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

// --- 3. CATEGORIES (Kategoritë) ---
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

// --- 4. PLANS (Planet) ---
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

// --- 5. USERS (Përdoruesit) ---
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

// --- 6. AUTHOR ROUTES (Gjithmonë fundi) ---
// Shënim: app.use("/") duhet të jetë pas të gjitha rrugëve specifike
const authorRoutes = require("./authorRoutes");
app.use("/", authorRoutes);

// --- START SERVER ---
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});
