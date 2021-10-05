const { ipcRenderer } = require('electron');
var id_estado;
var id_distribuidor;

ipcRenderer.send('require::actualSponsor');

ipcRenderer.on('dataActualSponsor', (err, item) => {
    item.forEach(value => {
        $('#distribuidor')[0].value = value.distribuidor;
        id_estado = value.estado_id;
        id_distribuidor = value.id_distribuidor;

        $('#estado').html($('<option />', {
            text: value.estado,
            value: id_estado
        }));
    });
});

ipcRenderer.send('require::listStatusSponsor');

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
    const distribuidor = $('#distribuidor').val();
    const estado = $('#estado').val();

    if ((distribuidor != '') && (estado != '')) {
        ipcRenderer.send('update::sponsor', {
            distribuidor: distribuidor,
            estado_id: estado,
            id: id_distribuidor
        });
    }
});