const db = require('./../modal/database').connectDb();
const { ErrorNotification, SuccessNotification } = require('./../helpers/notification');
const dialog = require('electron').dialog;
const path = require('path');

const { Bitacora } = require('./bitacora');

const error = ErrorNotification();
const success = SuccessNotification();

const Configuracion = () => {
    return {

        // Select

        selectStatus: (view, id = null) => {
            const conn = db.connect();

            if (id == null) {
                conn.query("SELECT * FROM estado", (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllStatus', rows);
                    }
                });
            } else {
                conn.query("SELECT * FROM estado WHERE id_estado = ?", [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualStatus', rows);
                    }
                });
            }

            conn.end();
        },
        // Distribuidor

        selectSponsor: (view, id = null) => {
            const conn = db.connect();

            if (id == null) {
                conn.query("SELECT * FROM distribuidor INNER JOIN(estado) ON(distribuidor.estado_id = estado.id_estado)", (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllSponsor', rows);
                    }
                });
            } else {
                conn.query("SELECT * FROM distribuidor INNER JOIN(estado) ON(distribuidor.estado_id = estado.id_estado) WHERE id_distribuidor = ?", [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualSponsor', rows);
                    }
                });
            }
            conn.end();

        },
        // Marcas
        selectBranch: (view, id = null, status = null) => {
            const conn = db.connect();

            if (id == null) {
                if (status == null) {
                    conn.query("SELECT id_marca, marca, marca.estado_id, distribuidor, distribuidor.id_distribuidor, estado FROM marca INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor) INNER JOIN(estado) ON(marca.estado_id = estado.id_estado)", (err, rows) => {
                        if (!err) {
                            view.webContents.send('listAllBranch', rows);
                        }
                    });
                } else {
                    conn.query("SELECT id_marca, marca, marca.estado_id, distribuidor, distribuidor.id_distribuidor, estado FROM marca INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor) INNER JOIN(estado) ON(marca.estado_id = estado.id_estado) WHERE estado.estado = ?",
                        [status],
                        (err, rows) => {
                            if (!err) {
                                view.webContents.send('listAllBranchCondition', rows);
                            }
                        });
                }
            } else {
                if (status == null) {
                    conn.query("SELECT id_marca, marca, marca.estado_id, distribuidor, distribuidor.id_distribuidor, estado FROM marca INNER JOIN(distribuidor) ON(marca.distribuidor_id = distribuidor.id_distribuidor) INNER JOIN(estado) ON(marca.estado_id = estado.id_estado) WHERE id_marca = ?",
                        [id],
                        (err, rows) => {
                            if (!err) {
                                view.webContents.send('dataActualBranch', rows);
                            }
                        });
                }
            }
            conn.end();
        },
        // Tipo de producto
        selectTypeProduct: (view, id = null, status = null) => {
            const conn = db.connect();

            if (id == null) {
                if (status == null) {
                    conn.query("SELECT * FROM tipo_producto INNER JOIN(estado) ON(tipo_producto.estado_id = estado.id_estado)", (err, rows) => {
                        if (!err) {
                            view.webContents.send('listAllTypeProduct', rows);
                        }
                    });
                } else {
                    conn.query("SELECT * FROM tipo_producto INNER JOIN(estado) ON(tipo_producto.estado_id = estado.id_estado) WHERE estado = ?", [status], (err, rows) => {
                        if (!err) {
                            view.webContents.send('listAllTypeProductCondition', rows);
                        } else {
                            console.log(err);
                            dialog.showErrorBox('Error en middleware configuracion (Tipo de producto)', err);
                        }
                    });
                }
            } else {
                if (status == null) {
                    conn.query("SELECT * FROM tipo_producto INNER JOIN(estado) ON(tipo_producto.estado_id = estado.id_estado)", [id], (err, rows) => {
                        if (!err) {
                            view.webContents.send('dataActualTypeProduct', rows);
                        }
                    });
                }
            }

            conn.end();
        },
        // Impuesto
        selectBill: (view, id = null) => {
            const conn = db.connect();

            if (id == null) {
                conn.query("SELECT * FROM impuesto INNER JOIN(estado) ON(impuesto.estado_id = estado.id_estado)", (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllBill', rows);
                    }
                });
            } else {
                conn.query("SELECT * FROM impuesto INNER JOIN(estado) ON(impuesto.estado_id = estado.id_estado) WHERE id_impuesto = ?", [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualBill', rows);
                    }
                });
            }

            conn.end();
        },

        // Insert

        // Distribuidor

        insertSponsor: data => {
            const conn = db.connect();

            conn.query("INSERT INTO DISTRIBUIDOR(distribuidor, estado_id, fecha_creacion) VALUES(?, ?, NOW())", [data.distribuidor, '1', '1'], (err, rows) => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado un distribuidor nuevo', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado al distribuidor!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Distribuidor)', err);
                }
            });
            conn.end();

        },

        // Tipo de producto

        inserTypeProduct: data => {
            const conn = db.connect();

            conn.query("INSERT INTO TIPO_PRODUCTO(tipo_producto, estado_id, fecha_creacion) VALUES(?, ?, NOW())", [data.tipo_producto, '1'], (err, rows) => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado un tipo de producto nuevo', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado un nuevo tipo de producto!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Tipo de producto)', err);
                }
            });
            conn.end();
        },

        // Marcas

        insertBranch: data => {
            const conn = db.connect();

            conn.query("INSERT INTO marca(marca, distribuidor_id, estado_id, fecha_creacion) VALUES(?, ?, ?, NOW())", [data.marca, data.distribuidor_id, '1'], (err, rows) => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado una nueva marca', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado una nueva marca!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Marcas)', err);
                }
            });
            conn.end();
        },

        // Impuestos

        insertBill: data => {
            const conn = db.connect();

            conn.query("INSERT INTO impuesto(impuesto, estado_id, porcentaje, fecha_creacion) VALUES(?, ?, ?, NOW())", [data.impuesto, '1', data.porcentaje], (err, rows) => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado un nuevo impuesto', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado un nuevo impuesto!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Impuestos)', err);
                }
            });
            conn.end();
        },

        // Modify

        // Distribuidor
        updateSponsor: (id, data) => {
            const conn = db.connect();
            conn.query("UPDATE distribuidor SET distribuidor = ?, estado_id = ?, fecha_modificacion = NOW() WHERE id_distribuidor = ?",
                [data.distribuidor, data.estado_id, id],
                (err, rows) => {
                    if (!err) {
                        // Bitacora

                        Bitacora().insertBitacora(1, 'Se ha actualizado un distribuidor', 'actualizacion', 'configuracion');
                        success.success('Actualizado!', 'Se ha actualizado un nuevo distribuidor!');
                    } else {
                        console.log(err);
                        dialog.showErrorBox('Error en middleware configuracion (Distribuidor)', err);
                    }
                });
            conn.end();
        },
        // Marcas
        updateBranch: (id, data) => {
            const conn = db.connect();
            conn.query("UPDATE marca SET marca = ?, estado_id = ?, distribuidor_id = ?, fecha_modificacion = NOW() WHERE id_marca = ?",
                [data.marca, data.estado_id, data.distribuidor_id, id],
                (err, rows) => {
                    if (!err) {
                        // Bitacora

                        Bitacora().insertBitacora(1, 'Se ha actualizado una marca', 'actualizacion', 'configuracion');

                        success.success('Actualizado!', 'Se ha actualizado una marca!');
                    } else {
                        console.log(err);
                        dialog.showErrorBox('Error en middleware configuracion (Marcas)', err);
                    }
                });
            conn.end();
        },
        // Tipo de productos
        updateTypeProduct: (id, data) => {
            const conn = db.connect();
            conn.query("UPDATE tipo_producto SET tipo_producto = ?, estado_id = ?, fecha_modificacion = NOW() WHERE id_tipo_producto = ?",
                [data.tipo_producto, data.estado_id, id], (err, rows) => {
                    if (!err) {
                        // Bitacora

                        Bitacora().insertBitacora(1, 'Se ha actualizado un tipo de producto', 'actualizacion', 'configuracion');

                        success.success('Actualizado!', 'Se ha actualizado un tipo de producto!');
                    } else {
                        console.log(err);
                        dialog.showErrorBox('Error en middleware configuracion (Tipo de producto)', err);
                    }
                });
            conn.end();
        },

        // Impuestos
        updateBill: (id, data) => {
            const conn = db.connect();
            conn.query("UPDATE impuesto SET porcentaje = ?, impuesto = ?, estado_id = ?, fecha_modificacion = NOW() WHERE id_impuesto = ?",
                [data.porcentaje, data.impuesto, data.estado_id, id], (err, rows) => {
                    if (!err) {
                        // Bitacora

                        Bitacora().insertBitacora(1, 'Se ha actualizado un impuesto', 'actualizacion', 'configuracion');

                        success.success('Actualizado!', 'Se ha actualizado un impuesto!');
                    } else {
                        console.log(err);
                        dialog.showErrorBox('Error en middleware configuracion (Impuesto)', err);
                    }
                });
            conn.end();
        },

        // Empleados

        selectEmployer: (view, id = null) => { 
            const conn = db.connect();
            if (id == null) {
                conn.query(`SELECT 
                    id_usuario,
                    id_rol,
                    estado,
                    id_estado,
                    rol,
                    usuario,
                    salario_bs,
                    salario_usd,
                    usuarios.fecha_creacion,
                    numero_identificacion,
                    tipo_identificacion,
                    tipo_usuario
                    FROM usuarios 
                    INNER JOIN(estado) ON(usuarios.estado_id = estado.id_estado)
                    INNER JOIN(roles) ON(usuarios.rol_id = roles.id_rol)
                    WHERE tipo_usuario = 'empleado'`, (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllEmployer', rows);
                    }
                });
            } else {
                conn.query(`SELECT 
                    id_usuario,
                    id_rol,
                    estado,
                    id_estado,
                    rol,
                    usuario,
                    salario_bs,
                    salario_usd,
                    usuarios.fecha_creacion,
                    numero_identificacion,
                    tipo_identificacion,
                    tipo_usuario
                    FROM usuarios 
                    INNER JOIN(estado) ON(usuarios.estado_id = estado.id_estado)
                    INNER JOIN(roles) ON(usuarios.rol_id = roles.id_rol)
                    WHERE id_usuario = ? AND tipo_usuario = 'empleado'`, [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualEmployer', rows);
                    }
                });
            }
            conn.end();
        },
        insertEmployer: data => { 
            const conn = db.connect();
            conn.query(`INSERT INTO usuarios(salario_bs, salario_usd, usuario, numero_identificacion, tipo_identificacion, rol_id, fecha_creacion, tipo_usuario) 
            VALUES(?, ?, ?, ?, ?, ?, NOW(), 'empleado')`, [data.salario_bs, data.salario_usd, data.usuario, data.identificacion, data.tipo_identificacion, data.tipo_rol], err => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado un nuevo empleado', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado un nuevo empleado!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Empleados)', err);
                }
            });
            conn.end();
        },
        updateEmployer: data => { 
            const conn = db.connect();
            conn.query(`UPDATE usuarios SET salario_bs = ?, salario_usd = ?, usuario = ?, numero_identificacion = ?, estado_id = ?, rol_id = ? WHERE id_usuario = ?`, 
            [data.salario_bs, data.salario_usd, data.usuario, data.numero_identificacion, data.estado_id, data.rol_id, data.id_usuario], err => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha modificado a un empleado', 'actualizacion', 'configuracion');

                    success.success('Modificado!', 'Se ha modificado a un empleado!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Empleados)', err);
                }
            });
            conn.end();
        },

        // Roles

        selectRoles: (view, id = null) => {
            const conn = db.connect();
            if (id == null) {
                conn.query(`SELECT * FROM roles`, (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllRoles', rows);
                    }
                });
            } else {
                conn.query(`SELECT * FROM roles WHERE id_rol = ?`, [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualRol', rows);
                    }
                });
            }
            conn.end();
        },
        // deudores

        selectDeudores: (view, id = null) => {
            const conn = db.connect();
            if (id == null) {
                conn.query(`SELECT
                    id_usuario,
                    id_deudor,
                    usuario,
                    numero_identificacion,
                    tipo_identificacion,
                    deudores.fecha_registro,
                    deudores.estado_id,
                    descripcion,
                    estado,
                    deuda_bs,
                    deuda_usd,
                    tipo_usuario
                    FROM deudores 
                    INNER JOIN(usuarios) ON(deudores.usuario_id = usuarios.id_usuario)
                    INNER JOIN(estado) ON(deudores.estado_id = estado.id_estado)
                    WHERE tipo_usuario != 'admin'
                    `, (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllDeudores', rows);
                    }
                });
            } else {
                conn.query(`SELECT 
                id_usuario,
                id_deudor,
                usuario,
                numero_identificacion,
                tipo_identificacion,
                deudores.fecha_registro,
                deudores.estado_id,
                descripcion,
                estado,
                deuda_bs,
                deuda_usd,
                tipo_usuario
                FROM deudores 
                INNER JOIN(usuarios) ON(deudores.usuario_id = usuarios.id_usuario)
                INNER JOIN(estado) ON(deudores.estado_id = estado.id_estado) WHERE tipo_usuario != 'admin' AND id_deudor = ?`, [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualDeudor', rows);
                    }
                });
            }
            conn.end();
        },
        selectByUserId: (view, userId) => {
            const conn = db.connect();
            conn.query(`
                SELECT * FROM deudores WHERE usuario_id = ? AND estado_id = '1'
            `, userId, (err, rows) => {
                if (!err) {
                    view.webContents.send('dataAllActualDeudor', rows);
                }
            });
            conn.end();
        },
        insertDeudor: data => { 
            const conn = db.connect();
            conn.query(`INSERT INTO deudores(usuario_id, deuda_bs, deuda_usd, descripcion, fecha_registro) VALUES(?, ?, ?, ?, NOW())`, [data.id_usuario, data.deuda_bs, data.deuda_usd, data.descripcion], err => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha agregado un nuevo deudor', 'registro', 'configuracion');

                    success.success('Registrado!', 'Se ha registrado un nuevo deudor!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Deudores)', err);
                }
            });
            conn.end();
        },
        updateDeudor: data => { 
            const conn = db.connect();
            conn.query(`UPDATE deudores SET descripcion = ?, deuda_bs = ?, deuda_usd = ?, usuario_id = ?, estado_id = ? WHERE id_deudor = ?`, 
            [data.descripcion, data.deuda_bs, data.deuda_usd, data.usuario, data.estado_id, data.id_deudor], err => {
                if (!err) {
                    // Bitacora

                    Bitacora().insertBitacora(1, 'Se ha modificado a un deudor', 'actualizacion', 'configuracion');

                    success.success('Modificado!', 'Se ha modificado a un deudor!');
                } else {
                    console.log(err);
                    dialog.showErrorBox('Error en middleware configuracion (Deudores)', err);
                }
            });
            conn.end();
        },
        // Usuarios

        selectUser: (view, id = null) => {
            const conn = db.connect();
            if (id == null) {
                conn.query(`SELECT
                    usuario,
                    tipo_usuario,
                    numero_identificacion,
                    tipo_identificacion,
                    usuarios.fecha_creacion,
                    estado_id,
                    estado,
                    rol,
                    rol_id,
                    id_usuario
                    FROM usuarios
                    INNER JOIN(estado) ON(usuarios.estado_id = estado.id_estado)
                    INNER JOIN(roles) ON(usuarios.rol_id = roles.id_rol)
                    WHERE tipo_usuario != 'admin'
                `, (err, rows) => {
                    if (!err) {
                        view.webContents.send('listAllUsers', rows);
                    }
                });
            } else {
                conn.query(`SELECT
                    usuario,
                    tipo_usuario,
                    numero_identificacion,
                    tipo_identificacion,
                    usuarios.fecha_creacion,
                    estado_id,
                    estado,
                    rol,
                    rol_id,
                    id_usuario
                    FROM usuarios
                    INNER JOIN(estado) ON(usuarios.estado_id = estado.id_estado)
                    INNER JOIN(roles) ON(usuarios.rol_id = roles.id_rol)
                    WHERE tipo_usuario != 'admin' AND id_usuario = ?
                `, [id], (err, rows) => {
                    if (!err) {
                        view.webContents.send('dataActualUser', rows);
                    }
                });
            }
            conn.end();
        }
    };
};

module.exports = {
    Configuracion
};