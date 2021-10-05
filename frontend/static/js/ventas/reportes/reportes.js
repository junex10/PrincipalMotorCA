const electron = require('electron').remote;
const imageBusiness = 'https://i.imgur.com/xaGDLT4.png';

const cssReportSale = 
`.invoice-box {
    max-width: 800px;
    margin: auto;
    padding: 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
    font-size: 16px;
    line-height: 24px;
    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    color: #555;
}
.invoice-box table {
    width: 100%;
    line-height: inherit;
    text-align: left;
}
.invoice-box table td {
    padding: 5px;
    vertical-align: top;
}
.invoice-box table tr td:nth-child(2) {
    text-align: right;
}
.invoice-box table tr.top table td {
    padding-bottom: 20px;
}
.invoice-box table tr.top table td.title {
    font-size: 45px;
    line-height: 45px;
    color: #333;
}
.invoice-box table tr.information table td {
    padding-bottom: 40px;
}
.invoice-box table tr.heading td {
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
}
.invoice-box table tr.details td {
    padding-bottom: 20px;
}
.invoice-box table tr.item td {
    border-bottom: 1px solid #eee;
}
.invoice-box table tr.item.last td {
    border-bottom: none;
}
.invoice-box table tr.total td:nth-child(2) {
    border-top: 2px solid #eee;
    font-weight: bold;
}
@media only screen and (max-width: 600px) {
    .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
    }
    .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
    }
}`;

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const generatePDF = (filepath, options) => {

    const BrowserWindow = electron.BrowserWindow;
    const dialog = electron.dialog;

    dialog.showSaveDialog({
        title: 'Guardar archivo pdf',
        buttonLabel: 'Guardar',
        filters: [
            {
                name: 'Archivos pdf',
                extensions: ['pdf']
            }
        ]
    }).then(file => {
        if (!file.canceled) {
            let route = file.filePath.toString();

            let win = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: true
                }
            });

            win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(filepath))

            win.webContents.on('did-finish-load', () => {
                win.webContents.printToPDF(options).then(data => {
                    fs.writeFile(route, data, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('PDF Generated Successfully');
                            ipcRenderer.send('require::reloadMain');
                        }
                    });
                }).catch(error => {
                    console.log(error)
                });
            });
        }
    });
};

const optionSales = {
    marginsType: 0,
    pageSize: 'A4',
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
};
