const db = require("../db");

exports.getAllMaterials = (req, res) => {
    const query = "SELECT * FROM materials";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea materialelor:", err);
            return res.status(500).json({ 
                error: "Eroare la preluarea materialelor din baza de date" 
            });
        }
        
        console.log(`✅ Au fost găsite ${results.length} materiale`);
        res.status(200).json(results);
    });
};

exports.getMaterialById = (req, res) => {
    const materialId = req.params.id;
    const query = "SELECT * FROM materials WHERE id = ?";
    
    db.query(query, [materialId], (err, results) => {
        if (err) {
            console.error("❌ Eroare la preluarea materialului:", err);
            return res.status(500).json({ 
                error: "Eroare la preluarea materialului din baza de date" 
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Materialul nu a fost găsit" });
        }
        
        console.log(`✅ Material găsit: ${results[0].name}`);
        res.status(200).json(results[0]);
    });
};

exports.addMaterial = (req, res) => {
    const { name, texture_path, color_code } = req.body;
    
    if (!name || !texture_path) {
        return res.status(400).json({ 
            error: "Numele și calea texturii sunt obligatorii" 
        });
    }
    
    const query = "INSERT INTO materials (name, texture_path, color_code) VALUES (?, ?, ?)";
    
    db.query(query, [name, texture_path, color_code], (err, result) => {
        if (err) {
            console.error("❌ Eroare la adăugarea materialului:", err);
            return res.status(500).json({ 
                error: "Eroare la adăugarea materialului în baza de date" 
            });
        }
        
        console.log(`✅ Material adăugat cu ID: ${result.insertId}`);
        res.status(201).json({ 
            id: result.insertId,
            name,
            texture_path,
            color_code,
            message: "Material adăugat cu succes"
        });
    });
};

exports.updateMaterial = (req, res) => {
    const materialId = req.params.id;
    const { name, texture_path, color_code } = req.body;
    
    if (!name && !texture_path && !color_code) {
        return res.status(400).json({ 
            error: "Trebuie să furnizați cel puțin un câmp pentru actualizare" 
        });
    }
    
    let query = "UPDATE materials SET ";
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
    
    if (color_code) {
        updateFields.push("color_code = ?");
        queryParams.push(color_code);
    }
    
    query += updateFields.join(", ");
    query += " WHERE id = ?";
    queryParams.push(materialId);
    
    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("❌ Eroare la actualizarea materialului:", err);
            return res.status(500).json({ 
                error: "Eroare la actualizarea materialului în baza de date" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Materialul nu a fost găsit" });
        }
        
        console.log(`✅ Material actualizat: ID ${materialId}`);
        res.status(200).json({ 
            id: materialId,
            message: "Material actualizat cu succes"
        });
    });
};

exports.deleteMaterial = (req, res) => {
    const materialId = req.params.id;
    const query = "DELETE FROM materials WHERE id = ?";
    
    db.query(query, [materialId], (err, result) => {
        if (err) {
            console.error("❌ Eroare la ștergerea materialului:", err);
            return res.status(500).json({ 
                error: "Eroare la ștergerea materialului din baza de date" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Materialul nu a fost găsit" });
        }
        
        console.log(`✅ Material șters: ID ${materialId}`);
        res.status(200).json({ 
            message: "Material șters cu succes" 
        });
    });
};