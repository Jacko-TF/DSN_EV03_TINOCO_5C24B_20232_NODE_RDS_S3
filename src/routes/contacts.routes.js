import {Router} from "express"
import { methods as contactController } from "../controllers/contactController.js"

const router = Router();
const multer  = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/images'); // Directorio donde se guardarán los archivos
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
//     }
//   });

const storage = multer.memoryStorage();
  
const upload = multer({ storage: storage })

router.get("/contacts", contactController.getContacts);
router.post("/contact", upload.single('file') ,contactController.addContact);
router.post("/contact/update/:id", upload.single('file') , contactController.updateContact);
router.post("/contact/delete/:id", contactController.deleteContact);
router.get("/contact/:id", contactController.getContact)
router.post("/contact/search", contactController.getContactByLastName)
router.get("/contacts/search", contactController.getContactByLastNameForm)


export default router;