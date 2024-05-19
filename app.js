const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {routesInit} = require("./routes/configRoutes");
require("./db/mongoConnect");
const app = express();
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));


routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port);
