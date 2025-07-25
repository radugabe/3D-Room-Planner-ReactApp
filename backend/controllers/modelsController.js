const db = require("../db");

const getAllModels = (req, res) => {
  db.query("SELECT * FROM models", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const modelsWithScale = results.map(model => ({
        id: model.id,
        name: model.name,
        modelPath: model.modelPath,
        thumbnailPath: model.thumbnailPath,
        path: model.path,
        category: model.category || 'Uncategorized',
        defaultScale: {
          x: model.default_scale_x || 1,
          y: model.default_scale_y || 1,
          z: model.default_scale_z || 1
        }
      }));
      res.json(modelsWithScale);
    }
  });
};

const addModel = (req, res) => {
    const { name, modelPath, default_scale_x, default_scale_y, default_scale_z } = req.body;
    
    if (!name || !modelPath) {
        return res.status(400).json({ error: "Numele și calea modelului sunt necesare!" });
    }

    db.query(
        "INSERT INTO models (name, modelPath, default_scale_x, default_scale_y, default_scale_z, category) VALUES (?, ?, ?, ?, ?, ?)",
        [name, modelPath, default_scale_x || 1.0, default_scale_y || 1.0, default_scale_z || 1.0, category || 'uncategorized'],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ message: "Model adăugat cu succes!", id: result.insertId });
            }
        }
    );
};

const deleteModel = (req, res) => {
    const { id } = req.params;
    
    db.query("DELETE FROM models WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Modelul nu există!" });
        } else {
            res.json({ message: "Model șters cu succes!" });
        }
    });
};

module.exports = {
    getAllModels,
    addModel,
    deleteModel
};
