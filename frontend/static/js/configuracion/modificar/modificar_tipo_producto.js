const { ipcRenderer } = require('electron');
var id_estado;
var id_tipo_producto;

ipcRenderer.send('require::actualTypeProduct');

ipcRenderer.on('dataActualTypeProduct', (err, item) => {
    item.forEach(value => {
        $('#tipo_producto')[0].value = value.tipo_producto;
        id_estado = value.estado_id;
        id_tipo_producto = value.id_tipo_producto;

        $('#estado').html($('<option />', {
            text: value.estado,
            value: id_estado
        }));
    });
});

ipcRenderer.send('require::listStatusTypeProduct');

ipcRenderer.on('listAllStatus', (err, item) => {
    const dom = $('#estado');
    tmp = '';
    item.forEach(value => {
        if (value.id_estado != id_estado) {
            tmp += `<option value="${value.id_estado}">${value.estado}</option>`
        }
    });
    dom.append(tmp);
});

$('#submit').on('click', function(){
    const tipo_producto = $('#tipo_producto').val();
    const estado = $('#estado').val();

    if ((tipo_producto != '') && (estado != '')) {
        ipcRenderer.send('update::type_product', {
            tipo_producto: tipo_producto,
            estado_id: estado,
            id: id_tipo_producto
        });
    }
});