const db = require("../db");

exports.getAllFloors = (req, res) => {
    const query = "SELECT * FROM floors";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea texturilor pentru podea:", err);
            return res.status(500).json({ 
                error: "Eroare la preluarea texturilor pentru podea din baza de date" 
            });
        }
        
        res.status(200).json(results);
    });
};

exports.getFloorById = (req, res) => {
    const floorId = req.params.id;
    const query = "SELECT * FROM floors WHERE id = ?";
    
    db.query(query, [floorId], (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea texturii pentru podea:", err);
            return res.status(500).json({ 
                error: "Eroare la preluarea texturii pentru podea" 
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Textura pentru podea nu a fost găsită" });
        }
        
        res.status(200).json(results[0]);
    });
};

exports.addFloor = (req, res) => {
    const { name, texture_path } = req.body;
    
    if (!name || !texture_path) {
        return res.status(400).json({ 
            error: "Numele și calea texturii sunt obligatorii" 
        });
    }
    
    const query = "INSERT INTO floors (name, texture_path) VALUES (?, ?)";
    
    db.query(query, [name, texture_path], (err, result) => {
        if (err) {
            console.error("❌ Eroare la adăugarea texturii pentru podea:", err);
            return res.status(500).json({ 
                error: "Eroare la adăugarea texturii în baza de date" 
            });
        }
        
        res.status(201).json({ 
            id: result.insertId,
            name,
            texture_path,
            message: "Textură pentru podea adăugată cu succes"
        });
    });
};

exports.updateFloor = (req, res) => {
    const floorId = req.params.id;
    const { name, texture_path } = req.body;
    
    if (!name && !texture_path) {
        return res.status(400).json({ 
            error: "Trebuie să furnizați cel puțin un câmp pentru actualizare" 
        });
    }
    
    let query = "UPDATE floors SET ";
    const updateFields = [];
    const queryParams = [];
    
    if (name) {
        updateFields.push("name = ?");
        queryParams.push(name);
    }
    
    if (texture_path) {
        updateFields.push("texture_path = ?");
        queryParams.push(texture_path);
    }
    
    query += updateFields.join(", ");
    query += " WHERE id = ?";
    queryParams.push(floorId);
    
    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("❌ Eroare la actualizarea texturii pentru podea:", err);
            return res.status(500).json({ 
                error: "Eroare la actualizarea texturii pentru podea" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Textura pentru podea nu a fost găsită" });
        }
        
        res.status(200).json({ 
            id: floorId,
            message: "Textura pentru podea actualizată cu succes"
        });
    });
};

exports.deleteFloor = (req, res) => {
    const floorId = req.params.id;
    const query = "DELETE FROM floors WHERE id = ?";
    
    db.query(query, [floorId], (err, result) => {
        if (err) {
            console.error("❌ Eroare la ștergerea texturii pentru podea:", err);
            return res.status(500).json({ 
                error: "Eroare la ștergerea texturii pentru podea" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Textura pentru podea nu a fost găsită" });
        }
        
        res.status(200).json({ 
            message: "Textura pentru podea ștearsă cu succes" 
        });
    });
};
