const { ErrorNotification, SuccessNotification } = require('./../helpers/notification');
const db = require('./../modal/database').connectDb();
const path = require('path');
const dialog = require('electron').dialog;

const success = SuccessNotification();
const error = ErrorNotification();

const Inventario = () => {
    return {

        listProducts: (view, id = null) => {
            const conn = db.connect();
            if (id == null) {

                conn.query("SELECT id_inventario, estado, nombre_producto, cantidad, tipo_producto, marca, distribuidor, precio_usd, precio_bs FROM inventario INNER JOIN(estado) ON(inventario.estado_id = estado.id_estado) INNER JOIN(marca) ON(inventario.marca_id = marca.id_marca) INNER JOIN(tipo_producto) ON(inventario.tipo_producto_id = tipo_producto.id_tipo_producto) INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor)", 
                (err, rows) => {
                    if(!err) {
                        view.webContents.send('list::inventario', rows);
                    }
                });
            } else {
                conn.query("SELECT id_inventario, estado, id_estado, id_tipo_producto, id_marca, nombre_producto, cantidad, tipo_producto, marca, distribuidor, precio_usd, precio_bs FROM inventario INNER JOIN(estado) ON(inventario.estado_id = estado.id_estado) INNER JOIN(marca) ON(inventario.marca_id = marca.id_marca) INNER JOIN(tipo_producto) ON(inventario.tipo_producto_id = tipo_producto.id_tipo_producto) INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor) WHERE id_inventario = ?",
                [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('listActualProduct', rows);
                    } else {
                        console.log(err);
                    }
                });
            }
            conn.end();
        },
        newProduct: data => {
            const conn = db.connect();
            
            conn.query("INSERT INTO inventario(nombre_producto, tipo_producto_id, marca_id, estado_id, cantidad, precio_usd, precio_bs, codigo_producto, fecha_creacion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW())", 
            [data.producto, data.tipo_producto, data.marca, data.estado, data.cantidad, data.precio_usd, data.precio_bs, data.codigo_producto],
            err => {
                if(!err) {
                    success.success('Registrado!', 'Nuevo producto registrado en el inventario!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en agregar un producto', err);
                }
            });

            conn.end();
        },
        // Modificar

        updateProduct: data => {
            const conn = db.connect();

            conn.query(`UPDATE inventario SET nombre_producto = ?, tipo_producto_id = ?, marca_id = ?, estado_id = ? WHERE id_inventario = ?`, [data.producto, data.tipo_producto, data.marca, data.estado, data.id_inventario], err => {
                if(err) {
                    dialog.showErrorBox('Error en modificar inventario', err);
                } else {
                    success.success('Actualizado!', 'Producto del inventario se ha actualizado sastifactoriamente');
                }
            });

            conn.end();
        },
        // Inventario este mes, llenado

        inventoryMontly: (view, month, year) => {
            const conn = db.connect();

            conn.query(`SELECT SUM(cantidad_comprada) AS cantidad_comprada, compra.tipo_pago, compra.precio_usd, compra.precio_bs, compra.fecha_creacion, 
            (SELECT nombre_producto FROM inventario WHERE compra.producto_id = inventario.id_inventario) AS nombre_producto, 
            producto_id, 
            id_compra FROM compra
            WHERE MONTH(compra.fecha_creacion) = ? AND YEAR(compra.fecha_creacion) = ? GROUP BY producto_id, fecha_creacion`, 
            [month, year], (err, rows) => {
                if(!err) {
                    view.webContents.send('listInventoryMonth', rows);
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en modulo de reportes', err);
                }
            });

            conn.end();
        }
    };
};

module.exports = {
    Inventario
};