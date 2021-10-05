const { ipcRenderer } = require('electron');

/**
*   @variable 
*/

let tipo_producto = $('#type_producto');
let producto = $('#producto');
let impuestos = $('#impuesto');

let cesta =
{
    impuestos: [],
    productos: []
}
    ;
let productosInLine = [];
let typeProductsInLine = [];
let billsInLine = [];

let billsUsing = [];

// Impuestos

let calculo_bs_impuesto;
let calculo_usd_impuesto;

// Totalidad

let total_bs = 0;
let total_usd = 0;

let total_bs_bill = 0;
let total_usd_bill = 0;

let total_porcentaje = 0;