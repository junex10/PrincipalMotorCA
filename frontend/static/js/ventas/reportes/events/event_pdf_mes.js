var controlSalePerMonth = 0;

$('#pdf_mes').on('click', function () {
    controlSalePerMonth = 1;

    ipcRenderer.send('require::listSalesReport');

    ipcRenderer.on('listSalesMonth', (err, item) => {
        if (controlSalePerMonth == 1) {
            d = new Date();

            month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
            day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

            stringDate = `${day}/${month}/${d.getFullYear()}`;

            headDocument = `<tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <img src="${imageBusiness}" />
                            </td>
                            <td>
                                Mes: ${months[d.getMonth()]}
                                <br> Creado: ${stringDate}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr class="information">
                <td colspan="2 ">
                    <table>
                        <tr>
                            <td>
                                Principal Motor CA<br>
                                Calle 264156<br>
                                Venezuela
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;

            tmpProducts = '';
            tmpProductsHead = `<tr class="heading"><td>Producto(s)</td><td>Precio USD</td><td>Precio Bs</td></tr>`;
            tmpProductsFoot = `</table></div></body></html>`;

            total_bs = 0;
            total_usd = 0;
            item.map(x => {
                productos = JSON.parse(x.productos)[0];

                total_bs += Number(productos.precio_bs) * productos.cantidad;
                total_usd += Number(productos.precio_usd) * productos.cantidad;

                totalPrecioUsd = productos.precio_usd * productos.cantidad;
                totalPrecioBs = productos.precio_bs * productos.cantidad;

                tmpProducts += `<tr class="item">
                            <td>
                                ${productos.producto} x ${productos.cantidad}
                            </td>
                            <td>
                                $ ${numberFormat(totalPrecioUsd)}
                            </td>
                            <td>
                                Bs ${numberFormat(totalPrecioBs)}
                            </td>
                        </tr>
                        `
                    ;
            });

            tmpProducts += `<tr class="total"><td><b>Total Bs: Bs ${numberFormat(total_bs)}</b></td><td>Total USD: $ ${numberFormat(total_usd)}</td></tr>`;

            const totalItemString = headDocument + tmpProductsHead + tmpProducts + tmpProductsFoot;

            reportSaleActualMonth += totalItemString;

            generatePDF(reportSaleActualMonth, optionSales);

            controlSalePerMonth++;
        }
    });
});