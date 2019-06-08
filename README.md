# Description

Serverless API built specifically for the "notes-app-client." Inspired by the project used on serverless-stack.com. 

# AWS Resources - Setup

The following resources will need to be configured to use this app. Currently this will need to be done manually. Future enhancement will include a Terraform script to automate this. 

- Configure and deploy a DynamoDB table, using default values except for 1) Table name = notes, 2) Partition Key = userId, and 3) Sort Key = noteId
- Configure and deploy an S3 bucket for uploads. Use default settings. Once created, enable CORS under Permissions -> CORS configuration. 

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

- Create and configure Cognito User Pool. Take note of your Pool Id and Pool ARN. Add an app client. Uncheck "Generate client secret" before creating. Take note of the App client id. Create a domain name for your app integration - either AWS-provided or on your own domain. This is for sign-up/ sign-in pages that are hosted by Amazon Cognito. 

- 