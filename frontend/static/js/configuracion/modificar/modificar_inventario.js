const { ipcRenderer } = require('electron')

var id_estado;
var id_marca;
var id_tipo_producto;
var id_product;

const productoDom = $('#nombre_producto');
const estadoDOM = $('#estado');
const tipoProductoDOM = $('#tipo_producto');
const marcaDOM = $('#marca');

ipcRenderer.send('require::actualProduct');

ipcRenderer.on('listActualProduct', (err, item) => {

    const datos = item[0];
    productoDom[0].value = datos.nombre_producto;

    id_product = item[0].id_inventario;

    estadoDOM.html($('<option />', {
        text: datos.estado,
        value: datos.id_estado
    }));

    id_estado = datos.id_estado;
    id_tipo_producto = datos.id_tipo_producto;
    id_marca = datos.id_marca;

    tipoProductoDOM.html($('<option />', {
        text: datos.tipo_producto,
        value: datos.id_tipo_producto
    }))

    marcaDOM.html($('<option />', {
        text: datos.marca,
        value: datos.id_marca
    }))

    ipcRenderer.send('require::StatusProduct');

    ipcRenderer.on('listAllStatus', (err, rows) => {
        rows.forEach(x => {
            if (x.id_estado != id_estado) {
                estadoDOM.append($('<option />', {
                    text: x.estado,
                    value: x.id_estado
                }));
            }
        });
    })

    ipcRenderer.send('require::TypeProduct');

    ipcRenderer.on('listAllTypeProduct', (err, rows) => {
        rows.forEach(x => {
            if(x.id_tipo_producto != id_tipo_producto) {
                tipoProductoDOM.append($('<option />', {
                    text: x.tipo_producto,
                    value: x.id_tipo_producto
                }))
            }
        });
    })

    ipcRenderer.send('require::Branch');

    ipcRenderer.on('listAllBranch', (err, rows) => {
        rows.forEach(x => {
            if(x.id_marca != id_marca) {
                marcaDOM.append($('<option />', {
                    text: x.marca,
                    value: x.id_marca
                }))
            }
        });
    });

});

$('#submit').on('click', function(){

    if ((productoDom.val() !== '') && (estadoDOM.val() !== '') && (tipoProductoDOM.val() !== '') && (marcaDOM.val() !== '')) {
        const data = {
            producto: productoDom.val(),
            estado: estadoDOM.val(),
            tipo_producto: tipoProductoDOM.val(),
            marca: marcaDOM.val(),
            id_inventario: id_product
        };
        console.log(data);

        ipcRenderer.send('modify::Product', data);
    }
})