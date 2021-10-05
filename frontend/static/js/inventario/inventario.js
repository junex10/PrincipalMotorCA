const { ipcRenderer } = require('electron');

ipcRenderer.send('require::listProductos');

ipcRenderer.on('list::inventario', (err, item) => {
    const bodyTableDisp = $('#productos_disponibles_body');
    const bodyTableNoDisp = $('#productos_no_disponibles_body');
    bodyTableDisp.html('');
    bodyTableNoDisp.html('');
    console.log(item);
    item.map(value => {
        tmp = '';
        tmp += '<tr>';
        tmp += `<td class="texto_black">${value.nombre_producto}</td>`
        tmp += `<td class="texto_black">${value.precio_bs}</td>`
        tmp += `<td class="texto_black">${value.precio_usd}</td>`
        tmp += `<td class="texto_black">${value.tipo_producto}</td>`
        tmp += `<td class="texto_black">${value.marca}</td>`
        tmp += `<td class="texto_black">${value.distribuidor}</td>`
        tmp += `<td class="texto_black">${value.cantidad}</td>`
        tmp += `<td onclick='modify(this)' id='producto_${value.id_inventario}' style='cursor:pointer' class="texto_black modify"><i class='fas fa-edit'></i></td>`
        tmp += '</tr>';

        if (value.estado == 'activo') {

            bodyTableDisp.append(tmp);

        } else if (value.estado == 'inactivo') {

            bodyTableNoDisp.append(tmp);
        }
    });
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

const modify = e => {
    const id = e.id.match('producto_(\.*[A-Za-z0-9])')[1];

    ipcRenderer.send('open::modifyInventory', {id: id})
};
$('#nuevo_producto').click(function () {
    ipcRenderer.send('open::new_product');
});