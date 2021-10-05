const db = require('./../modal/database').connectDb();
const { ErrorNotification } = require('./../helpers/notification');

const error = ErrorNotification();

const RangoFechas = () => {
    return {
        rangeDate: (view, init, end) => {
            const conn = db.connect();

            conn.query(`SELECT id_venta, productos, impuestos, tipo_pago, ventas.fecha_creacion, id_referencial, COUNT(*) AS ventas FROM ventas 
            INNER JOIN factura ON(ventas.factura_id = factura.id_factura)
            WHERE ventas.fecha_creacion > ? AND ventas.fecha_creacion < ? GROUP BY ventas.fecha_creacion`, [init, end], (err, rows) => {
                if(err) {
                    error.error('Hubo un problema', 'No se encontro datos');
                } else {
                    view.webContents.send('graphicData::sales', rows);
                }
            });

            conn.end();
            return this.datos;
        }
    };
};

module.exports = {
    RangoFechas
};