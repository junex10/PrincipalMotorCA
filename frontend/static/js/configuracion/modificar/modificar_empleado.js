const { ipcRenderer } = require('electron');

ipcRenderer.send('require::actualEmployer');
let id_usuario;
const numberFormat = value => new Intl.NumberFormat().format(value);
ipcRenderer.on('dataActualEmployer', (err, item) => {
    const data = item[0];
    console.log(data)
    id_usuario = data.id_usuario;
    $('#usuario').val(data.usuario);
    $('#numero_identificacion').val(data.numero_identificacion);
    $('#tipo_rol').html('');
    $('#tipo_rol').append(
        `<option value='${data.id_rol}' name='${data.id_rol}'>${data.rol}</option>`
    );
    $('#estado').html('');
    $('#estado').append(
        `<option value='${data.id_estado}' name='${data.id_estado}'>${data.estado}</option>`
    );
    ipcRenderer.send('require::listStatusEmployer');
    ipcRenderer.send('require::listRolesEmployer');

    ipcRenderer.on('listAllRoles', (err, rows) => {
        rows.map(x => {
            if(x.id_rol != data.id_rol){
                $('#tipo_rol').append(
                    `<option value='${x.id_rol}' name='${x.id_rol}'>${x.rol}</option>`
                );
            }
        });
    });
    $('#salario_bs').val(numberFormat(data.salario_bs));
    $('#salario_usd').val(numberFormat(data.salario_usd));

    ipcRenderer.on('listAllStatus', (err, rows) => {
        rows.map(value => {
            if(value.id_estado != data.id_estado) {
                $('#estado').append(
                    `<option value='${value.id_estado}' name='${value.id_estado}'>${value.estado}</option>`
                );
            }
        });
    });
});
$('#submit').click(function(){
    const usuario = $('#usuario').val();
    const numero_identificacion = $('#numero_identificacion').val();
    const tipo_rol = $('#tipo_rol').val();
    const estado = $('#estado').val();
    const salario_bs = $('#salario_bs').val();
    const salario_usd = $('#salario_usd').val();

    if (
        (usuario != '') &&
        (numero_identificacion != '') &&
        (tipo_rol != '') &&
        (estado != '')
    ) {
        const data = {
            usuario: usuario,
            numero_identificacion: numero_identificacion,
            rol_id: tipo_rol,
            estado_id: estado,
            id_usuario: id_usuario,
            salario_bs: salario_bs,
            salario_usd: salario_usd
        }
        ipcRenderer.send('modify::employer', data);
    }
});