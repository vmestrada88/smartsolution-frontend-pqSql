/* Disable AWS SDK in production */
if (typeof window !== 'undefined' && window.location.hostname.includes('amplifyapp.com')) {
  window.AWS = undefined;
  window.AWSConfig = undefined;
}
/**This code disables the AWS SDK in the browser if the application is running 
on an AWS Amplify domain (amplifyapp.com).
It is only necessary if you want to prevent the AWS SDK from being available 
in production for security reasons or to avoid conflicts.
If your application does not use AWS directly in the frontend, you can safely remove it. */