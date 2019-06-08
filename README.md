# Description

Serverless API built specifically for the "notes-app-client." Inspired by the project used on serverless-stack.com. 

## Current Deployed Endpoints

- POST - https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/notes
- GET - https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/notes/{id}  
- GET - https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/notes
- PUT - https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/notes/{id}  
- DELETE - https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/notes/{id}

# Setup

## AWS Resources

The following resources will need to be configured to use this app. Currently this will need to be done manually. Future enhancement will include a Terraform script to automate this. 

- Configure and deploy a DynamoDB table, using default values except for 1) Table name = notes, 2) Partition Key = userId, and 3) Sort Key = noteId
- Configure and deploy an S3 bucket for uploads. Use default settings. Once created, enable CORS under Permissions -> CORS configuration. 

```
<CORSConfiguration>
	<CORSRule>
		<AllowedOrigin>*</AllowedOrigin>
		<AllowedMethod>GET</AllowedMethod>
		<AllowedMethod>PUT</AllowedMethod>
		<AllowedMethod>POST</AllowedMethod>
		<AllowedMethod>HEAD</AllowedMethod>
		<AllowedMethod>DELETE</AllowedMethod>
		<MaxAgeSeconds>3000</MaxAgeSeconds>
		<AllowedHeader>*</AllowedHeader>
	</CORSRule>
</CORSConfiguration>
```

- Create and configure Cognito User Pool. Take note of your Pool Id and Pool ARN. Add an app client. Uncheck "Generate client secret" before creating. Take note of the App client id. Create a domain name for your app integration - either AWS-provided or on your own domain. This is for sign-up/ sign-in pages that are hosted by Amazon Cognito. 

- Create and configure Cognito Identity Pool. Under Authentication providers -> Cognito tab, enter the User Pool ID and App Client ID of your User Pool. Edit the policy document for authenticated identities as follows (replacing S3 bucket name, api gateway region, and api gateway ID with your own): 

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_S3_UPLOADS_BUCKET_NAME/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke"
      ],
      "Resource": [
        "arn:aws:execute-api:YOUR_API_GATEWAY_REGION:*:YOUR_API_GATEWAY_ID/*/*/*"
      ]
    }
  ]
}
```

## Serverless API 

- Run "serverless deploy" 

# Testing

## Local

- Invoke local tests using the following command (Replace the function and path with whatever function/ data is being tested. Note: You will also need to create a note and use its id in the JSON mocks.): 
$ serverless invoke local --function create --path mocks/create-event.json

## Live

- Use the following to test against your deployed API, updating values with your own. Also note that this test was run using Git Bash on Windows. If you are using Command Prompt or another terminal, you may have to experiment with adding a leading slash to --path-template and also removing the trailing slash from the -invoke-url. 

```
npx aws-api-gateway-cli-test --username="admin@example.com" --password="Passw0rd!" --user-pool-id="USER_POOL_ID" --app-client-id="APP_CLIENT_ID" --cognito-region="us-east-1" --identity-pool-id="IDENTITY_POOL_ID" --invoke-url="https://jhdpxm3s7k.execute-api.us-east-1.amazonaws.com/prod/" --api-gateway-region="us-east-1" --path-template="notes" --method="POST" --body="{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}"
```