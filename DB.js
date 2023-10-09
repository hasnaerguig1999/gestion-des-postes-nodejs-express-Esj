const sqlconnection  = require('mysql');
const sqlDB =sqlconnection.createConnection({
  hos:"localhost",
  user:"root",
  password:"",
  database:"blog_nodejs",
  multipleStatements:true

});
sqlDB.connect((err)=>{
  if(!err){
    console.log('database connected');
  }else{
    console.log('database not connected' )
  }
  
});
module.exports=sqlDB;

