# VQ Marketplace - Web App

## Technology stack

## Configuration

## Deployment
AWS credentials can be provided via environment variables, or in the ~/.aws/credentials file. More details here: http://docs.aws.amazon.com/cli/latest/topic/config-vars.html. Please make sure to define a default in your AWS credentials, this will help prevent a Missing Credentials error during deployment.

The following command will prepare, build and deploy the app to S3 bucket:
```
gulp deploy
```

Make sure that you have s3-deploy installed globally:
```
npm install s3-deploy --g
```

## MIT License