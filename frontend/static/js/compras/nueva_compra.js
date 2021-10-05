ipcRenderer.send('require::ProductNewBuy');

ipcRenderer.on('list::inventario', (err, item) => {
    setDataProducts(item, producto, $('<option />', {
        text: 'Seleccione un producto',
        value: '0'
    }));
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
});
$('#tipo_pago').on('change', function(){
    const value = $(this).val();

    cesta.tipo_pago = value;
});

$('#submit').on('click', function(){
    if ((cesta.productos.length > 0) && (cesta.tipo_pago != '')) {
        ipcRenderer.send("new_buy", cesta);
    }
});