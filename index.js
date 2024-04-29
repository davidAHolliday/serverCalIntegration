const path = require('path');
const async = require('async');
const newman = require('newman');
const express = require('express'); 
const { CreateGoogleEvent } = require('./functions/googleEventCreator');
const puppeteer = require('puppeteer');
require("dotenv").config();




const app = express();
const port = parseInt(process.env.PORT) || 3000;

let SESSION_TOKEN = "wmvnCvxh/e0UhsjQ/5VfYWLk/VMFULVx7g9yE+4UwfDbO9S1FnoxsvDl6pJMSqB/rPPgx5L4FP5bYoTVCMM7yK+ZvTQj3rDJFo/9xedNYhE+zeKB0zI8m4pBeTmNnfhnC/6u+XGy8fTmqdj1IIw2X8uqzBHUNwk5J8OoPs+ptcAK9EzLVVXa5bI65mWeZdNkvZblAJUaXUsJD/XOb4id7JSxZBASoK8V8mXLsl0FFvgd/B/ZzWWS9ZcQy8EiofQIsDAs9ZI+oTfGl/iydznBTsg/ktakkivys8N9u4T/prM1jzO2Zd1XqDuQbRbeVvEHeUkQbC389kAPQfXn4Vb225Rt+20wtU8WUG/I7dx9Eyl0Sd8nzQIB4WBcUE0ZtziVTOaiBUQ6YUMHux/ECJyMXmxq7L+5lUfsKectlsZhY9gj9V//QMy1DPgigJAXvO4o73W2itIELkF6vi8y9lhKyexrwUjHHZhKk40SCsewa868Ay5MdrsAKRJtJEDSDLgyedDqbtY2UIlijIzSKb/YfoY1B8wM7W8o4LSALpvOmM++KWnuaHtPGiPgNwaIZYE/tvCploSSxAt9Rx2yDpsMp8uunyoazdz0G8mD1MH0MW834WUICIRmHK8gHY+BUgVuvQPQMHMEwOInnLWwNOuWhKNzRzfCnt9lrkdrZS7mMos/EKsQVpRCeqyLtI5/MXaHa+FaImj4eWy1TCs9HUMuuGuC862HFvmCqsOqSk+qq9Zfmbo0PJoizWkDFUALX+Apz4SIzw9FM2jqnHWaixpPYbPCHKsjCd9+zw9yi2ZW4kxNqAmsm/nCVyAyJ9JmScAIBTIKjXg6z+wBTdpUyPv4acMgnPprRLL8PxYkdI+BGdUuk160ChszsWL5dxW6XMSHXacLyYie+zzAf49Y0DoKxzKiX1f4H1abbX6w+PXg2OFQTGbSItZ0WRct8K3a3nkg/i3MHrLduragENp7YjVyzg30LSlLr5vF6xZaZQdvAicyA2K6bUPZ9yNXaVsILIYAHIBGblb27T5wcgCOf6OKcMwPJLTMDrpHCQ6u3pak1/R7Vf61UsxwCupDrKxKSfREL/+CVVorfh2G1vcomGNC41avvrulS9/0bvg/L9MtHAUhwjj6WUCdFERRnG4gqDY5QNOlM6liRJ/yIAphHheiITnAEtRGXVKaCJsZ5EoQnk6gpaaIQ0J/Ql2js11sUrTWdJqiYMLBhYh5gHG/8/Lc/5biDc0JztHQ2FACFuYAlSeIpeOQndUrbBrKJWn+Mhnt9z7lMVUFc72rBuDdZFY8eI2kjWnAyGW3"

const MAX_RETRY_ATTEMPTS = 3; // Define the maximum number of retry attempts

const browse = async (res, retryCount = 0) => {
    try {
        const browser = await puppeteer.launch({
            args: [
              "--disable-setuid-sandbox",
              "--no-sandbox",
              "--single-process",
              "--no-zygote",
            ],
            executablePath:
              process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
          });
             const page = await browser.newPage();

        // Navigate to the login page
        await page.goto('https://krowd.darden.com/krowd/#/home');

        // Get the page title before login
        let pageTitleBeforeLogin = await page.title();
        console.log('Page Title (Before Login):', pageTitleBeforeLogin);

        // Fill in the login credentials and submit the form
        await page.type('input[name="USER"]', 'DAP06275319');
        await page.type('input[name="PASSWORD"]', 'uuvntFJt8pbdrH2');
        await Promise.all([
            page.click('#btnLogin'), // Click the login button
            page.waitForNavigation(), // Wait for navigation to complete

        ]);

        // Define a function to check for the SMSESSION cookie
        const checkCookieAndRunCollection = async () => {
            const cookies = await page.cookies();
            console.log(cookies);
            const smSessionCookie = cookies.find(cookie => cookie.name === 'SMSESSION');

            if (smSessionCookie) {
                console.log('SMSESSION Cookie:', smSessionCookie.value);
                SESSION_TOKEN = smSessionCookie.value;
                await browser.close();
                runCollection(res);
            } else {
                console.error('SMSESSION Cookie not found.');
                await browser.close();
                if (retryCount < MAX_RETRY_ATTEMPTS) {
                    console.log(`Retrying (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
                    await browse(res, retryCount + 1);
                } else {
                    console.error('Max retry attempts reached. Exiting...');
                }
            }
        };

        // Wait for 5 seconds to allow time for cookies to load
        setTimeout(checkCookieAndRunCollection, 5000);
    } catch (error) {
        console.error('Error during browsing:', error);
    }

    
};




//For Postman

const runCollection = (res)=>{

const PARALLEL_RUN_COUNT = 1;

const collections = [   
    'collections/darden.postman_collection', 
]

const environments = [
    'environments/darden.postman_environment.json',
];

const environment = environments[0];
const collectionToRun = [];

const sessionTokenValue = `SMSESSION=${SESSION_TOKEN}`;
const date = '2024-04-08'


//proejct number : 219584338724

for (let index = 0; index < collections.length; index++) {
    collectionToRun[index] = {
        //  collection : path.join("/usr/src/app/", collections[index]), 
        collection: path.join(__dirname, collections[index]), 
        // environment: path.join(__dirname, environment), 
        reporters: ['cli'],
        bail: newman,
        envVar:  [
            {
                "key": "variable_key",
                "value": "",
                "type": "any",
                "enabled": true
            },
            {
                "key": "workWeek",
                "value": date,
                "type": "any",
                "enabled": true
            },
            {
                "key": "shiftsData",
                "value": "",
                "type": "any",
                "enabled": true
            },
            {
                "key": "session_token",
                "value": sessionTokenValue,
                "type": "default",
                "enabled": true
            }
        ]
    };
};





parallelCollectionRun = function (done) {
    for (let index=0; index < collectionToRun.length; index++){
        newman.run(collectionToRun[index], 
            function (err) {
                if (err) { throw err; }
                console.log(collections[index]+' collection run complete!');
            }).on('test',(error,data)=>{

                if(error){
                    console.log(error);
                    return;

                }
                var shiftData = data.executions[0].result.environment.values.reference.shiftsData.value
                const arrayShift = JSON.parse(shiftData);
                const uniqueShifts = arrayShift.filter((shift, index, self) =>
                  index === self.findIndex((s) => s.restRequiredLaborId === shift.restRequiredLaborId)
                );

            


                     CreateGoogleEvent(res, uniqueShifts);




            });
    }
    
    done;
};

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
};

async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);
        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
    });

});

}


  

app.get('/poll', async (req, res) => {
    await browse(res);
    // CreateGoogleEvent(res, [])
  });

  app.get('/run', async (req, res) => {
    runCollection(res)
  });



  app.get('/', async (req, res) => {
    console.log("HELLO DAVID")
    // CreateGoogleEvent(res, [])
  });
  



 
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));