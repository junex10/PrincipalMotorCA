ipcRenderer.send('require::typeProductNewSale');

ipcRenderer.on('listAllTypeProductCondition', (err, item) => {
    item.forEach(val => {
        nameText = val.tipo_producto;
        value = val.id_tipo_producto;
        const option = $('<option />', {
            text: nameText,
            value: value
        });
        typeProductsInLine.push({
            tipo_producto: nameText,
            id_tipo_producto: value
        });
        tipo_producto.append(option);
    });
});
ipcRenderer.send('require::list-productsNewSale');

ipcRenderer.on('list::inventario', (err, item) => {
    setDataProducts(item, producto, $('<option />', {
        text: 'Seleccione un producto',
        value: '0'
    }));
});

ipcRenderer.send('require::list-billsNewSale');

ipcRenderer.on('listAllBill', (err, item) => {
    item.forEach(val => {
        imp = val.impuesto;
        value = val.id_impuesto;
        porcentaje = val.porcentaje;
        const options = $('<option />', {
            text: imp + ' %' + porcentaje,
            value: value
        });
        billsInLine.push({
            impuesto: imp,
            porcentaje: porcentaje,
            id_impuesto: value,
            available: true
        });

        impuestos.append(options);
    });
});

// Actualiza los impuestos
impuestos.on('change', function () {
    const value = $(this).val();
    if (value != '0') {
        billsInLine.map(x => {
            if (value == x.id_impuesto) {
                cesta.impuestos.push({
                    impuesto: x.impuesto,
                    porcentaje: x.porcentaje,
                    id_impuesto: x.id_impuesto
                })
            }
        });
    }
    updateSelectBills(value);
    updateFacturaBasket(cesta);
    updatePriceBills();
    calculate_subTotal();
});

// Actualiza la cantidad del producto actual

// Filtro por tipo de producto

tipo_producto.on('change', function () {
    const value = $(this).val();
    ipcRenderer.send('filter::TypeProductNewSale', { filter: value });

    ipcRenderer.on('listProductByTypeProduct', (err, rows) => {
        if (rows.length <= 0) {
            setDataProducts(rows, producto, $('<option />', {
                text: 'No hay productos disponibles',
                value: '0'
            }));
        } else {
            setDataProducts(rows, producto, $('<option />', {
                text: 'Seleccione un producto',
                value: '0'
            }));
        }
    });
});

// Cesta de compras

producto.on('change', function () {
    const value = $(this).val();

    productosInLine.map(val => {
        if (val.id_producto == value) {
            cesta.productos.push({
                producto: val.producto,
                id_producto: val.id_producto,
                cantidad: 1,
                precio_usd: val.precio_usd,
                precio_bs: val.precio_bs
            });
        }
    });
    $(this)[0].value = '0';
    updateFacturaBasket(cesta);
    updatePriceBills();

    calculate_subTotal();
});