//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require("express");
var app = express();
var utils = require("./mysql-connector");

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================

// Obtener todos los dispositivos
app.get("/device/", function (req, res) {
    utils.query("SELECT * FROM Devices", (error, respuesta, fields) => {
        if (error) {
            res.status(409).send(error.sqlMessage);
        } else {
            res.status(200).send(respuesta);
        }
    });
});

// Obtener un determinado dispositivo
app.get("/device/:id", function (req, res) {
    utils.query(
        "SELECT * FROM Devices where id=" + req.params.id,
        (error, respuesta, fields) => {
            if (error) {
                res.status(409).send(error.sqlMessage);
            } else {
                res.status(200).send(respuesta);
            }
        }
    );
});

// Insertar un nuevo dispositivo
app.post("/device/", function (req, res) {
    if (
        req.body.name != undefined &&
        req.body.description != undefined &&
        req.body.state != undefined &&
        req.body.type != undefined
    ) {
        utils.query(
            "INSERT INTO Devices (name, description, state, type) values('" +
            req.body.name +
            "','" +
            req.body.description +
            "'," +
            req.body.state +
            "," +
            req.body.type +
            ")",
            (err, resp, meta) => {
                if (err) {
                    res.status(409).send(err.sqlMessage);
                } else {
                    res.status(204).send(resp);
                }
            }
        );
    } else {
        res.status(400).send("Error en los datos");
    }
});


// Actualizar el estado de un dispositivo
app.put('/device/state/', function (req, res) {
    utils.query("update Devices set state=" + req.body.state + " where id=" + req.body.id,
        (err, resp, meta) => {
            if (err) {
                res.status(409).send(err.sqlMessage);
            } else {
                res.status(204).send(resp);
            }
        })
})

// Actualizar los datos de un dispositivo
app.put("/device/", function (req, res) {
    if (
        req.body.id != undefined &&
        req.body.name != undefined &&
        req.body.description != undefined &&
        req.body.type != undefined
    ) {
        utils.query(
            "update Devices set name='" +
            req.body.name +
            "', description='" +
            req.body.description +
            "' , type='" +
            req.body.type +
            "'where id=" +
            req.body.id,
            (err, resp, meta) => {
                if (err) {
                    res.status(409).send(err.sqlMessage);
                } else {
                    res.status(204).send(resp);
                }
            }
        );
    } else {
        res.status(400).send(JSON.stringify(res.error));
    }

});

// Eliminar un dispositivo
app.delete('/device/', function (req, res) {

    utils.query("delete from Devices where id=" + req.body.id,
        (err, resp, meta) => {
            if (err) {
                res.status(409).send(err.sqlMessage);
            } else {
                res.status(204).send(resp);
            }
        })

})

// Mensaje inicial
app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});
