const { ipcRenderer } = require('electron');

ipcRenderer.send('require::listSponsorAll');

ipcRenderer.on('listAllSponsor', (err, item) => {
    const dom = $('#distribuidor');
    dom.html('');
    tmp = '';

    item.forEach(value => {
        tmp += `<option value="${value.id_distribuidor}">${value.distribuidor}</option>`
    });
    dom.append(tmp);
});

$('#submit').on('click', function(){
    const marca = $('#marca').val();
    const distribuidor_id = $('#distribuidor').val();

    if (marca !== '' && distribuidor_id !== '') {
        ipcRenderer.send('new::branch', {
            distribuidor_id: distribuidor_id,
            marca: marca
        });
        
    }
});
    
