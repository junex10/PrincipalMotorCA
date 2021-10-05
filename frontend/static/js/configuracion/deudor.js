const { ipcRenderer } = require('electron');
$('#nuevo_deudor').click(function(){
    ipcRenderer.send('open::new_deudor');
});
const numberFormat = value => new Intl.NumberFormat().format(value);
ipcRenderer.send('require::listAllDeudores');
ipcRenderer.on('listAllDeudores', (err, item) => {
    const dom_disp = $('#item_disponibles_body');
    dom_disp.html('');
    let tmp;
    item.map(x => {
        console.log(x);
        tmp += '<tr>';
        tmp += `<td class='texto_black'>${x.usuario}</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.deuda_bs)} Bs</td>`;
        tmp += `<td class='texto_black'>${numberFormat(x.deuda_usd)} USD</td>`;
        tmp += `<td class='texto_black'>
        <div class='row'>
            <div onclick='modify(${x.id_deudor})' id='deudor_mod_${x.id_deudor}' style='cursor:pointer' class='col-12 col-sm-12 col-lg-12'>
                <i class='fas fa-edit modify'></i>
            </div>
        </div>
        </td>`;
        tmp += '</tr>';
    });
    dom_disp.html(tmp);
});
const modify = id => {
    ipcRenderer.send('open::modifyDeudor', {id: id});
};