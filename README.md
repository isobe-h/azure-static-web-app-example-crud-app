
# azure-static-web-app-example-crud-app

**azure-static-web-app-example-crud-app** is an example project to learn how to develop Serverless SPA with Azure Static Web Apps.
This application has following features.

- User authentication(Azure AD, GitHub, Google)
- CRUD(create/read/upoload/delete) files into Azure Data Lake Storage Gen2

## Get Started

1. Clone & Open this repository
2. Create your Azure Static Web Apps (Need VSCode Azure Static Web Apps Extension)
   Click 'F1' and input 'Azure Static Web Apps' and then select 'Azure Static Web Apps(...Advanced)'
3. Create your Azure Data Lake Storage Gen2 and a container in it.
4. Enter your STORAGE_ACCOUNT_NAME,STORAGE_KEY to your "local.setting.json"
5. Enter your container name to "dlsg2.ts"
6. Install npm packages both root project and api project
7. Install CLI

   ```
   npm i -g @azure/static-web-apps-cli
   npm i -g azure-functions-core-tools@3 --unsafe-perm true

   ```

1. Start

   ```
   npm run build --prefix api
   swa start http://localhost:3000 --run 'npm start' --api api
   ```

## Components used in this application:

- Azure Static Web Apps
- Azure Data Lake Storage Gen2
- Create React App
- Material-UI
- Node.js
