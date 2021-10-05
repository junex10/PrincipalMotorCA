const db = require('./../modal/database').connectDb();
const { dialog } = require('electron');

const bitacora = require('./bitacora').Bitacora();

const { ErrorNotification, SuccessNotification } = require('./../helpers/notification');

const error = ErrorNotification();
const success = SuccessNotification();

const Compras = () => {
    return {
        getProductsYear: (view, year) => {
            const conn = db.connect();

            conn.query(`SELECT id_inventario, id_compra, nombre_producto, precio_usd, precio_bs, cantidad, cantidad_comprada, compra.fecha_creacion 
            FROM compra INNER JOIN inventario ON (compra.producto_id = inventario.id_inventario) WHERE YEAR(compra.fecha_creacion) = ?`, [year], (err, rows) => {
                if (!err) {
                    view.webContents.send("listBuyActualYear", rows);
                } else {
                    dialog.showErrorBox('Error en middleware compra', err);
                }
            });
            conn.end();
        },
        newBuy: data => {
            const conn = db.connect();

            var p = 0;
            var z = 0;

            data.productos.map(x => {
                conn.query(`INSERT INTO compra(producto_id, cantidad_comprada, tipo_pago, precio_usd, precio_bs, fecha_creacion) VALUES(?, ?, ?, ?, ?, NOW())`,
                    [x.id_producto, x.cantidad, data.tipo_pago, x.precio_usd, x.precio_bs],
                    err => {
                        
                        if (err) {
                            z = 1;
                            if (z == 1) {
                                console.log(err);
                                dialog.showErrorBox("Error al registrar la compra", err);
                            }
                        } else {

                            conn.query(`SELECT cantidad FROM inventario WHERE id_inventario = ?`, [x.id_producto], (err, rows) => {
                                if (!err) {

                                    const add = rows[0].cantidad + x.cantidad;

                                    conn.query(`UPDATE inventario SET cantidad = ? WHERE id_inventario = ?`, [add, x.id_producto], (err, data) => {
                                        
                                        if (err) {
                                            console.log(err);
                                            dialog.showErrorBox('Error en la actualizacion de cantidad', err);
                                        } else {
                                            if (p != 1) {
                                                bitacora.insertBitacora(1, 'Se ha hecho una compra correctamente', 'registro', 'compras');
                                                success.success('Compras realizadas', 'Se proceso correctamente las compras');
                                            }
                                            p = 1;
                                        }
                                    });
                                } else {
                                    console.log(err);
                                }
                            });

                        }
                    });
            });
        },
        // List buying on this week
        listBuyingWeek: view => {
            const conn = db.connect();

            conn.query(`SELECT id_compra, producto_id, cantidad_comprada, compra.precio_usd, compra.precio_bs, compra.fecha_creacion, nombre_producto, compra.tipo_pago 
            FROM compra INNER JOIN inventario ON(inventario.id_inventario = compra.producto_id) WHERE YEARWEEK(compra.fecha_creacion, 1) = YEARWEEK(CURDATE(), 1)`,
                (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllBuyingWeek', rows)
                    } else {
                        dialog.showErrorBox('Error en el modulo de compras (Semanal)', err);
                    }
                });

            conn.end();
        },

        // Montly

        listBuyingMontly: (view, month, year) => {
            const conn = db.connect();

            conn.query(`SELECT id_compra, producto_id, cantidad_comprada, compra.precio_usd, compra.precio_bs, compra.fecha_creacion, nombre_producto, compra.tipo_pago 
            FROM compra INNER JOIN inventario ON(inventario.id_inventario = compra.producto_id) WHERE MONTH(compra.fecha_creacion) = ? AND YEAR(compra.fecha_creacion) = ?`,
                [month, year],
                (err, rows) => !err ? view.webContents.send('listAllBuyingMontly', rows) : dialog.showErrorBox('Error en el modulo de compras (Mensual)', err)
            );

            conn.end();
        },

        // Year

        listBuyingYear: (view, year) => {
            const conn = db.connect();

            conn.query(`SELECT id_compra, producto_id, cantidad_comprada, compra.precio_usd, compra.precio_bs, compra.fecha_creacion, nombre_producto, compra.tipo_pago 
            FROM compra INNER JOIN inventario ON(inventario.id_inventario = compra.producto_id) WHERE YEAR(compra.fecha_creacion) = ?`,
                [year],
                (err, rows) => !err ? view.webContents.send('listAllBuyingYear', rows) : dialog.showErrorBox('Error en el modulo de compras (Anual)', err)
            );

            conn.end();
        }
    };
};

module.exports = {
    Compras
};