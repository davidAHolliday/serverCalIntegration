 
const { google } = require('googleapis'); 


const SCOPES = 'https://www.googleapis.com/auth/calendar'; 
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGNyK74QPOXI8Z\n/qkJA5U0NW9u7Q5ChGT1bmFTG43zKfJaKLCfVCElaHMOdA4DtFjzHrUhzEiykdRs\nBBL3jY850/fHyHsScTt8V05pHjHSkLGEuvfEoWGpb/Byz/lko1OU9djCgLmFmmft\nfhD7VGAdkihPB8PkA/sKM9XdVntCq9XWBIJv9a6WKeXVQ+wER7gS/SzMAHbbc4mA\nHDHKIsZGalQB8bIto3OUdKpa50tPtPO6YblVZjWeCfoOnbvnWFwL9gMsdg1yxXKs\nWGNSHDlcuzeen8F2zLCLGfz7mba9p0QKxB5+L8GhnEoUBEU4Bn0+EyQdn9abXg9R\nGZNq+2SlAgMBAAECggEAAvYi7OIFRQmJUnmau+7o7/FBG3ark7SCWk+5C4f/XHE1\nf5cDteBeExQsQpHa/b+C5AsC6MuHuzHw6wuP3vv8oQAOP9a6eVbmF8r+zxTrk0+k\ndK0NyPXM+D5Fvj67j/8ytKiMVwebqKfbF/zIsytFDlwMgcsbaFDjk3jydTlMDn3C\nWTpN2md0HHxH9UwAfiRCJrxoyFmg0wEdTQwPFh4ty6xOaM9PoqqNmV0bA+SgXMQ8\nL22lstnbyggfhuJba5IVJ2tSCr5Cs3fIeWYmTXSIAeTrRAi3vw01lkcPuB0SvfYN\n8QGg7ks7jqn85WhsMhLZmFCI8nQmBvMR8Deeo6UMoQKBgQDt1jk0Fchfea4sUiWP\nWf9HVAd8XgQUlRVnETTKi+BUrgY9Lp8qBsc6wRxZDs2SBfx6Pyxm4uxHAR0NTXb3\nk1g4uK7UDJ3IZCCC5UL5E2VKZ8rI7DyS3JESDpxYL58q89/vBVmXRx8h71V7Elq+\nnpLbJu5S32t3UXyxFTZ/8DyAEQKBgQDVWk1PpgwOxIja9P02lk3EXedOA6TXPNdH\nYr1c04UXenjlbN1f2fISEOfiLsgKwbL/KymGFVe7qNgf3Yx6Lur9PaDTsEI2v6Xd\n6HkPigLZlMoh1/8a95S8eA0MU9rGQZMRdv8XB/Y2iN55wi2Sq6dmLRJF+2FCSTOJ\nCT0B+wXvVQKBgQDsSnREqguLx6FiiS6l0F0OKY7SYbmeFUvRPUf8n6F9n/O031fk\nch2H4wnd9RYJqIbhkVf01Ci4loOdjsPOToZMvDd9lxc/WzLtuQaj3UA5/wp6OjIo\nGpjKntd3ycBR9T8bAm6zHEby+QwtHNwpG/R9ZJ1MmonzXnMKoC+oRi5lcQKBgFw+\nSbTJFud/o6f/SkdCnubqrqn1O1zv6ifsEfFDZoSrKAARnHjnsxiKhKcvEMBN1QUr\n9S0Kpz70llTYpfbhuCm7boB38XjYTW9vJoBIbEkEYoxVZe+T4ZPG1+Vfj/Qtv9dK\nOqoLgDE95eqAwNFsM9kiXYcyU2+kVIrIGr9zd7JtAoGAKClDwm7YG/fk49YJmtuN\n3YU28LdcP34a+kxNg2+8C4SrhGNrmfvqZIdxHpTlopGIHs7tfxi8ftUBDaI0Pkze\n+5d+NaWOUuYxXaYTDdlLaX3MQFEB6JFBKhhQ2Vg9Y4lCkIZ0jx3afWP3TG+nkvyx\nL4Nw1z/xTNNOkKAaPbI3pKg=\n-----END PRIVATE KEY-----\n";
const GOOGLE_PROJECT_NUMBER = "242540725411"
const GOOGLE_CALENDAR_ID = "dochollidayp@gmail.com"
const GOOGLE_CLIENT_EMAIL = "holliday99@active-apogee-421503.iam.gserviceaccount.com"


// Create a new JWT client using the given credentials
// Create a new JWT client using the given credentials

const unique = [
    {
      restRequiredLaborId: 1913267967,
      restaurantId: 201265,
      startDateTime: '2024-04-20T12:00:00',
      endDateTime: '2024-04-20T18:15:00',
      jobClass: 'TO GO Spec'
    },
    {
      restRequiredLaborId: 1913269554,
      restaurantId: 201265,
      startDateTime: '2024-04-27T11:00:00',
      endDateTime: '2024-04-27T16:00:00',
      jobClass: 'TO GO Spec'
    },
    {
      restRequiredLaborId: 1913269549,
      restaurantId: 201265,
      startDateTime: '2024-04-27T16:00:00',
      endDateTime: '2024-04-27T20:00:00',
      jobClass: 'TO GO Spec'
    },
    {
      restRequiredLaborId: 1918354608,
      restaurantId: 201265,
      startDateTime: '2024-05-04T11:00:00',
      endDateTime: '2024-05-04T16:00:00',
      jobClass: 'TO GO Spec'
    }
  ]


const jsonToEvent=(data)=>{
    const eventObj =  {
        summary: `Shift - ${data.jobClass}`,
        description: 'Olive Garden Work Shift',
        start: {
          dateTime: `${data.startDateTime}-05:00`,
          timeZone: 'America/Chicago',
        },
        end: {
          dateTime:  `${data.endDateTime}-05:00`,
          
          timeZone: 'America/Chicago',
        },
      }

      console.log("obj:",eventObj)

    return eventObj;

}




const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
  );


   const CreateGoogleEvent= async (res,data)=>{
    const eventToSend =jsonToEvent(data[0]);
    console.log('eventTOSend', eventToSend)


    try {
        // Authorize the JWT client
        await jwtClient.authorize();
    
        // Create a new instance of the Google Calendar API
        const calendar = google.calendar({
          version: 'v3',
          project: GOOGLE_PROJECT_NUMBER,
          auth: jwtClient,
        });
    
        // Define the event data
        const event = {
          calendarId: GOOGLE_CALENDAR_ID,
          resource: {
            summary: eventToSend.summary,
            description: eventToSend.description,
            start: {
              dateTime: eventToSend.start.dateTime,
              timeZone: 'America/Chicago',
            },
            end: {
              dateTime: eventToSend.end.dateTime,
              timeZone: 'America/Chicago',
            },
          },
        };
    
        // Insert the event into the calendar
        const createdEvent = await calendar.events.insert(event);
    
        res.send(JSON.stringify({ message: 'Event created successfully.', event: createdEvent.data }));
      } catch (error) {
        console.error('Error creating event:', error);
        res.send(JSON.stringify({ error: 'Error creating event.' }));
      }
  

}

module.exports = { CreateGoogleEvent };
