const { ErrorNotification, SuccessNotification } = require('./../helpers/notification');
const db = require('./../modal/database').connectDb();
const serialize = require('serialize-javascript');

const bitacora = require('./bitacora').Bitacora();

const error = ErrorNotification();
const success = SuccessNotification();

const dialog = require('electron').dialog;

const Ventas = () => {
    return {

        // Total sale report view

        totalTodayReport: view => {
            const conn = db.connect();

            conn.query("SELECT COUNT(id_venta) AS ventas FROM ventas WHERE fecha_creacion = CURDATE()", (err, rows) => {
                if(!err) {
                    view.webContents.send('listTotalSaleTodayReport', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en modulo de reportes', err);
                }
            });

            conn.end();
        },
        totalWeekReport: view  => {
            const conn = db.connect();

            conn.query("SELECT fecha_creacion, COUNT(id_venta) AS ventas FROM ventas WHERE YEARWEEK(ventas.fecha_creacion, 1) = YEARWEEK(CURDATE(), 1) GROUP BY fecha_creacion", 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listTotalSaleWeekReport', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en modulo de reportes', err);
                }
            });

            conn.end();
        },
        totalMostReport: (view, year) => {
            const conn = db.connect();
            conn.query("SELECT productos, fecha_creacion AS ventas FROM ventas WHERE YEAR(ventas.fecha_creacion) = ?",
            [year], 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listTotalSaleMostPopular', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en modulo de reportes', err);
                }
            });
            conn.end();
        },
        
        // Count total

        totalCountToday: view => {
            const conn = db.connect();
            
            conn.query(`SELECT SUM(total_bs) AS bs, SUM(total_usd) AS usd 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE ventas.fecha_creacion = CURDATE()`, 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listCountSalesToday', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });

            conn.end();
        },
        totalCountWeek: view => {
            const conn = db.connect();
            
            conn.query(`SELECT SUM(total_bs) AS bs, SUM(total_usd) AS usd 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE YEARWEEK(ventas.fecha_creacion, 1) = YEARWEEK(CURDATE(), 1)`, 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listCountSalesWeek', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });

            conn.end();
        },
        totalCountMontly: (view, month, year) => {
            const conn = db.connect();
            
            conn.query(`SELECT SUM(total_bs) AS bs, SUM(total_usd) AS usd 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE MONTH(ventas.fecha_creacion) = ? AND YEAR(ventas.fecha_creacion) = ?`,
            [month, year],
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listCountSalesMonth', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });

            conn.end();
        },
        totalCountYear: (view, year) => {
            const conn = db.connect();
            
            conn.query(`SELECT SUM(total_bs) AS bs, SUM(total_usd) AS usd 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE YEAR(ventas.fecha_creacion) = ?`,
            [year],
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listCountSalesYear', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });

            conn.end();
        },
        // Total 
        totalToday: view => {
            const conn = db.connect();
            
            conn.query(`SELECT id_venta, productos, factura_id, ventas.estado_id, tipo_pago, ventas.fecha_creacion, id_referencial, total_bs, total_usd, estado 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE ventas.fecha_creacion = CURDATE()`, 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listSalesToday', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });

            conn.end();
        },
        totalWeek: view => {
            const conn = db.connect();
            conn.query(`SELECT id_venta, productos, factura_id, ventas.estado_id, tipo_pago, ventas.fecha_creacion, id_referencial, total_bs, total_usd, estado 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE YEARWEEK(ventas.fecha_creacion, 1) = YEARWEEK(CURDATE(), 1)`, 
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listSalesWeek', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });
            conn.end();
        },
        totalMontly: (view, month, year) => {
            const conn = db.connect();
            conn.query(`SELECT id_venta, productos, factura_id, ventas.estado_id, tipo_pago, ventas.fecha_creacion, id_referencial, total_bs, total_usd, estado 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE MONTH(ventas.fecha_creacion) = ? AND YEAR(ventas.fecha_creacion) = ?`, 
            [month, year],
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listSalesMonth', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });
            conn.end();
        },
        totalYear: (view, year) => {
            const conn = db.connect();
            conn.query(`SELECT id_venta, productos, factura_id, ventas.estado_id, tipo_pago, ventas.fecha_creacion, id_referencial, total_bs, total_usd, estado 
            FROM ventas INNER JOIN (factura) ON(ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)
            WHERE YEAR(ventas.fecha_creacion) = ?`, 
            [year],
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listSalesYear', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });
            conn.end();
        },
        listVentas: (view, id = null) => {
            const conn = db.connect();
            if (id == null) {
                conn.query("SELECT productos, id_venta, factura_id, factura.id_referencial, tipo_pago, estado, impuestos FROM ventas INNER JOIN(factura) ON (ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado)",
                    (err, rows) => {
                        if (!err) {
                            view.webContents.send('list::ventas', rows);
                        }
                    });
            } else {
                conn.query(`SELECT productos, id_venta, factura_id, factura.id_referencial, total_bs, total_usd, tipo_pago, estado, impuestos FROM ventas
                INNER JOIN(factura) ON (ventas.factura_id = factura.id_factura) INNER JOIN(estado) ON(ventas.estado_id = estado.id_estado) WHERE id_venta = ?`, 
                id, (err, rows) => {
                    if(!err) {
                        view.webContents.send('list::ActualSale', rows);
                    }
                });
            }
            conn.end();
        },
        newSale: data => {
            const conn = db.connect();

            const precio_total_usd = data.precio_usd;
            const precio_total_bs = data.precio_bs;

            const productos = data.productos;
            const impuestos = data.impuestos;
            const tipo_pago = data.tipo_pago;

            conn.query("SELECT `AUTO_INCREMENT` AS total FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'principal_motor_ca' AND   TABLE_NAME   = 'factura';", (err, rows) => {
                if (!err) {
                    let id_ref;
                    let numb_ref;

                    numb_ref = Number(rows[0].total);
                    id_ref = `RF000${numb_ref}`;

                    // Factura

                    conn.query("INSERT INTO factura(id_referencial, total_bs, total_usd, estado_id, fecha_creacion) VALUES(?, ?, ?, ?, NOW())",
                        [id_ref, precio_total_bs, precio_total_usd, '1'],
                        (err, rows) => {
                            if (err) {
                                error.errorTax();
                                console.log(err);
                            } else {

                                const productSerialize = serialize(productos);
                                const billSerialize = serialize(impuestos)

                                conn.query("INSERT INTO ventas(productos, factura_id, impuestos, estado_id, tipo_pago, fecha_creacion) VALUES(?, ?, ?, ?, ?, NOW())",
                                    [productSerialize, numb_ref, billSerialize, '1', tipo_pago],
                                    (err, rows) => {
                                        if (!err) {
                                            success.successTax();

                                            // Restamos del inventario

                                            productos.forEach(x => {
                                                conn.query("SELECT cantidad FROM inventario WHERE id_inventario = ?", x.id_producto, (err, rows) => {
                                                    if (!err) {

                                                        cantidad = rows[0].cantidad - x.cantidad;

                                                        conn.query("UPDATE inventario SET cantidad = ? WHERE id_inventario = ?", [cantidad, x.id_producto], err => {
                                                            if (err) {
                                                                error.errorInventory();
                                                                console.log(err);
                                                            } else {
                                                                bitacora.insertBitacora(1, 'Se ha registrado una venta', 'registro', 'ventas');
                                                            }
                                                        });

                                                    } else {
                                                        
                                                        console.log(err);
                                                        dialog.showErrorBox('Error en el modulo de ventas', err);
                                                    }
                                                });
                                            });

                                        } else {
                                            error.errorNewSale();
                                            console.log(err);
                                        }
                                    });
                            }
                        });

                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en el modulo de ventas', err);
                }
            });
        }
    };
};
module.exports = {
    Ventas
};