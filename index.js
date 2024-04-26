const path = require('path');
const async = require('async');
const newman = require('newman');
const express = require('express'); 
const { CreateGoogleEvent } = require('./functions/googleEventCreator');



const app = express();
const port = 3000;


let SESSION_TOKEN =""

let SHIFTDATA = [];

//Login and session cookie
const puppeteer = require('puppeteer');

const browse = async (res) => {
    try {
      const browser = await puppeteer.launch();
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
        page.waitForNavigation(), // Wait for navigation to complete
        page.click('#btnLogin'), // Click the login button
      ]);
  
  
      // Access and log the cookies
      setTimeout(async () => {
        const cookies = await page.cookies();
        // SM cookie is the first one
        console.log('Cookies:', cookies[0].value);
        SESSION_TOKEN = cookies[0].value;
        await browser.close();
  
        // After closing the browser, call runCollection
        runCollection(res);
  
      }, 7000);
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
        collection: path.join(__dirname, collections[index]), 
        environment: path.join(__dirname, environment), 
        reporters: ['cli','htmlextra','junit'],
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







//Date is (YYYY-MM-DD)

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


  







const  obj = {
  summary: 'Shift - TO GO Spec',
  description: 'Olive Garden Work Shift',
  start: {
    dateTime: '2024-04-20T12:00:00-05:00',
    timeZone: 'America/Chicago'
  },
  end: {
    dateTime: '2024-04-20T18:15:00-05:00',
    timeZone: 'America/Chicago'
  }
}
  
app.get('/', async (req, res) => {
    await browse(res);
    // CreateGoogleEvent(res, [])
  });
  

 
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));