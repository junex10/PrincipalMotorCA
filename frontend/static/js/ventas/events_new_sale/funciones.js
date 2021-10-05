/**
* @function 
*/

const calculoImpuestoDinero = (porcentaje, total) => (porcentaje * total) / 100;
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

// Calculamos el subtotal

const calculate_subTotal = () => {

    const subTotal_bs = $('#sub_bolivares');
    const subTotal_usd = $('#sub_dolares');

    total_porcentaje = 0;
    billsInLine.forEach(x => {
        if (x.available == false) {
            total_porcentaje += x.porcentaje;
        }
    });

    subTotal_bs.html(numberFormat(total_bs));
    subTotal_usd.html(numberFormat(total_usd));
};

// Actualizar lista de opciones en impuesto

const updateSelectBills = id => {
    // Actualizamos la lista de opciones
    impuestos.html('');

    impuestos.append($('<option />', {
        text: 'Seleccione el impuesto (opcional)',
        value: '0'
    }));

    billsInLine.forEach((x, index, array) => {
        if (x.id_impuesto == id) {
            array[index].available = false;
        }

        if (x.available == true) {
            const options = $('<option />', {
                text: x.impuesto + ' %' + x.porcentaje,
                value: x.id_impuesto
            });
            impuestos.append(options);
        }
    });
};

// Actualiza el impuesto a cobrar

const updatePriceBills = () => {

    if ((total_bs !== undefined) && (total_usd !== undefined)) {
        // Actualizamos precios

        billsUsing.forEach(x => {
            const porcentaje = x.porcentaje;

            calculo_bs_impuesto = calculoImpuestoDinero(porcentaje, total_bs);
            calculo_usd_impuesto = calculoImpuestoDinero(porcentaje, total_usd);

            $(`#${x.id_dom_bs}`).html(numberFormat(calculo_bs_impuesto));
            $(`#${x.id_dom_usd}`).html(numberFormat(calculo_usd_impuesto));

        })
    }

};

// Actualiza la cesta

const updateFacturaBasket = (data, way = true) => {
    const factura = $('#factura');

    const impuestos = data.impuestos;
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
            if (way) {
                tableProducts += `<td><div class='row'><div style='cursor:pointer' id='${id_borrar}' title='Borrar' class='col-lg-6 col-12 borrar' onclick='deleteProduct(this)'><i style='color:var(--danger)' class="fas fa-minus-circle"></i></div><div style='cursor:pointer' onclick='modifyProduct(this)' title='Modificar' id='${id_modificar}' class='col-lg-6 col-12'><i style='color:var(--verde)' class="fas fa-plus-circle"></i></div></div></td>`;
            } else {
                tableProducts += `<td>Sin acciones</td>`;
            }
            tableProducts += '</tr>';
        });

        factura.html(tableProducts);

        calculate_subTotal();
        // Calculamos el total

        total_usd_bill = total_usd + calculoImpuestoDinero(total_porcentaje, total_usd);
        total_bs_bill = total_bs + calculoImpuestoDinero(total_porcentaje, total_bs);

        totalidad_bs.html(numberFormat(total_bs_bill));
        totalidad_usd.html(numberFormat(total_usd_bill));

    } else {

        factura.html('');

        totalidad_bs.html('0');
        totalidad_usd.html('0');

        total_usd_bill = 0;
        total_bs_bill = 0;

        total_bs = 0;
        total_usd = 0;

        calculate_subTotal();
    }
    if (impuestos.length > 0) {

        tableBills = '';

        impuestos.forEach((x, index, data) => {

            const id_bs = `${x.impuesto}_${index}_bs`
            const id_usd = `${x.impuesto}_${index}_usd`

            billsUsing.push({
                id_dom_bs: id_bs,
                id_dom_usd: id_usd,
                id_impuesto: x.id_impuesto,
                impuesto: x.impuesto,
                porcentaje: x.porcentaje
            })

            tableBills += '<tr>';
            tableBills += `<td style="text-align: left;">${x.impuesto}: <b><span class='impuesto_porcentaje'>${x.porcentaje} %</span><br> Bs</b> <b><span class='impuesto_bs' id='${id_bs}'>0</span> Bs</b> / <b><span class='impuesto_usd' id='${id_usd}'>0</span>$</b></td>`;
            tableBills += '</tr>';
        });
        datos_impuestos.html(tableBills);

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
            index.children[0].outerHTML = `<td><input type='number' id='${id_cantidad}' class='form-control cantidad_input' value='${cantidad}'><br><button type='button' class="btn btn-primary" onclick="updateProductBasket(${id})"><i class="fas fa-check"></i></button>`;
        }
    });
};

const updateProductBasket = id => {
    const productos = cesta.productos;
    const cantidad = Number($('.cantidad_input').val());

    productos[id].cantidad = cantidad;

    updateFacturaBasket(cesta);
};
$('#submit').on('click', function () {
    const productos = cesta.productos;
    const tipo_pago = $('#tipo_pago').val();
    const impuestos = cesta.impuestos.length <= 0 ? '-1' : cesta.impuestos;

    let data = {};

    if ((productos.length > 0) && (tipo_pago != '') && (tipo_pago != '')) {
        data = {
            impuestos: impuestos,
            tipo_pago: tipo_pago,
            productos: productos,
            precio_bs_total: total_bs,
            precio_usd_total: total_usd
        }
        ipcRenderer.send('new::sale', data);
    }
});
