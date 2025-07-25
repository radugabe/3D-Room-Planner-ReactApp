const db = require("../db");

exports.getAllWalls = (req, res) => {
    const query = "SELECT * FROM walls";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea texturilor pentru pereți:", err);
            return res.status(500).json({ error: "Eroare la preluarea texturilor din baza de date" });
        }
        
        res.status(200).json(results);
    });
};

exports.getWallById = (req, res) => {
    const wallId = req.params.id;
    const query = "SELECT * FROM walls WHERE id = ?";
    
    db.query(query, [wallId], (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea texturii pentru perete:", err);
            return res.status(500).json({ error: "Eroare la preluarea texturii pentru perete" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Textura pentru perete nu a fost găsită" });
        }
        
        res.status(200).json(results[0]);
    });
};

exports.addWall = (req, res) => {
    const { name, texture_path } = req.body;
    
    if (!name || !texture_path) {
        return res.status(400).json({ error: "Numele și calea texturii sunt obligatorii" });
    }
    
    const query = "INSERT INTO walls (name, texture_path) VALUES (?, ?)";
    
    db.query(query, [name, texture_path], (err, result) => {
        if (err) {
            console.error("❌ Eroare la adăugarea texturii pentru perete:", err);
            return res.status(500).json({ error: "Eroare la adăugarea texturii în baza de date" });
        }
        
        res.status(201).json({ id: result.insertId, name, texture_path, message: "Textură pentru perete adăugată cu succes" });
    });
};

exports.deleteWall = (req, res) => {
    const wallId = req.params.id;
    const query = "DELETE FROM walls WHERE id = ?";
    
    db.query(query, [wallId], (err, result) => {
        if (err) {
            console.error("❌ Eroare la ștergerea texturii pentru perete:", err);
            return res.status(500).json({ error: "Eroare la ștergerea texturii pentru perete" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Textura pentru perete nu a fost găsită" });
        }
        
        res.status(200).json({ message: "Textura pentru perete ștearsă cu succes" });
    });
};
