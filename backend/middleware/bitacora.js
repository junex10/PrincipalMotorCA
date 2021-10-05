const db = require('./../modal/database').connectDb();

const Bitacora = () => {
    return {
        insertBitacora: (usuario, bitacora, tipo_bitacora, modulo) => {
            const conn = db.connect();
            // Bitacora
            conn.query("INSERT INTO BITACORA(usuario_id, bitacora, tipo_bitacora, modulo, fecha_creacion) VALUES(?, ?, ?, ?, NOW())", [usuario, bitacora, tipo_bitacora, modulo], (err, rows) => {
                
            });

            conn.end();
        },
    };
};

module.exports = {
    Bitacora
};