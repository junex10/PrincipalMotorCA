const numberFormat = value => new Intl.NumberFormat().format(value);
const setDataProducts = (data, dom, first) => {
    dom.html('');
    dom.append(first);

    let tmp = [];
    let productsPush = [];
    data.forEach(val => {
        nameText = val.nombre_producto;
        valueText = val.id_inventario;
        tmp.push($('<option />', {
            text: nameText,
            value: valueText
        }));
        productsPush.push({
            producto: nameText,
            id_producto: valueText,
            precio_usd: val.precio_usd,
            precio_bs: val.precio_bs
        });
    });
    dom.append(...tmp);
    productosInLine = [...productsPush];
};

// Actualiza la cesta

const updateFacturaBasket = data => {
    const factura = $('#factura');

    const productos = data.productos;

    // Totalidad

    const totalidad_bs = $('#bolivares');
    const totalidad_usd = $('#dolares');

    // Impuestos

    const datos_impuestos = $('#datos_impuestos');

    if (productos.length > 0) {

        tableProducts = '';

        total_bs = 0;
        total_usd = 0;

        productos.forEach((x, index) => {

            const precio_bs = x.precio_bs;
            const precio_usd = x.precio_usd;
            const cantidad = x.cantidad;

            total_bs += Number(precio_bs * cantidad);
            total_usd += Number(precio_usd * cantidad);

            const id_borrar = `borrar_${index}`
            const id_modificar = `modificar_${index}`

            const id_container = `container_${index}`

            tableProducts += `<tr class='producto_table' id='${id_container}'>`;
            tableProducts += `<td>${x.cantidad}</td>`;
            tableProducts += `<td>${x.producto}</td>`;
            tableProducts += `<td>${numberFormat(precio_usd)} <b>$</b><br> ${numberFormat(precio_bs)} <b>Bs</b></td>`;
            tableProducts += `<td><div class='row'><div style='cursor:pointer' id='${id_borrar}' title='Borrar' class='col-lg-6 col-12 borrar' onclick='deleteProduct(this)'><i style='color:var(--danger)' class="fas fa-minus-circle"></i></div><div style='cursor:pointer' onclick='modifyProduct(this)' title='Modificar' id='${id_modificar}' class='col-lg-6 col-12'><i style='color:var(--verde)' class="fas fa-plus-circle"></i></div></div></td>`;
            tableProducts += '</tr>';
        });

        factura.html(tableProducts);

        totalidad_bs.html(numberFormat(total_bs));
        totalidad_usd.html(numberFormat(total_usd));

    } else {

        factura.html('');

        totalidad_bs.html('0');
        totalidad_usd.html('0');

        total_usd_bill = 0;
        total_bs_bill = 0;

        total_bs = 0;
        total_usd = 0;

    }
};

const deleteProduct = dom => {
    const id = dom.id.match('borrar_(\.*[0-9])')[1];
    const productos = cesta.productos;

    productos.splice(id, 1);

    updateFacturaBasket(cesta);
};

const modifyProduct = dom => {
    const id = dom.id.match('modificar_(\.*[0-9])')[1];

    $('.producto_table').map((val, index) => {
        if (val == id) {

            const id_cantidad = `cantidadInput_${val}`;

            cantidad = index.children[0].textContent;
            index.children[2].outerHTML = `<td><label for='precioUsd_${val}'>Precio dolares</label><input type='number' id='precioUsd_${val}' class='form-control precio_usd_input' value='0'>
            <br>
            
            <label for='precioBs_${val}'>Precio bolivares</label><input type='number' id='precioBs_${val}' class='form-control precio_bs_input' value='0'>
            <br><button type='button' class="btn btn-primary" onclick="updateProductBasket(${id})"><i class="fas fa-check"></i></button></td>
            `;

            index.children[0].outerHTML = `<td><input type='number' id='${id_cantidad}' class='form-control cantidad_input' value='${cantidad}'><br><button type='button' class="btn btn-primary" onclick="updateProductBasket(${id})"><i class="fas fa-check"></i></button></td>`;
        }
    });
};

const updateProductBasket = id => {
    const productos = cesta.productos[id];
    const cantidad = Number($('.cantidad_input').val());

    productos.cantidad = cantidad;
    productos.precio_bs = Number($('.precio_bs_input').val());
    productos.precio_usd = Number($('.precio_usd_input').val());

    updateFacturaBasket(cesta);
};