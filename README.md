# VQ Marketplace - Web App

## Technology stack
React

## Installation
```
git clone https://github.com/vq-labs/vq-marketplace-web-app
cd vq-marketplace-web-app
npm install
```

## Running
This will start the app on localhost:3000. The app will assume that the [VQ-MARKETPLACE-API](https://github.com/vq-labs/vq-marketplace-api) is available at http://localhost:8080.
```
npm run start:local
```

## Configuration

## Deployment
Make sure that you have s3-deploy installed globally:
```
npm install s3-deploy --g
```

AWS credentials can be provided via environment variables, or in the ~/.aws/credentials file. More details here: http://docs.aws.amazon.com/cli/latest/topic/config-vars.html. Please make sure to define a default in your AWS credentials, this will help prevent a Missing Credentials error during deployment.

The following command will prepare, build and deploy the app to S3 bucket:
```
AWS_BUCKET_NAME=xxx.vq-labs.com \
AWS_REGION=eu-central-1 \
VQ_API_URL=xxx-api.vq-labs.com \
VQ_LANG=en \
GOOGLE_ANALYTICS_ID=xxxx \
gulp deploy
```

## MIT License