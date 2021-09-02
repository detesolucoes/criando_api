const express = require('express');
const app = express();

const http = require("http");
const puppeteer = require('puppeteer'); // npm i puppeteer
const delay = require('delay'); // npm install delay
const path = require('path');
const mkdirp = require('mkdirp'); // npm install mkdirp
const serveIndex = require('serve-index');
var fs = require('fs');
//onst bodyParser = require("body-parser");

//app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    '/reports',
    express.json(),
    express.static('reports'),
    serveIndex('/reports', {icons: true})
    );

app.get("/", (req, res) => {
    res.send("Indrodução a API");
});

app.get("/pdf", (req, res) => {
    
});

app.post("/post", (req, res) => {
    //return 'ok';
    return res.json({teste:"ok"});
});

app.post("/post2", (req, res) => {
    return res.json(req.body.key);
});

app.post("/pref", (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({
            // executablePath: '/usr/bin/chromium-browser',
          headless: true,
        });
      
        const page = await browser.newPage();
      
      
         console.log('iniciando...');
         res.send("Iniciando a API");
        
        // const url1 = req.body.url1;
        // const url2 = req.body.url2;
        await page.goto(req.body.url2);
        console.log('passando pela url 1...');
      
        await delay(3000);
        console.log('delay de 3 segundos...');
      
        // const downloadUrl = req.body.url3;
        // const downloadUrl2 = req.body.url4;
      
        await page.goto(req.body.url4);
      
        /**
      * @param {page from where you want to download file } page
      * @param {downloadLocation , directory where you want to save a file } downloadLocation
      */
      async function downloadFile(page, downloadLocation){
        console.log('criando diretório '+downloadLocation+'...');
          const downloadPath = path.resolve(downloadLocation)
          mkdirp(downloadPath)
        //   console.log('Downloading file to:', downloadPath)
          await page._client.send('Page.setDownloadBehavior', {
              behavior: 'allow',
              downloadPath: downloadPath,
              })
      }
      
      /**
      * @param {url} url of your file
      * @param {downloadLocation , directory where you want to save a file with file name and extenshion} downloadLocation
       */
      async function downloadFileFromURL(url, downloadLocation){
          try {
              const fetch = require('node-fetch');
              const { writeFile } = require('fs');
              const { promisify } = require('util');
              const writeFilePromise = promisify(writeFile);
              await fetch(url)
                  .then(x => x.arrayBuffer())
                  .then(x => {writeFilePromise(downloadLocation, Buffer.from(x));console.log(`File Downlaoded From URL: ${downloadLocation}`)});
          } catch (error) {
              throw new Error(error)
          }
      }
     
    //   const directoryFiles = 'reports';
      
      await downloadFile(page, req.body.directoryFiles);
      
        // console.log('passando pela url 2...');
        // console.log('pagina carregada...');  

        console.log('informando credenciais...');
        await page.type('[name="User"]', req.body.user1);
        await page.type('[name="Password"]', req.body.pass2);
        await page.click('[value="View Report"]');
      
        // console.log('finalizando...');
      
        await delay(5000);
        console.log('delay de 5 segundos...');
      
        // const baseDirectory = 'D:/wamp/www/nodejs/logando-no-site/';
        // const file = req.body.file;
      
        fs.rename(__dirname+'/'+req.body.directoryFiles+'/reportviewer.pdf', __dirname+'/'+req.body.directoryFiles+'/'+req.body.file, function(err) {
          if ( err ){ 
              console.log('ERROR: ' + err);
              return;
            }
      });

      console.log('fechando browser...');
      await browser.close();

      const pathFile = __dirname+'/'+req.body.directoryFiles+'/'+req.body.file;

    try {
        console.log('entrando no try...');
        if (fs.existsSync(pathFile)) {
            // return res.json({teste:"ok"});
            console.log("Relatório gerado com sucesso");

            const ftp = require('./FTPClient');
            const client = new ftp('ftp.detesolucoes.com.br', 21, 'rootftp@detesolucoes.com.br', '%M+DQc83=W6#', false);

            client.upload(pathFile, 'public_html/'+req.body.file, 755);

            return res.json({status: "success", message: "Relatório gerado com sucesso", file: pathFile, error: null});
        }
    } catch(err) {
        console.log('entrando no catch...');
        console.log(pathFile);
        console.error("Ops! "+err)
        
        return res.json({status: "error", message: "Erro ao gerar relatório", file: null, error: err});
    }
      
        
      })();

      
    
    
});

app.listen(3333, () => {
    console.log("Servidor iniciado na porta.");
});


