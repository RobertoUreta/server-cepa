import mysql = require('mysql');

export default class MySQL{
    private static _instance: MySQL;

    conexion: mysql.Connection;
    conectado: boolean = false;
    constructor(){
        console.log('Clase inicializada');
        this.conexion = mysql.createConnection({
            host     : 'dbases2.utalca.cl',
            user     : 'u_cmrcepa2',
            password : 'p_CR..19EVv',
            database : 'db_crmcepa2',
            multipleStatements: true
          });

          this.conectarDB();
    }

    //Usar solo una instancia de conexion de bd
    public static get instance(){
        return this._instance || (this._instance = new this() );
    }
    public static ejecutarQuery(query: string, callback: Function){
        this.instance.conexion.query(query, (err,results:Object[], fields)=>{
            if(err){
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }
            if (results.length === 0) {
                callback('El registro solicitado no existe');
            }else{
                callback(null, results);
            }
            
        });

    }

    private conectarDB(){
        this.conexion.connect((err: mysql.MysqlError)=>{
            if (err) {
                console.log(err.message);
                return;
            }
            this.conectado=true;
            console.log('Base de datos online!');
        });
    }
}