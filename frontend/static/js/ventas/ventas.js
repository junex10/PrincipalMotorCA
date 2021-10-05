// Ventas 

const { ipcRenderer } = require('electron');
const url = require('url');
const t = require('electron');
const path = require('path');
const fs = require('fs');

ipcRenderer.send('require::ventas');

const changeTable = e => {
    const id = e.id;
    const key = id.match('ventas_(\.*[A-Za-z0-9])')[1];

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

$('#nueva_venta').click(function () {
    ipcRenderer.send('open::new_sale');
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
// Ventas

ipcRenderer.send('require::listSaleToday');
ipcRenderer.send('require::listSaleWeek');
ipcRenderer.send('require::listSaleMonth');
ipcRenderer.send('require::listSaleYear');

ipcRenderer.on('listSalesToday', (err, item) => {
    const productos = item.productos;
    const ventasDom = $('#ventas_dia_body');
    ventasDom.html('');

    tmp = '';
    item.forEach(x => {
        d = new Date(x.fecha_creacion);
        fecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

        tmp += '<tr>';
        tmp += `<td style='color:var(--info);cursor:pointer' onclick='verFactura(this)' id='factura_${x.id_venta}'>${x.id_referencial}</td>`;
        tmp += `<td class='texto_black' onclick='verVenta(${x.id_venta})' style='cursor:pointer' id='venta_${x.id_venta}'><i class='fas fa-eye'></i></td>`;
        tmp += `<td class='texto_black'>${traductorTipoPago(x.tipo_pago)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.total_bs)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.total_usd)}</td>`;
        tmp += `<td class='texto_black'>${fecha}</td>`;
        tmp += '</tr>';
    });
    ventasDom.append(tmp);
});

ipcRenderer.on('listSalesWeek', (err, item) => {
    const productos = item.productos;
    const ventasDom = $('#ventas_semana_body');
    ventasDom.html('');

    tmp = '';
    item.forEach(x => {
        d = new Date(x.fecha_creacion);
        fecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

        tmp += '<tr>';
        tmp += `<td style='color:var(--info);cursor:pointer' onclick='verFactura(this)' id='factura_${x.id_venta}'>${x.id_referencial}</td>`;
        tmp += `<td class='texto_black' onclick='verVenta(${x.id_venta})' style='cursor:pointer' id='venta_${x.id_venta}'><i class='fas fa-eye'></i></td>`;
        tmp += `<td class='texto_black'>${traductorTipoPago(x.tipo_pago)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.total_bs)}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.total_usd)}</td>`;
        tmp += `<td class='texto_black'>${fecha}</td>`;
        tmp += '</tr>';
    });
    ventasDom.append(tmp);
});

// Ventas count

ipcRenderer.send('require::listCountSaleToday');
ipcRenderer.send('require::listCountSaleWeek');
ipcRenderer.send('require::listCountSaleMonth');
ipcRenderer.send('require::listCountSaleYear');

ipcRenderer.on('listCountSalesToday', (err, item) => {
    const domBs = $('#bs_diario');
    const domUsd = $('#dolar_diario');

    const datos = item[0];

    domBs.html(numberFormat(datos.bs) + ' Bs');
    domUsd.html(numberFormat(datos.usd) + ' $');
});

ipcRenderer.on('listCountSalesWeek', (err, item) => {
    const domBs = $('#bs_semana');
    const domUsd = $('#dolar_semana');

    const datos = item[0];

    domBs.html(numberFormat(datos.bs) + ' Bs');
    domUsd.html(numberFormat(datos.usd) + ' $');
});

ipcRenderer.on('listCountSalesMonth', (err, item) => {
    const domBs = $('#bs_mes');
    const domUsd = $('#dolar_mes');

    const datos = item[0];

    domBs.html(numberFormat(datos.bs) + ' Bs');
    domUsd.html(numberFormat(datos.usd) + ' $');
});

ipcRenderer.on('listCountSalesYear', (err, item) => {
    const domBs = $('#bs_año');
    const domUsd = $('#dolar_año');

    const datos = item[0];

    domBs.html(numberFormat(datos.bs) + ' Bs');
    domUsd.html(numberFormat(datos.usd) + ' $');
});

const verVenta = id => {
    ipcRenderer.send('open::salesDetails', id);
};