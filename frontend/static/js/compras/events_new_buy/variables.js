const { ipcRenderer } = require('electron');

let producto = $('#producto');
let tipo_pago = $('#tipo_pago');

let cesta =
{
    productos: [],
    tipo_pago: ''
};
let productosInLine = [];
let total_bs = 0;
let total_usd = 0;

let total_porcentaje = 0;
