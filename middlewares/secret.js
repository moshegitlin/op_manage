require('dotenv').config()
exports.config = {
    tokenSecret:process.env.TOKEN_SECRET,
    db_pass:process.env.DB_PAS,
    db_user:process.env.DB_USER
}