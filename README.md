# static-web-app-example-crud-app

static-web-app-example-crud-app is an example project uses Azure Static Web Apps.
This application has following features.

- User authentication(Azure AD, GitHub, Google)
- CRUD(create/read/upoload/delete) files to Azure Data Lake Storage Gen2

## Get Started

1. Clone this repository
1. Open the repository
1. Create your Azure Data Lake Storage Gen2 and a container in it.
1. Enter your STORAGE_ACCOUNT_NAME,STORAGE_KEY to your "local.setting.json" & ".env"
1. Enter your container name to "dlsg2.ts"
1. Install npm packages both root project and api project
1. Install CLI

   ```
   npm install -g @azure/static-web-apps-cli
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
- Material UI
- Node.js
