# VQ Marketplace - Web App
Storefront for your Sharing Economy Marketplace (https://vqmarketplace.com). Runs on React (no Redux yet)

## Installation
Clone the repository into your local developement envirment.
```
git clone https://github.com/vq-labs/vq-marketplace-web-app.git     // clones the repository from remote
cd vq-marketplace-web-app   // goes to the repository folder
npm install     // installs the npm packages from ./package.json
```

## Running
Review .env.example file and make necessary changes first then rename it to .env file. You should not commit this file because it might contain sensitive information, therefore we have an ignore rule in .gitignore so if you want to commit that, remove that from .gitignore

```
ENV=production  //if you run it with an env other than production,
                //npm start will also watch for file changes and restart.
PORT=4000
API_URL=http://localhost:8080/api   //this is the API url that you connect to.
                                    //If you run vq-marketplace-platform API, you can leave it as it is
TENANT_API_URL=http://localhost:8081/api    //this is the URL that manages multi-tenancy.
                                            //If you specify TENANT_ID it means you are only running one tenant 
                                            //therefore you can leave this as it is
TENANT_ID=test  //this is the TENANT_ID, in other terms the name of the marketplace that you want to setup.
                //can be anything. only accepts slug-style.
                //By default, all the TENANT_ID in all parts of the app (API, WEB-APP) are test.
                //If you change it please make sure that all your env files on every repository
                // related to this project has the same TENANT_ID
```

This will start the app on localhost:3000. The app will assume that the [VQ-MARKETPLACE-API](https://github.com/vq-labs/vq-marketplace-api) is available at http://localhost:8080.
```
npm start
```

## Integrating with an existing marketplace
VQ MARKETPLACE enables you to work on your own marketplace storefront while still using the official VQ web services.
You can always connect to the marketplace that is hosted by VQ-LABS. You just need to adjust the VQ_API_URL when you build the application.
```
npm start
```

To try it out and start up quickly and connect to an existing marketplaces, enter:
```
// starts rental marketplace TaskBee (ala TaskRabbit)
npm run start:taskbee

// starts rental marketplace AirHome (ala AirBnB)
npm run start:airhome

// starts offers marketplace Talentwand (ala Fiverr)
npm run start:talentwand
```

## Connect to existing API:
```
node ./node_modules/gulp/bin/gulp.js build --API_URL=https://taskrabbit.vqmarketplace.com/api && node scripts/start.js
```

## Deployment
You can host your files with Amazon S3. Make sure that you have s3-deploy installed globally:
```
npm install s3-deploy --g
```

AWS credentials can be provided via environment variables, or in the ~/.aws/credentials file. More details here: http://docs.aws.amazon.com/cli/latest/topic/config-vars.html. Please make sure to define a default in your AWS credentials, this will help prevent a Missing Credentials error during deployment.
Altenratively, you can use the wizard from aws:
```
aws configure
```

The following command will prepare, build and deploy the app to S3 bucket:
```
AWS_BUCKET_NAME=xxx.vqmarketplace.com \
AWS_REGION=eu-central-1 \
VQ_API_URL=yourMarketplaceId.vqmarketplace.com \ 
npm run deploy
```

## Environments

We have tested the application in these environments but a .nvmrc and package.json engines have been setup for you to take a hint on:
(If you use NVM, you can do nvm use which will take .nvmrc file into account)
(If you want to install Node and NPM manually you can check the engines in package.json)

NodeJS 7.2.1 and NPM 3.10.9 on macOS Sierra 10.12.6,
NodeJS 8.3.0 and NPM 5.6 on Windows 10,
NodeJS 9.0.0 and NPM 5.5.1 on AWS Linux Ubuntu 16.04.2

## Technology stack
React
## Browser support
***Chrome*** (latest version)<br />
***Safari*** (latest version)<br />

***Support Internet Explorer and Microsoft Edge (latest versions)***
VQ Marketplace Web-App aims to also run on the latest version of Internet Explorer. However, the current developments are not specifically tested in this browser. Please submit issues on our support page.

***Mobile support***
VQ Marketplace Web-App is not developed with the full support for mobile screens, as mobile apps are offered by VQ LABS separately. The current developments are not specifically tested on mobile screens.
<br />
However, the web app aims to be work accross a range of mobile devices and screen-sizes. Please submit issues on our support page.

# Support
https://vqlabs.freshdesk.com/support/home

# Contribute
We follow the following branching model:
[http://nvie.com/posts/a-successful-git-branching-model/](http://nvie.com/posts/a-successful-git-branching-model/)

# License
MIT

# Contributors
[VQ LABS](https://vq-labs.com)