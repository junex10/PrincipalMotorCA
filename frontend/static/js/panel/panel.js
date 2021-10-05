const { ipcRenderer } = require('electron');

$('#range_date').click(function () {
    ipcRenderer.send('open::range_date');
});

// Ventas

ipcRenderer.send('require::saleTodayReports');
ipcRenderer.send('require::saleMostPopular');

ipcRenderer.on('listTotalSaleTodayReport', (err, item) => {
    const ventas = item[0].ventas;

    heading = {
        title: 'Ventas del día',
        subtitle: `${ventas} venta(s) de hoy`
    }

    const graphic = ventas_graficas_diaria();
    graphic.setReport($('#ventas_graficas_diaria')[0], [ventas], heading);
    graphic.show();
});

ipcRenderer.send('require::saleWeekReports');

ipcRenderer.on('listTotalSaleWeekReport', (err, item) => {
    let data = [];
    let countTotalSale = 0;
    item.forEach(x => {
        tmp = [];

        date = new Date(x.fecha_creacion);
        month = date.getMonth() + 1;
        monthReset = month < 10 ? `0${month}` : month;
        stringDate = `${date.getFullYear()}-${monthReset}-${date.getDate()}`

        countTotalSale += x.ventas;

        tmp = [stringDate, x.ventas];
        data.push(tmp);
    });
    const graphic = ventas_graficas_semanal();

    heading = {
        title: 'Ventas de la semana',
        subtitle: `${countTotalSale} venta(s) de la semana`
    }

    graphic.setReport($('#ventas_graficas_semanal')[0], data, heading);
    graphic.show();
});

ipcRenderer.on('listTotalSaleMostPopular', (err, item) => {

    productsMost = [];
    productsNoSerialize = [];
    item.forEach(x => {
        const productos = JSON.parse(x.productos);
        const fecha = x.ventas;
        productos.forEach(y => {
            productsMost.push(y.id_producto)
            y.fecha = fecha;
            productsNoSerialize.push(y);
        })
    });
    unique = productsMost.filter((value, index, self) => self.indexOf(value) === index);

    const productMostPopular = (productsNoSerialize, unique, count) => {
        z = 0;
        productTmp = ''
        timeTmp = ''
        productsNoSerialize.map(y => {
            if (unique == y.id_producto) {
                z += y.cantidad;
                productTmp = y.producto;
                timeTmp = y.fecha
            }
        })
        timeTmp = new Date(timeTmp);

        count.push({
            name: productTmp,
            value: z,
            fecha: `${timeTmp.getFullYear()}/${timeTmp.getMonth() + 1}/${timeTmp.getDate()}`
        })

        return count
    };

    countProducts = [];

    if (unique.length < 2) {
        unique.map(x => {
            productMostPopular(productsNoSerialize, x, countProducts)
        })
    } else {
        for (x = 0; x < 3; x++) {
            productMostPopular(productsNoSerialize, unique[x], countProducts)
        }
    }

    countProductsPie = countProducts.sort((a, b) => a.value - b.value).reverse();

    legend = [];
    countProductsPie.forEach(z => {
        legend.push(z.name)
    })

    heading = {
        title: 'Productos populares (este año)',
        subtitle: `El producto ${countProductsPie[0].name} es el mas popular`,
        legend: legend
    }

    const graphic = ventas_graficas_popular();

    graphic.setReport($('#ventas_graficas_popular')[0], countProductsPie, heading);
    graphic.show();

});

// Inventario

ipcRenderer.send('require::inventoryMontlyReports')

ipcRenderer.on("listInventoryMonth", (err, item) => {

    const graphic = inventario_graficas_llenado();

    let datos = [];
    let legend = [];

    total_comprado = 0;

    item.map(x => {
        legend.push(x.nombre_producto);

        d = new Date(x.fecha_creacion);
        month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
        day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
        stringDate = `${d.getFullYear()}/${month}/${day}`;

        datos.push({
            fecha: stringDate,
            name: x.nombre_producto,
            value: x.cantidad_comprada
        });
        total_comprado += x.cantidad_comprada;
    });
    heading = {
        title: 'Abastecimiento este mes',
        subtitle: `Abastecimiento de ${total_comprado} productos`,
        legend: legend
    }

    graphic.setReport($('#inventario_llenado')[0], datos, heading);
    graphic.show();

});