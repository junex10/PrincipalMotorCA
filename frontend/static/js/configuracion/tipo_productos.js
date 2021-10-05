const { ipcRenderer } = require('electron');

$('#nueva_tipo_producto').click(function(){
    ipcRenderer.send('open::new_type_product');
});

ipcRenderer.send('require::listAllTypeProduct');

const loadListTable = (data, id) => {
    tmp = '';
    tmp += '<tr>';
    tmp += `<td class='texto_black'>${data}</td>`;
    tmp += `<td style='cursor:pointer' onclick='modify(${id})' id='${id}' class='texto_black modify'><i class='fas fa-edit'></i></td>`;
    tmp += '</tr>';

    return tmp;
};

ipcRenderer.on('listAllTypeProduct', (err, rows) => {
    const dom_disp = $('#productos_disponibles_body');
    const dom_no_disp = $('#productos_no_disponibles_body');

    dom_disp.html('');
    dom_no_disp.html('');

    let tmp_disp;
    let tmp_no_disp;

    rows.forEach(value => {
        if (value.estado == 'activo') {
            tmp_disp += loadListTable(value.tipo_producto, `${value.id_tipo_producto}`);
        } else if (value.estado == 'inactivo') {
            tmp_no_disp += loadListTable(value.tipo_producto, `${value.id_tipo_producto}`);
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
    ipcRenderer.send('open::modifyEmployer', {id: id});
};