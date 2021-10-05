ipcRenderer.send('require::saleDetail');

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

ipcRenderer.on('list::ActualSale', (err, item) => {
    item = item[0];

    $('#tipo_pago').val(traductorTipoPago(item.tipo_pago));

    impuestos = JSON.parse(item.impuestos);

    let impuestoString = '';
    z = 0;
    impuestos.map((x, i) => {
        cesta.impuestos.push({
            impuesto: x.impuesto,
            porcentaje: x.porcentaje,
            id_impuesto: x.id_impuesto
        });
        if (i == z) {
            impuestoString += `${x.impuesto}(${x.porcentaje})`;
        } else {
            impuestoString += `${x.impuesto}(${x.porcentaje}), `;
        }
        z++;
    });
    $('#impuesto').val(impuestoString);
    
    productos = JSON.parse(item.productos);

    productos.map(x => {
        cesta.productos.push({
            producto: x.producto,
            id_producto: x.id_producto,
            cantidad: x.cantidad,
            precio_usd: x.precio_usd,
            precio_bs: x.precio_bs
        });
    });
    
    updateFacturaBasket(cesta, false);
    updatePriceBills();

    calculate_subTotal();
});