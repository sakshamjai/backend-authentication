const app = require('./src/app.js');
const connectToDB = require('./src/config/db.js');
require('dotenv').config();
connectToDB();
app.listen(3000, ()=>{
    console.log('Server is running...');
})