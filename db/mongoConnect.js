// getting-started.js
const mongoose = require('mongoose');
const {config} = require('../middlewares/secret')

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_pass}@cluster0.1j8lzuz.mongodb.net/op_manage`);
    console.log('mongo connected');
}
