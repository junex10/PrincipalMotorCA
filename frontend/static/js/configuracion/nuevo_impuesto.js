const { ipcRenderer } = require('electron');

$('#submit').on('click', function(){
    const impuesto = $('#impuesto').val();
    const porcentaje = $('#porcentaje').val();

    if ((impuesto !== '') && (porcentaje !== '')) {
        ipcRenderer.send('new::bill', {
            impuesto: impuesto,
            porcentaje: porcentaje
        });
    }
});
    
