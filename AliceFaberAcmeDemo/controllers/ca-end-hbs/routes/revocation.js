const util = require('util');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const NavLinkService = require('../services/NavLinkService');
const navLinkService = new NavLinkService();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const { create } = require('ipfs-http-client');
const indy = require('indy-sdk');

navLinkService.registerCustomLinks([
    // { "label": "Revocation", "url": "/revocation" },
]);

const fileUpload = require('express-fileupload');
const fs = require('fs');
const mv = require('mv');

router.use(express.urlencoded({extended:true}));
router.use(fileUpload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.use(function (req, res, next) {
    navLinkService.clearLinkClasses();
    navLinkService.setNavLinkActive('/revocation');
    next();
});

router.get('/', async function (req, res, next) {
    res.render('revocation', {
      navLinks: navLinkService.getNavLinks(),
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

// router.get('/', function(req,res) {
//     res.render('revocation');
// })


// router.post('/upload', async function (req,res) {
//     //return res.json({status: OK});
//     var form = new multiparty.Form();
//     console.log(form);
//     console.log('test');
    // const file = req.files.newFile;
    // console.log(file);
    // //const file = req.files.file;
    // const fileName = req.body.fileName;
    // const filePath = 'files/' + fileName;

    // //upload file onto server
    // //was file.mv
    // await file.mv(filePath, async (err) => {
    //     if (err) {
    //     console.log('Error: failed to upload');
    //     return res.status(500).send(err);
    //     }

    //     const fileHash = await addFile(fileName, filePath);
    //     fs.unlink(filePath, (err) => {
    //         if (err) console.log(err);
    //     });
    //     res.redirect('/revocation');
    //     //console.log('fileName: '+ fileName);
    //     //console.log('fileHash: '+ fileHash);
    //     //res.render('/revocation', {fileName, fileHash});
    // });
    //res.render('/upload');
//});

router.post('/upload', (req,res) => {
    //req in JSON
    //console.log(req.body);
    
    sendNewCRL = req.body;
    //console.log(sendNewCRL);

    async function uploadNewCRL(){
        let ipfs = await ipfsClient();
        
        let result = await ipfs.add(JSON.stringify(sendNewCRL));
        console.log(result);
        return result;
        }
    
    let newCRLIpfsHash = uploadNewCRL();
    console.log(newCRLIpfsHash);

    //need my DID to build transaction

    //Open wallet and get handle from libindy
    //const walletHandle = await indy.openWallet(walletName, walletCredentials)

    //Building NYM request to add Trust Anchor to the ledger
    //const attribRequest = buildAttribRequest ( 'W1nqK2fiZn3KUivUuVSQjA', 'W1nqK2fiZn3KUivUuVSQjA', {"CRL":newCRLIpfsHash});

    //const nymRequest = await indy.buildNymRequest(/*submitter_did*/ stewardDid,
        ///*target_did*/ trustAnchorDid,
        ///*ver_key*/ trustAnchorVerkey,
        ///*alias*/ undefined,
        ///*role*/ 'TRUST_ANCHOR')

    //Sending NYM request to the ledger
    //await indy.signRequest();
    //await indy.signAndSubmitRequest(/*pool_handle*/ poolHandle,
        ///*wallet_handle*/ walletHandle,
        ///*submitter_did*/ stewardDid,
        ///*request_json*/ nymRequest)

});

const addFile = async (fileName, filePath) => {
//file buffer
    const file = fs.readFileSync(filePath);

    const fileAdded = await ipfs.add({path: fileName, content: file});
    const fileHash = fileAdded[0].hash;

    return fileHash;
}

module.exports = router;