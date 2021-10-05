const { ipcRenderer } = require('electron');

ipcRenderer.send('require::listUserAllDeudor');

ipcRenderer.on('listAllUsers', (err, item) => {
    const dom = $('#usuario');
    dom.html('');
    tmp = '';

    item.forEach(value => {
        tmp += `<option value="${value.id_usuario}">${value.usuario}</option>`
    });
    dom.append(tmp);
});

$('#submit').on('click', function(e){
    const usuario = $('#usuario').val();
    const descripcion = $('#descripcion').val();
    const deuda_bs = $('#deuda_bs').val();
    const deuda_usd = $('#deuda_usd').val();

    if (
        usuario !== '' && 
        descripcion !== '' && 
        deuda_bs !== '' && 
        deuda_usd !== ''
    ) {
        ipcRenderer.send('new::deudor', {
            id_usuario: usuario,
            descripcion: descripcion,
            deuda_bs: deuda_bs,
            deuda_usd: deuda_usd
        });
    }
});
    
