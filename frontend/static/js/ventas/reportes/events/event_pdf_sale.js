var controlSalePerSale = 0;
const verFactura = dom => {
    controlSalePerSale = 1;
    const id = dom.id.match('factura_(\.*[0-9])')[1];

    ipcRenderer.send('require::listSalesReportProduct', id);

    ipcRenderer.on('list::ActualSale', (err, item) => {
        if (controlSalePerSale == 1) {
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
                                Factura #: ${item[0].id_referencial}
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

            productos = JSON.parse(item[0].productos);
            productos.map(x => {

                total_bs += Number(x.precio_bs) * x.cantidad;
                total_usd += Number(x.precio_usd) * x.cantidad;

                totalPrecioUsd = x.precio_usd * x.cantidad;
                totalPrecioBs = x.precio_bs * x.cantidad;

                tmpProducts += `<tr class="item">
                            <td>
                                ${x.producto} x ${x.cantidad}
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

            reportSaleActualSale += totalItemString;

            generatePDF(reportSaleActualSale, optionSales);
            controlSalePerSale++;
        }
    });
};
