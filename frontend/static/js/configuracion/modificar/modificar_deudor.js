const { ipcRenderer } = require('electron');
var id_deudor;
var id_estado;
var id_usuario;

const numberFormat = value => new Intl.NumberFormat().format(value);

ipcRenderer.send('require::actualDeudor');

ipcRenderer.on('dataActualDeudor', (err, item) => {
    item.forEach(value => {
        $('#usuario')[0].value = value.usuario;
        $('#descripcion')[0].value = value.descripcion;
        $('#deuda_bs')[0].value = value.deuda_bs;
        $('#deuda_usd')[0].value = value.deuda_usd;
        id_usuario = value.id_usuario;

        id_deudor = value.id_deudor;
        id_estado = value.estado_id;

        value.estado = value.estado == 'inactivo' ? 'Deuda saldada' : 'Debiente';

        $('#estado').html($('<option />', {
            text: value.estado,
            value: id_estado
        }));

        $('#deuda').html('');
    });
    ipcRenderer.send('require::allDeudorActive', {id: id_usuario});
    ipcRenderer.on('dataAllActualDeudor', (err, item) => {
        tmp = '';
        total_bs = 0;
        total_usd = 0;
        item.map(x => {
            total_bs += Number(x.deuda_bs);
            total_usd += Number(x.deuda_usd);
            tmp +=  `<tr>
            <td>${x.descripcion}</td>
            <td>${numberFormat(x.deuda_bs)} Bs</td>
            <td>${numberFormat(x.deuda_usd)} USD</td>
            </tr>`
        });
        $('#deuda').append(
            tmp
        );
        $('#bolivares').html(`${numberFormat(total_bs)}`);
        $('#dolares').html(`${numberFormat(total_usd)}`);
    });
});

ipcRenderer.send('require::listStatusDeudor');

ipcRenderer.on('listAllStatus', (err, item) => {
    const dom = $('#estado');
    tmp = '';
    item.forEach(value => {
        if (value.id_estado != id_estado) {
            value.estado = value.estado == 'inactivo' ? 'Deuda saldada' : 'Debiente';
            tmp += `<option value="${value.id_estado}">${value.estado}</option>`
        }
    });
    dom.append(tmp);
});

$('#submit').on('click', function(e){
    e.preventDefault()
    const descripcion = $('#descripcion').val();
    const deuda_bs = $('#deuda_bs').val();
    const deuda_usd = $('#deuda_usd').val();
    const estado = $('#estado').val();

    if (
        usuario != '' &&
        descripcion != '' &&
        deuda_bs != '' &&
        deuda_usd != ''
    ) {
       ipcRenderer.send('update::deudor', {
            usuario: id_usuario,
            descripcion: descripcion,
            deuda_bs: deuda_bs,
            deuda_usd: deuda_usd,
            id_deudor: id_deudor,
            estado_id: estado
        });
    }
});