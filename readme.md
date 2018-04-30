#Kind Health Demo API
Demo app for kindHealth. NodeJS + Express + Joi + Mongoose + es6

##Install
###Project
`git bundle unbundle code_challenge.bdl`

###Dependencies
`npm install`

##Datastore
###Mongo URL
shh...its a secret
`mongodb://admin:admin@ds023445.mlab.com:23445/kindhealth`

##Run application

###Development
First create a `.env` file and assign the mongo url to the variable MONGO_URL.
To start app:
`npm start`

###Production
Be sure you have pm2 installed globally.
First build the project:
`npm run build`
Then to run in production:
`npm run prod`

##Notes 
To access the app on heroku, use the domain: `https://kindhealth-demo.herokuapp.com/`




