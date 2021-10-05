const { ipcRenderer } = require('electron');

$('#nueva_compra').on('click', function() {
    ipcRenderer.send("open::new_buy");
});

const numberFormat = value => new Intl.NumberFormat().format(value);
const traductorTipoPago = tipo_pago => {

    let way;
    switch (tipo_pago) {
        case 'pago_movil':
            way = 'Pago móvil';
            break;
        case 'dolares':
            way = 'Dolares';
            break;
        case 'transferencia':
            way = 'Transferencia';
            break;
        case 'punto':
            way = 'Punto';
            break;
    }
    return way;
};

const changeTable = e => {
    const id = e.id;
    const key = id.match('compra_(\.*[A-Za-z0-9])')[1];

    const table = $('.table_venta');

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

ipcRenderer.send('require::listBuyWeek');
ipcRenderer.send('require::listBuyMontly');
ipcRenderer.send('require::listBuyYear');

ipcRenderer.on('listAllBuyingWeek', (err, item) => {
    const dom = $('#ventas_semana_body');

    dom.html('');

    tmp = '';
    item.forEach(x => {
        d = new Date(x.fecha_creacion);
        fecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

        tmp += '<tr>';
        tmp += `<td id='compra_${x.id_compra}'>${x.id_compra}</td>`;
        tmp += `<td class='texto_black' style='cursor:pointer' id='compra_${x.id_compra}'>${x.nombre_producto}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.cantidad_comprada)}</td>`;
        tmp += `<td class='texto_black'>${traductorTipoPago(x.tipo_pago)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_bs)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_usd)}</td>`;
        tmp += `<td class='texto_black'>${fecha}</td>`;
        tmp += '</tr>';
    })
    dom.append(tmp);
});

ipcRenderer.on('listAllBuyingMontly', (err, item) => {
    const dom = $('#ventas_mensual_body');

    dom.html('');

    tmp = '';
    item.forEach(x => {
        d = new Date(x.fecha_creacion);
        fecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

        tmp += '<tr>';
        tmp += `<td id='compra_${x.id_compra}'>${x.id_compra}</td>`;
        tmp += `<td class='texto_black' style='cursor:pointer' id='compra_${x.id_compra}'>${x.nombre_producto}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.cantidad_comprada)}</td>`;
        tmp += `<td class='texto_black'>${traductorTipoPago(x.tipo_pago)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_bs)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_usd)}</td>`;
        tmp += `<td class='texto_black'>${fecha}</td>`;
        tmp += '</tr>';
    })
    dom.append(tmp);
});

ipcRenderer.on('listAllBuyingYear', (err, item) => {
    const dom = $('#ventas_anual_body');
    dom.html('');

    tmp = '';
    item.forEach(x => {
        d = new Date(x.fecha_creacion);
        fecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

        tmp += '<tr>';
        tmp += `<td id='compra_${x.id_compra}'>${x.id_compra}</td>`;
        tmp += `<td class='texto_black' style='cursor:pointer' id='compra_${x.id_compra}'>${x.nombre_producto}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.cantidad_comprada)}</td>`;
        tmp += `<td class='texto_black'>${traductorTipoPago(x.tipo_pago)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_bs)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.precio_usd)}</td>`;
        tmp += `<td class='texto_black'>${fecha}</td>`;
        tmp += '</tr>';
    })
    dom.append(tmp);
});