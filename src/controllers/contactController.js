import {getConnection} from "../database/database.js"
import { s3methods as s3methods} from "../config/aws.config.js"

const getContacts = async (req, res) => {
    try{
        const connection = await getConnection();
        const arrayContacts = await connection.query("SELECT * from contact");

        // Utiliza Promise.all para manejar las llamadas en paralelo
        await Promise.all(arrayContacts.map(async (element) => {
            element.foto = await s3methods.getObjectURL(element.foto);
        }));

        res.render("contact", {
            listContacts: "Listado de contactos",
            arrayContacts,
        });
        
    }catch(err){
        res.send(err);
    }
}

const updateContact = async (req, res) => {
    try{
        const archivo = req.file;
        const key = Date.now() + '-' + archivo.originalname;
        const body = archivo.buffer;
  
        console.log("Key:", key);
  
        if (s3methods && s3methods.uploadImage) {
            try {
                console.log("INIT");
                await s3methods.uploadImage(key, body);

                const connection = await getConnection();

                await connection.query("UPDATE contact SET nombre = ?, apellido = ?, correo = ?, fecha_nac = ?, foto = ? WHERE id = ?", [req.body.nombre, req.body.apellido, req.body.correo, req.body.fecha_nac, key, req.params.id]);
                
                console.log("prueba");

                res.redirect("/api/contacts");
            } catch (uploadError) {
                res.status(uploadError.status || 500).json({ error: "Error", message: uploadError.message });
            }
        } else {
            res.status(500).send("Internal server error");
        }
    }catch(err){
        res.send(err);
    }
}

const deleteContact = async (req, res) => {
    try{
        const connection = await getConnection();
        await connection.query(`DELETE  from contact where id = ${req.params.id}`)
        res.redirect("/api/contacts")
    }catch(err){
        res.send(err);
    }
}

const addContact = async (req, res) => {
    try {
        const archivo = req.file;
        const key = Date.now() + '-' + archivo.originalname;
        const body = archivo.buffer;
  
        console.log("Key:", key);
  
        if (s3methods && s3methods.uploadImage) {
            try {
                await s3methods.uploadImage(key, body);

                const connection = await getConnection();

                await connection.query("INSERT INTO contact (nombre, apellido, correo, fecha_nac, foto) VALUES (?, ?, ?, ?, ?)",[req.body.nombre, req.body.apellido, req.body.correo, req.body.fecha_nac, key]);
    
                res.redirect("contacts");
            } catch (uploadError) {
                res.status(uploadError.status || 500).json({ error: "Error", message: uploadError.message });
            }
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (err) {
        console.error("Error ", err);
        res.status(500).send("Internal server error");
    }
  };

const getContact = async (req, res) => {
    try{
        const connection = await getConnection();
        const Contact = await connection.query(`SELECT * from contact where id = ${req.params.id}`);
        const arrayContacts = await connection.query("SELECT * from contact");

        // Utiliza Promise.all para manejar las llamadas en paralelo
        await Promise.all(arrayContacts.map(async (element) => {
            element.foto = await s3methods.getObjectURL(element.foto);
        }));

        let date = new Date(Contact[0].fecha_nac).toISOString();
        Contact[0].fecha_nac = date.substring(0,10);
        console.log(Contact);
        
        res.render("updatecontact", {
            listContacts: "Listado de contactos",
            Contact: Contact[0], 
            arrayContacts
        });

    }catch(err){
        res.send(err);
    }
}

const getContactByLastName = async (req, res) => {
    try{
        const connection = await getConnection();
        console.log(req.body)
        const Contact = await connection.query(`SELECT * from contact where apellido = '${req.body.apellido}'`);

        if (Contact.length === 0) {
            // No se encontraron resultados, puedes manejar esto según tus necesidades
            res.render("searchcontact", {
                listContacts: "Sin resultados",
                result: false
            });
            return;
        }

        // Utiliza Promise.all para manejar las llamadas en paralelo
        await Promise.all(Contact.map(async (element) => {
            element.foto = await s3methods.getObjectURL(element.foto);
            let date = new Date(element.fecha_nac).toISOString();
            element.fecha_nac = date.substring(0,10);
        }));
        
        res.render("searchcontact", {
            listContacts: `Búsqueda de contactos con apellido: ${req.body.apellido}`,
            arrayContacts: Contact, 
            result : true
        });
    }catch(err){
        res.send(err);
    }
}

const getContactByLastNameForm = async (req, res) => {
    try{
        res.render("searchcontact", {
            listContacts: "Búsqueda de contactos",
            result : false
        });
    }catch(err){
        res.send(err);
    }
}

export const methods = {
    getContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact,
    getContactByLastName,
    getContactByLastNameForm
}