const { ipcRenderer } = require('electron');

ipcRenderer.send('require::listRoles');

ipcRenderer.on('listAllRoles', (err, rows) => {
    const dom = $('#tipo_rol');
    tmp = '';
    rows.forEach(value => {
        if (value.rol != 'Administrador') {
            tmp += `<option value="${value.id_rol}">${value.rol}</option>`;
        }
    });
    dom.append(tmp);
});

$('#submit').click(function() {
    const usuario = $('#usuario').val();
    const identificacion = $('#numero_identificacion').val();
    const tipo_identificacion = $('#tipo_identificacion').val();
    const tipo_rol = $('#tipo_rol').val();
    const salario_bs = $('#salario_bs').val();
    const salario_usd = $('#salario_usd').val();

    const data = {
        usuario: usuario,
        identificacion: identificacion,
        tipo_identificacion: tipo_identificacion,
        tipo_rol: tipo_rol,
        salario_bs: salario_bs,
        salario_usd: salario_usd
    };

    if (
        (usuario !== '') && 
        (identificacion !== '') && 
        (tipo_identificacion !== '') && 
        (tipo_rol !== '') &&
        (salario_bs !== '') &&
        (salario_usd !== '')
    ) {
        ipcRenderer.send('new::employer', data);
    }
});