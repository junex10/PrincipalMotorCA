const { Notification } = require('electron');
const path = require('path');

const ErrorNotification = () => {
    return {

        // Factura 
        errorTax: () => {
            return new Notification({
                title: 'Error en factura',
                body: 'Hubo un error al generar factura'
            }).show();
        },

        // Inventario

        errorInventory: () => {
            return new Notification({
                title: 'Error en el inventario',
                body: 'No se pudo restar el producto del inventario',
            }).show();
        },

        // Ventas

        errorNewSale: () => {
            return new Notification({
                title: 'Error en la venta',
                body: 'No se pudo registrar la venta'
            }).show();
        },

        error: (title, body) => {
            return new Notification({
                title: title,
                body: body
            }).show();
        }
    }
};

const SuccessNotification = () => {
    return {
        // Factura

        successTax: () => {
            return new Notification({
                title: 'Venta!',
                body: 'Se ha realizado la venta',
                icon: path.join(__dirname, './../../frontend/static/icons/success.ico')
            }).show();
        },
        success: (title, body) => {
            return new Notification({
                title: title,
                body: body,
                icon: path.join(__dirname, '../../frontend/static/icons/success.ico')
            }).show();
        }
    }
};

module.exports = {
    ErrorNotification,
    SuccessNotification
}