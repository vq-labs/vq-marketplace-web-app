# VQ Marketplace - Web App
Storefront for your Sharing Economy Marketplace (https://vqmarketplace.com).
## Installation
```
npm install
npm install gulp -g
```

## Running
Review .env.example file and make necessary changes first then rename it to .env file. You should not commit this file because it might contain sensitive information, therefore we have an ignore rule in .gitignore so if you want to commit that, remove that from .gitignore

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

To try it out and start up quickly and connect to an existing marketplace https://talentwand.de, enter:
```
npm run start:talentwand (or npm run start --marketplace yourMarketplaceId)
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
gulp deploy
```

# Environments

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

## Support
https://vqlabs.freshdesk.com/support/home

## MIT License
https://vqmarketplace.com