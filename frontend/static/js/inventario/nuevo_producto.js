const {ipcRenderer, Notification} = require('electron');

ipcRenderer.send('require::listTypeProductsAllNewProduct');
ipcRenderer.send('require::listBranchAllNewProduct');

ipcRenderer.on('listAllBranchCondition', (err, item) => {
    const dom = $('#marca');

    item.forEach(val => {
        dom.append($('<option />', {
            text: val.marca,
            value: val.id_marca
        }))
    });
})
ipcRenderer.on('listAllTypeProductCondition', (err, item) => {
    const dom = $('#tipo_producto');

    item.forEach(val => {
        dom.append($('<option />', {
            text: val.tipo_producto,
            value: val.id_tipo_producto
        }))
    });
})

$('#submit').on('click', function(){
    const producto = $('#producto_nombre').val();
    const tipo_producto = $('#tipo_producto').val();
    const marca = $('#marca').val();
    const cantidad = $('#cantidad').val();
    const precio_bolivares = $('#precio_bolivares').val();
    const precio_dolares = $('#precio_dolares').val();
    const codigo_producto = $('#code_producto').val();

    if ((producto != '') && (tipo_producto != '') && (marca != '') && (cantidad != '') && (precio_bolivares != '') && (precio_dolares != '')) {
        ipcRenderer.send('new::product', {
            producto: producto,
            tipo_producto: tipo_producto,
            marca: marca,
            estado: '1',
            cantidad: cantidad,
            precio_bs: precio_bolivares,
            precio_usd: precio_dolares,
            codigo_producto: codigo_producto
        });
    }
});
