const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//const fileUpload = require('express-fileupload');
const NavLinkService = require('../services/NavLinkService');
const navLinkService = new NavLinkService();
navLinkService.registerCustomLinks([
    // { "label": "Revocation", "url": "/revocation" },
]);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mv = require('mv');
router.use(express.urlencoded({extended:true}));
router.use(fileUpload());

router.use(function (req, res, next) {
    navLinkService.clearLinkClasses();
    navLinkService.setNavLinkActive('/revocation');
    next();
});

router.get('/', async function (req, res, next) {
    res.render('revocation', {
      navLinks: navLinkService.getNavLinks(),
      // customNavLinks: navLinkService.getCustomNavLinks(),
      // connections
    });
 });

//connect to ipfs node
//const ipfs = new ipfsClient({host: 'localhost', port:'5001',protocol:'http'});
async function ipfsClient() {
    const ipfs = await create(
      {
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https"
      }
    );
    return ipfs
}
  
async function saveText(){
let ipfs = await ipfsClient();

let result = await ipfs.add("hello");
console.log(result);
}
//saveText();
let data = {
name: "test",
version: "1.0"
}

async function saveFile(formData){


let ipfs = await ipfsClient();

let result = await ipfs.add({path: "crl.json",content:JSON.stringify(data)});
console.log(result);
}

//saveFile();

router.get('/upload', function(req,res) {
    res.render('upload');
})

router.post('/upload', async function (req,res) {
    const file = req.body.file;
    const fileName = req.body.fileName;
    const filePath = 'files/' + fileName;

    //upload file onto server
    //was file.mv
    await file.mv(filePath, async (err) => {
        if (err) {
        console.log('Error: failed to upload');
        return res.status(500).send(err);
        }

        const fileHash = await addFile(fileName, filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        })
        //res.redirect('/revocation');
        console.log('fileName: '+ fileName);
        console.log('fileHash: '+ fileHash);
        res.render('/upload', {fileName, fileHash});
    })
});

const addFile = async (fileName, filePath) => {
//file buffer
    const file = fs.readFileSync(filepath);

    const fileAdded = await ipfs.add({path: fileName, content: file});
    const fileHash = fileAdded[0].hash;

    return fileHash;
}






module.exports = router;