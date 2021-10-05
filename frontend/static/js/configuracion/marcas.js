const { ipcRenderer } = require('electron');

ipcRenderer.send('require::listAllBranch');

const loadListTable = (marca, distribuidor, id) => {
    tmp = '';
    tmp += '<tr>';
    tmp += `<td class='texto_black'>${marca}</td>`;
    tmp += `<td class='texto_black'>${distribuidor}</td>`;
    tmp += `<td style='cursor:pointer' onclick='modify(${id})' id='marca_${id}' class='texto_black modify'><i class='fas fa-edit'></i></td>`;
    tmp += '</tr>';

    return tmp;
};

ipcRenderer.on('listAllBranch', (err, rows) => {
    const dom_disp = $('#productos_disponibles_body');
    const dom_no_disp = $('#productos_no_disponibles_body');

    dom_disp.html('');
    dom_no_disp.html('');

    let tmp_disp;
    let tmp_no_disp;

    rows.forEach(value => {
        if (value.estado == 'activo') {
            tmp_disp += loadListTable(value.marca, value.distribuidor, value.id_marca);
        } else if (value.estado == 'inactivo') {
            tmp_no_disp += loadListTable(value.marca, value.distribuidor, value.id_marca);
        }
    });
    dom_disp.append(tmp_disp);
    dom_no_disp.append(tmp_no_disp);
});

$('#nueva_marca').click(function () {
    ipcRenderer.send('open::new_branch');
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
    ipcRenderer.send('open::modifyBranch', {id: id});
};