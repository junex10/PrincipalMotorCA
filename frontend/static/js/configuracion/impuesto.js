const { ipcRenderer } = require('electron');

$('#nuevo_impuesto').click(function(){
    ipcRenderer.send('open::new_bill');
});

ipcRenderer.send('require::listAllBill');

const loadListTable = (data, id) => {
    tmp = '';
    tmp += '<tr>';
    tmp += `<td class='texto_black'>${data}</td>`;
    tmp += `<td style='cursor:pointer' id='${id}' onclick='modify(${id})' class='texto_black modify'><i class='fas fa-edit'></i></td>`;
    tmp += '</tr>';

    return tmp;
};
ipcRenderer.on('listAllBill', (err, rows) => {
    const dom_disp = $('#impuesto_disponibles_body');
    const dom_no_disp = $('#impuesto_no_disponibles_body');

    dom_disp.html('');
    dom_no_disp.html('');

    let tmp_disp;
    let tmp_no_disp;

    rows.forEach(value => {
        if (value.estado == 'activo') {
            tmp_disp += loadListTable(value.impuesto, `${value.id_impuesto}`);
        } else if (value.estado == 'inactivo') {
            tmp_no_disp += loadListTable(value.impuesto, `${value.id_impuesto}`);
        }
    });
    dom_disp.append(tmp_disp);
    dom_no_disp.append(tmp_no_disp);
});

const changeTable = e => {
    const id = e.id;
    const key = id.match('producto_(\.*[A-Za-z0-9])')[1];

    const table = $('.table_producto');

    for (x = 0; x < table.length; x++) {
        const filter = table[x].id.match('table_(\.*[A-Za-z0-9])')[1];
        const domTable = table[x].classList;
        if (filter == key) {
            domTable.remove('hide');
        } else {
            domTable.remove('hide');
            domTable.add('hide');
        }
    }
};
const modify = id => {
    ipcRenderer.send('open::modifyBill', {id: id});
};