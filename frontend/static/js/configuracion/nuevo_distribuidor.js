const { ipcRenderer } = require('electron');

$('#submit').on('click', function(){
    const distribuidor = $('#distribuidor').val();

    if (distribuidor !== '') {
        ipcRenderer.send('new::sponsor', {
            distribuidor: distribuidor
        });
        
    }
});
    
