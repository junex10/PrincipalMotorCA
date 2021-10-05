const { ipcRenderer, ipcMain } = require('electron');

const db = require('./../modal/database').connectDb(); 

const Filter = () => {
    return {
        productFilterByTypeProduct: (view, id) => {
            const conn = db.connect();
            conn.query("SELECT id_inventario, estado, nombre_producto, cantidad, tipo_producto, marca, distribuidor, precio_usd, precio_bs FROM inventario INNER JOIN(estado) ON(inventario.estado_id = estado.id_estado) INNER JOIN(marca) ON(inventario.marca_id = marca.id_marca) INNER JOIN(tipo_producto) ON(inventario.tipo_producto_id = tipo_producto.id_tipo_producto) INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor) WHERE tipo_producto_id = ?",
            [id],
            (err, rows) => {
                if(!err) {
                    view.webContents.send('listProductByTypeProduct', rows);
                } else {
                    console.log(err);
                }
            });
            conn.end();
        }
    }
}

module.exports = {
    Filter
}