const { ipcRenderer } = require('electron');

$('#submit').on('click', function(){
    const tipo_producto = $('#tipo_producto').val();

    if (tipo_producto !== '') {
        ipcRenderer.send('new::TypeProduct', {
            tipo_producto: tipo_producto
        });
    }
});
    
