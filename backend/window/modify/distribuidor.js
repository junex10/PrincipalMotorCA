const { BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

const windowModifyDistribuidor = () => {
    this.newWindow;
    return {
        newWindow: () => {
            this.newWindow = new BrowserWindow({
                width: 1280,
                height: 1020,
                webPreferences: {
                    nodeIntegration: true,
                }
            });

            this.newWindow.loadURL(url.format({
                pathname: path.join(__dirname, './../../../frontend/view/modificar_distribuidor.ejs'),
                protocol: 'file',
                slashes: true
            }));

            return this.newWindow;
        },
        getWindow: () => {
            return this.newWindow;
        }
    }
}

module.exports = {
    windowModifyDistribuidor
}