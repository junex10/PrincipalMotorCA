const { ipcRenderer } = require('electron');

$('#nuevo_item').click(function(){
    ipcRenderer.send('open::new_employer');
});

const dom_disp = $('#item_disponibles_body');
const dom_no_disp = $('#item_no_disponibles_body');

ipcRenderer.send('require::listAllEmployer');
const numberFormat = value => new Intl.NumberFormat().format(value);

ipcRenderer.on('listAllEmployer', (err, rows) => {
    dom_disp.html('');
    dom_no_disp.html('');

    let tmp_disp = '';
    let tmp_no_disp = '';

    rows.forEach(value => {
        let register = new Date(value.fecha_creacion);
        month = (register.getMonth()+1 < 10) ? `0${register.getMonth()+1}`: register.getMonth()+1;
        day = (register.getDate() < 10) ? `0${register.getDate()}` : register.getDate();
        if (value.estado == 'activo') {
            tmp_disp += '<tr>';
            tmp_disp += `<td>${value.usuario}</td>`;
            tmp_disp += `<td>${value.tipo_usuario}</td>`;
            tmp_disp += `<td>${value.numero_identificacion}</td>`;
            tmp_disp += `<td>${value.tipo_identificacion}</td>`;
            tmp_disp += `<td>${numberFormat(value.salario_bs)} Bs</td>`;
            tmp_disp += `<td>${numberFormat(value.salario_usd)} USD</td>`;
            tmp_disp += `<td>${day}/${month}/${register.getFullYear()}`;
            tmp_disp += `<td style='cursor:pointer' id='${value.id_usuario}' onclick='modify(${value.id_usuario})' class='texto_black modify'><i class='fas fa-edit'></i></td>`;
            tmp_disp += '</tr>';
        } else if (value.estado == 'inactivo') {
            tmp_no_disp += '<tr>';
            tmp_no_disp += `<td>${value.usuario}</td>`;
            tmp_no_disp += `<td>${value.tipo_usuario}</td>`;
            tmp_no_disp += `<td>${value.numero_identificacion}</td>`;
            tmp_no_disp += `<td>${value.tipo_identificacion}</td>`;
            tmp_no_disp += `<td>${numberFormat(value.salario_bs)} Bs</td>`;
            tmp_no_disp += `<td>${numberFormat(value.salario_usd)} USD</td>`;
            tmp_no_disp += `<td>${day}/${month}/${register.getFullYear()}`;
            tmp_no_disp += `<td style='cursor:pointer' id='${value.id_usuario}' onclick='modify(${value.id_usuario})' class='texto_black modify'><i class='fas fa-edit'></i></td>`;
            tmp_no_disp += '</tr>';
        }
    });

    dom_disp.append(tmp_disp);
    dom_no_disp.append(tmp_no_disp);
});
const changeTable = e => {
    const id = e.id;
    const key = id.match('item_(\.*[A-Za-z0-9])')[1];

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