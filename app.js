const { app, dialog, BrowserWindow, Menu, ipcMain, ipcRenderer, remote, Notification, shell } = require('electron');
const electronEjs = require('ejs-electron');

const url = require('url');
const path = require('path');

// Pipe

const { Filter } = require(path.join(__dirname, 'backend/pipe/filter'));

// Middleware

const { Ventas } = require(path.join(__dirname, 'backend/middleware/ventas'));
const { Inventario } = require(path.join(__dirname, 'backend/middleware/inventario'));
const { RangoFechas } = require(path.join(__dirname, 'backend/middleware/rango_fechas'));
const { Compras } = require(path.join(__dirname, 'backend/middleware/compras'));

// Database ACTION

const testBd = require(path.join(__dirname, 'backend/modal/database')).connectDb();

testBd.connect();

const { Configuracion } = require(path.join(__dirname, 'backend/middleware/configuracion'));

// Window

const { windowNewSale } = require(path.join(__dirname, 'backend/window/nueva_venta'));
const { windowNewProduct } = require(path.join(__dirname, 'backend/window/nuevo_producto'));
const { windowRangeDate } = require(path.join(__dirname, 'backend/window/rango_fechas'));
const { windowNewBranch } = require(path.join(__dirname, 'backend/window/nueva_marca'));
const { windowNewTypeProduct } = require(path.join(__dirname, 'backend/window/nuevo_tipo_producto'));
const { windowNewSponsor } = require(path.join(__dirname, 'backend/window/nuevo_distribuidor'));
const { windowBill } = require(path.join(__dirname, 'backend/window/nuevo_impuesto'));
const { windowNewBuy } = require(path.join(__dirname, 'backend/window/nueva_compra'));
const { windowEmployer } = require(path.join(__dirname, 'backend/window/nuevo_empleado'));
const { windowNewDeudor } = require(path.join(__dirname, 'backend/window/nuevo_deudor'));

// Modify Window

const { windowModifyBranch } = require(path.join(__dirname, 'backend/window/modify/marca'));
const { windowModifyDistribuidor } = require(path.join(__dirname, 'backend/window/modify/distribuidor'));
const { windowModifyTypeProduct } = require(path.join(__dirname, 'backend/window/modify/tipo_producto'));
const { windowModifyBill } = require(path.join(__dirname, 'backend/window/modify/impuesto'));
const { windowModifyInventory } = require(path.join(__dirname, 'backend/window/modify/inventario'));
const { windowModifyEmployer } = require(path.join(__dirname, 'backend/window/modify/empleado'));
const { windowModifyDeudor } = require(path.join(__dirname, 'backend/window/modify/deudor'));

// Reports window

const { windowSalesDetail } = require(path.join(__dirname, 'backend/window/reports/detalles_venta'));

if (!app.isPackaged) {

    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bind', 'electron')

    });
}

// Lectura de archivos

const file = require('fs');
const os = require('os');

let mainWindow;

let rangoWindow;
let newSponsorWindow;
let newBranchWindow;
let newTypeProductWindow;
let newBillWindow;
let newBuyWindow;
let newEmployer;
let newDeudor;

// Venta

let newSaleWindow;
let newProductWindow;

// Modify window

let modBranchWindow;
let modSponsorWindow;
let modTypeProductWindow;
let modBillWindow;
let modInventoryWindow;
let modEmployerWindow;
let modDeudorWindow;

// Reports window

let repSalesDetails;

let params = {};

// Modulos
const action = Configuracion();
const inventario = Inventario();
const ventas = Ventas();
const compras = Compras();
const rangoFechas = RangoFechas();

// Pipe

const pipe = Filter();

app.on('ready', () => {

    if (!app.isPackaged) {
        const mainMenuDev = [
            {
                label: 'Consola',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools(); // Abrimos consola de la APP
                }
            },
            {
                label: 'Refrescar',
                accelerator: 'F5',
                click(item, window) {
                    window.reload();
                }
            }
        ];

        const menu = Menu.buildFromTemplate(mainMenuDev);
        Menu.setApplicationMenu(menu);
    } else {

        const mainMenuPro = [
            {
                label: 'Refrescar',
                accelerator: 'F5',
                click(item, window) {
                    window.reload();
                }
            }
        ];

        const menu = Menu.buildFromTemplate(mainMenuPro);
        Menu.setApplicationMenu(menu);
    }

    /**
     *   @module ventas
    */

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1020,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'frontend/view/ventas.ejs'),
        protocol: 'file',
        slashes: true
    }));

    // Ventas

    ipcMain.on('require::ventas', (err, item) => {
        ventas.listVentas(mainWindow);
    });

    // Data de ventas hechas

    ipcMain.on('require::listSaleToday', (err, item) => {
        ventas.totalToday(mainWindow);
    });

    ipcMain.on('require::listSaleWeek', (err, item) => {
        ventas.totalWeek(mainWindow);
    });

    ipcMain.on('require::listSaleMonth', (err, item) => {

        const d = new Date();

        month = d.getMonth() + 1;
        year = d.getFullYear();

        ventas.totalMontly(mainWindow, month, year);

    });

    ipcMain.on('require::listSaleYear', (err, item) => {

        year = new Date().getFullYear();
        ventas.totalYear(mainWindow, year);
    });

    // Data de count de ventas

    ipcMain.on('require::listCountSaleToday', (err, item) => {
        ventas.totalCountToday(mainWindow);
    });

    ipcMain.on('require::listCountSaleWeek', (err, item) => {
        ventas.totalCountWeek(mainWindow);
    });

    ipcMain.on('require::listCountSaleMonth', (err, item) => {

        const d = new Date();

        month = d.getMonth() + 1;
        year = d.getFullYear();

        ventas.totalCountMontly(mainWindow, month, year);
    });

    ipcMain.on('require::listCountSaleYear', (err, item) => {
        year = new Date().getFullYear();
        ventas.totalCountYear(mainWindow, year);
    });

    // Nueva venta

    ipcMain.on('open::new_sale', () => {
        newSaleWindow = windowNewSale();
        newSaleWindow.newWindow();
    });

    // Lista de productos en nueva venta

    ipcMain.on('require::list-productsNewSale', () => {
        Inventario().listProducts(newSaleWindow.getWindow());
    });

    ipcMain.on('require::typeProductNewSale', () => {
        action.selectTypeProduct(newSaleWindow.getWindow(), null, 'activo');
    });

    // Filtro por tipo de producto

    ipcMain.on('filter::TypeProductNewSale', (err, item) => {
        pipe.productFilterByTypeProduct(newSaleWindow.getWindow(), item.filter);
    });

    // Nueva venta mandamos form

    ipcMain.on('new::sale', (err, item) => {
        const data = {
            productos: item.productos,
            impuestos: item.impuestos,
            tipo_pago: item.tipo_pago,
            precio_bs: item.precio_bs_total,
            precio_usd: item.precio_usd_total
        };

        ventas.newSale(data);
        newSaleWindow.getWindow().close();
        mainWindow.reload();
    });

    // Impuesto

    ipcMain.on('require::list-billsNewSale', () => {
        action.selectBill(newSaleWindow.getWindow());
    });

    /**
    *   @module compras 
    */

    ipcMain.on('open::new_buy', () => {
        newBuyWindow = windowNewBuy();
        newBuyWindow.newWindow();

    });

    // Nuevas compras

    ipcMain.on('require::ProductNewBuy', () => {
        inventario.listProducts(newBuyWindow.getWindow());
    });

    ipcMain.on('new_buy', (err, item) => {
        compras.newBuy(item);
        newBuyWindow.getWindow().close();
    });

    ipcMain.on('require::listBuyWeek', () => {
        compras.listBuyingWeek(mainWindow);
    });

    ipcMain.on('require::listBuyMontly', () => {
        date = new Date();
        year = date.getFullYear();
        month = date.getMonth() + 1;
        compras.listBuyingMontly(mainWindow, month, year);
    });

    ipcMain.on('require::listBuyYear', () => {
        year = new Date().getFullYear();
        compras.listBuyingYear(mainWindow, year);
    });

    /**
    *   @module inventario
    */

    ipcMain.on('require::listProductos', (err, item) => {
        inventario.listProducts(mainWindow);
    });

    ipcMain.on('open::new_product', () => {
        newProductWindow = windowNewProduct();
        newProductWindow.newWindow(); 
    });

    ipcMain.on('require::listTypeProductsAllNewProduct', () => {
        action.selectTypeProduct(newProductWindow.getWindow(), null, 'activo');
    });

    ipcMain.on('require::listBranchAllNewProduct', () => {
        action.selectBranch(newProductWindow.getWindow(), null, 'activo');
    });

    ipcMain.on('new::product', (err, item) => {
        inventario.newProduct(item);
        newProductWindow.getWindow().close();
        mainWindow.reload();
    });

    ipcMain.on('open::modifyInventory', (err, item) => {
        modInventoryWindow = windowModifyInventory();
        modInventoryWindow.newWindow();
        
        params = item.id;
    });

    ipcMain.on('require::actualProduct', () => {
        const window = modInventoryWindow.getWindow();

        inventario.listProducts(window, params);
    })

    ipcMain.on('modify::Product', (err, item) => {
        inventario.updateProduct(item);
        modInventoryWindow.getWindow().close();
        mainWindow.reload();
    });

    // Modify view
    
    ipcMain.on('require::StatusProduct', () => {
        const window = modInventoryWindow.getWindow();

        action.selectStatus(window);
    })

    ipcMain.on('require::TypeProduct', () => {
        const window = modInventoryWindow.getWindow();

        action.selectTypeProduct(window)
    })

    ipcMain.on('require::Branch', () => {
        const window = modInventoryWindow.getWindow();

        action.selectBranch(window)
    })

    /**
    *   @module panel 
    */

    ipcMain.on('open::range_date', () => {
        rangoWindow = windowRangeDate();
        rangoWindow.newWindow();
    });

    ipcMain.on('require::range_date_sale', (err, item) => {
        rangoFechas.rangeDate(rangoWindow.getWindow(), item.init, item.end);
    });

    ipcMain.on('require::saleTodayReports', () => {
        ventas.totalTodayReport(mainWindow);
    });

    ipcMain.on('require::saleWeekReports', () => {
        ventas.totalWeekReport(mainWindow);
    });

    ipcMain.on('require::saleMostPopular', () => {
        year = new Date().getFullYear();
        ventas.totalMostReport(mainWindow, year);
    });

    ipcMain.on('require::inventoryMontlyReports', () => {
        date = new Date();
        year = date.getFullYear();
        month = date.getMonth() + 1;

        inventario.inventoryMontly(mainWindow, month, year);
    });

    ipcMain.on('require::saleDetail', () => {
        ventas.listVentas(repSalesDetails.getWindow(), params.id);
    });

    ipcMain.on('open::salesDetails', (err, id) => {
        repSalesDetails = windowSalesDetail();
        repSalesDetails.newWindow();
        params = { id: id };
    });

    /**
    *   @module marcas 
    */

    ipcMain.on('open::new_branch', () => {
        newBranchWindow = windowNewBranch();
        newBranchWindow.newWindow();
    });

    ipcMain.on('new::branch', (err, data) => {
        
        action.insertBranch(data);

        newBranchWindow.getWindow().close();
        mainWindow.reload();
    });

    // actualiza marca

    ipcMain.on('update::branch', (err, item) => {
        const id = item.id;
        const data = {
            marca: item.marca,
            estado_id: item.estado_id,
            distribuidor_id: item.distribuidor_id
        };
        param = {};

        action.updateBranch(id, data);

        modBranchWindow.getWindow().close();
        mainWindow.reload();
    });

    // Modificar marca

    ipcMain.on('open::modifyBranch', (err, id) => {
        modBranchWindow = windowModifyBranch();
        modBranchWindow.newWindow();
        params = id.id;
    });

    // Marca actual

    ipcMain.on('require::actualBranch', () => {
        const window = modBranchWindow.getWindow();
        action.selectBranch(window, params);
    });

    // Lista las marcas

    ipcMain.on('require::listAllBranch', () => {
        action.selectBranch(mainWindow);
    });

    // Lista los distribuidores en la vista modificar marca

    ipcMain.on('require::listSponsorAllMod', () => {
        action.selectSponsor(modBranchWindow.getWindow());
    });

    // Lista los distribuidores en la vista crear marca

    ipcMain.on('require::listSponsorAll', () => {
        action.selectSponsor(newBranchWindow.getWindow());
    });

    /**
    *   @module type products 
    */

    ipcMain.on('open::new_type_product', () => {
        newTypeProductWindow = windowNewTypeProduct();
        newTypeProductWindow.newWindow();
    });

    ipcMain.on('require::listAllTypeProduct', () => {
        action.selectTypeProduct(mainWindow)
    });

    ipcMain.on('new::TypeProduct', (err, data) => {
        
        action.inserTypeProduct(data)
        newTypeProductWindow.getWindow().close();

        mainWindow.reload();
    });

    // Modificar tipo producto

    ipcMain.on('open::modifyTypeProduct', (err, id) => {
        modTypeProductWindow = windowModifyTypeProduct();
        modTypeProductWindow.newWindow();
        params = id.id;
    });

    // actual tipo producto

    ipcMain.on('require::actualTypeProduct', () => {
        const window = modTypeProductWindow.getWindow();
        action.selectTypeProduct(window, params);
    });

    // actualiza tipo producto

    ipcMain.on('update::type_product', (err, item) => {
        const id = item.id;
        const data = {
            tipo_producto: item.tipo_producto,
            estado_id: item.estado_id,
        };
        param = {};

        action.updateTypeProduct(id, data);

        modTypeProductWindow.getWindow().close();
        mainWindow.reload();
    });

    /**
    *   @module distribuidor 
    */

    ipcMain.on('open::new_sponsor', () => {
        newSponsorWindow = windowNewSponsor();
        newSponsorWindow.newWindow();
    });

    ipcMain.on('require::listAllSponsorMain', () => {
        action.selectSponsor(mainWindow);
    });

    ipcMain.on('new::sponsor', (err, data) => {
        action.insertSponsor(data);

        newSponsorWindow.getWindow().close();

        mainWindow.reload();
    });

    // actualiza sponsor

    ipcMain.on('update::sponsor', (err, item) => {
        const id = item.id;
        const data = {
            estado_id: item.estado_id,
            distribuidor: item.distribuidor
        };
        param = {};
        action.updateSponsor(id, data);

        modSponsorWindow.getWindow().close();
        mainWindow.reload();
    });

    // Modificar sponsor

    ipcMain.on('open::modifySponsor', (err, id) => {
        modSponsorWindow = windowModifyDistribuidor();
        modSponsorWindow.newWindow();
        params = id.id;
    });

    // Marca sponsor

    ipcMain.on('require::actualSponsor', () => {
        const window = modSponsorWindow.getWindow();
        action.selectSponsor(window, params);
    });

    /**
    *   @module impuesto 
    */

    ipcMain.on('open::new_bill', () => {
        newBillWindow = windowBill();
        newBillWindow.newWindow();
    });

    ipcMain.on('require::listAllBill', () => {
        action.selectBill(mainWindow);
    });

    ipcMain.on('new::bill', (err, data) => {

        action.insertBill(data);
        newBillWindow.getWindow().close();

        mainWindow.reload();
    });

    // Modificar bill

    ipcMain.on('open::modifyBill', (err, id) => {
        modBillWindow = windowModifyBill();
        modBillWindow.newWindow();
        params = id.id;
    });

    // Actual bill

    ipcMain.on('require::actualBill', () => {
        const window = modBillWindow.getWindow();
        action.selectBill(window, params);
    });

    // List 
    ipcMain.on('require::listStatusBillConditional', (err, item) => {
        const window = modBillWindow.getWindow();
        //console.log(item);
        action.selectStatusWhere(window, `id_estado != ${item.id_estado}`);
    });

    // actualiza bill

    ipcMain.on('update::bill', (err, item) => {
        const id = item.id;
        const data = {
            impuesto: item.impuesto,
            estado_id: item.estado_id,
            porcentaje: item.porcentaje
        };
        param = {};

        action.updateBill(id, data);

        modBillWindow.getWindow().close();
        mainWindow.reload();
    });

    /**
    *   @estado 
    */

    ipcMain.on('require::listStatusBranch', () => {
        const window = modBranchWindow.getWindow();
        action.selectStatus(window);
    });

    ipcMain.on('require::listStatusSponsor', () => {
        const window = modSponsorWindow.getWindow();
        action.selectStatus(window);
    });

    ipcMain.on('require::listStatusTypeProduct', () => {
        const window = modTypeProductWindow.getWindow();
        action.selectStatus(window);
    });

    ipcMain.on('require::listStatusBill', () => {
        const window = modBillWindow.getWindow();
        action.selectStatus(window);
    });

    /**
    *   @module reportes PDF
    */

    ipcMain.on('require::listSalesReport', () => {
        d = new Date();
        year = d.getFullYear();
        month = d.getMonth() + 1;
        ventas.totalMontly(mainWindow, month, year);
    });

    ipcMain.on('require::listSalesReportProduct', (err, id) => {
        ventas.listVentas(mainWindow, id);
    });

    ipcMain.on('require::reloadMain', () => {
        mainWindow.reload();
    });

    /**
    *   @module employer
    */

    ipcMain.on('open::new_employer', () => {
        newEmployer = windowEmployer();
        newEmployer.newWindow();
    });
    ipcMain.on('require::listAllEmployer', () => {
        action.selectEmployer(mainWindow);
    });
    ipcMain.on('require::listRoles', () => {
        action.selectRoles(newEmployer.getWindow());
    });
    ipcMain.on('new::employer', (err, item) => {
        action.insertEmployer(item);
        newEmployer.getWindow().close();
        mainWindow.reload();
    });
    ipcMain.on('require::actualEmployer', () => {
        action.selectEmployer(modEmployerWindow.getWindow(), params);
    });
    ipcMain.on('open::modifyEmployer', (err, item) => {
        params = item.id;
        modEmployerWindow = windowModifyEmployer();
        modEmployerWindow.newWindow();
    });
    ipcMain.on('require::listStatusEmployer', () => {
        action.selectStatus(modEmployerWindow.getWindow());
    });
    ipcMain.on('require::listRolesEmployer', () => {
        action.selectRoles(modEmployerWindow.getWindow());
    });
    ipcMain.on('modify::employer', (err, item) => {
        action.updateEmployer(item);
        modEmployerWindow.getWindow().close();
        mainWindow.reload();
    });

    // Deudores

    ipcMain.on('require::listAllDeudores', () => {
        action.selectDeudores(mainWindow);
    });
    ipcMain.on('open::new_deudor', () => {
        newDeudor = windowNewDeudor();
        newDeudor.newWindow();
    });
    ipcMain.on('require::listUserAllDeudor', () => {
        action.selectUser(newDeudor.getWindow());
    });
    ipcMain.on('new::deudor', (err, item) => {
        action.insertDeudor(item);
        newDeudor.getWindow().close();
        mainWindow.reload();
    });
    ipcMain.on('open::modifyDeudor', (err, id) => {
        params = id.id;
        modDeudorWindow = windowModifyDeudor();
        modDeudorWindow.newWindow();
    });
    ipcMain.on('require::actualDeudor', () => {
        action.selectDeudores(modDeudorWindow.getWindow(), params);
    });
    ipcMain.on('require::listStatusDeudor', () => {
        action.selectStatus(modDeudorWindow.getWindow());
    });
    ipcMain.on('update::deudor', (err, item) => {
        action.updateDeudor(item);
        modDeudorWindow.getWindow().close();
        mainWindow.reload();
    });
    ipcMain.on('require::allDeudorActive', (err, id) => {
        console.log(id);
        action.selectByUserId(modDeudorWindow.getWindow(), id.id);
    });

    mainWindow.on('closed', () => {
        app.quit();
    });
    
});

module.exports = {
    mainWindow
}