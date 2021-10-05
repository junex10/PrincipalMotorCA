const { ipcRenderer } = require('electron');

var id_estado;
var id_impuesto;
var porcentaje;

ipcRenderer.send('require::actualBill');

ipcRenderer.on('dataActualBill', (err, item) => {

    item.forEach(value => {
        $('#impuesto')[0].value = value.impuesto;
        id_estado = value.estado_id;
        id_impuesto = value.id_impuesto;
        porcentaje = value.porcentaje;

        $('#estado').html($('<option />', {
            text: value.estado,
            value: id_estado
        }));

        $('#porcentaje')[0].value = porcentaje;
    });
    ipcRenderer.send('require::listStatusBill');

    ipcRenderer.on('listAllStatus', (err, item) => {
        const dom = $('#estado');
        tmp = '';
        item.forEach(value => {
            if (id_estado !== undefined && value.id_estado !== undefined) {
                if (value.id_estado != id_estado) {
                    tmp += `<option value="${value.id_estado}">${value.estado}</option>`
                }
            }
        });
        dom.append(tmp);
    });
});

$('#submit').on('click', function () {
    const impuesto = $('#impuesto').val();
    const estado = $('#estado').val();
    const porcentaje = $('#porcentaje').val();

    if ((impuesto != '') && (estado != '') && (porcentaje != '')) {
        ipcRenderer.send('update::bill', {
            impuesto: impuesto,
            estado_id: estado,
            porcentaje: porcentaje,
            id: id_impuesto
        });
        //console.log(porcentaje)
    }
    //console.log(impuesto, estado, porcentaje);
});