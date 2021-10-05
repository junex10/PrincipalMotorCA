const mysql = require('mysql');
const { dialog, app } = require('electron');

const connectDb = () => {

    this.connection;
    return {
        connect: () => {
            this.connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'principal_motor_ca'
            });
            this.connection.connect((err) => {
                if (err) {
                    dialog.showErrorBox('¡Ops!', 'Hubo un problema al conectarse a la base de datos');
                    app.quit();
                }
            });
            return this.connection;
        },
        get: () => {
            return this.connection;
        },
        end: () => {
            this.connection.end();
            return this.connection;
        }
    }
};

module.exports = {
    connectDb
}