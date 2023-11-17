import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./src/config/config.js";
import contact from "./src/routes/contacts.routes.js"

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.set("views", __dirname+"/views");

app.get("/", (req, res) =>{
  res.render("index")
})

app.use("/api", contact)

app.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
});
