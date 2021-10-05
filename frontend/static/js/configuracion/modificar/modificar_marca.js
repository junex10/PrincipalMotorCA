const { ipcRenderer } = require('electron');
var id_distribuidor;
var id_estado;
var id_marca;

ipcRenderer.send('require::actualBranch');

ipcRenderer.on('dataActualBranch', (err, item) => {
    item.forEach(value => {
        $('#marca')[0].value = value.marca;

        id_distribuidor = value.id_distribuidor;
        id_marca = value.id_marca;
        id_estado = value.estado_id;

        $('#distribuidor').html($('<option />', {
            text: value.distribuidor,
            value: id_distribuidor
        }));
        
        $('#estado').html($('<option />', {
            text: value.estado,
            value: id_estado
        }));
    });
});

ipcRenderer.send('require::listSponsorAllMod');

ipcRenderer.on('listAllSponsor', (err, item) => {
    const dom = $('#distribuidor');
    tmp = '';

    item.forEach(value => {
        if (value.id_distribuidor != id_distribuidor) {
            tmp += `<option value="${value.id_distribuidor}">${value.distribuidor}</option>`
        }
    });
    tmp += '<option value="-1">Crear distribuidor</option>';
    dom.append(tmp);
});
ipcRenderer.send('require::listStatusBranch');

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
    const marca = $('#marca').val();
    const distribuidor = $('#distribuidor').val();
    const estado = $('#estado').val();

    if ((distribuidor != '') && (marca != '') && (estado != '')) {
        ipcRenderer.send('update::branch', {
            marca: marca,
            distribuidor_id: distribuidor,
            estado_id: estado,
            id: id_marca
        });
    }
});