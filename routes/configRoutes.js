const indexR = require("./index");
const usersR = require("./users");
const oppR = require("./opportunities");
exports.routesInit = (app) => {
    app.use("/",indexR);
    app.use("/users",usersR);
    app.use("/opp",oppR);
    app.use("*",(req,res) => {
        res.status(404).json({msg:"Page/endpoint not found, 404"})
    })
}