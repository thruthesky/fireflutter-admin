# Firebase Admin

This project is for managing the firebase for `FireFlutter` project. But it can be used for serving the clients(members) of the app.

## Project Install

```
git clone https://github.com/thruthesky/fireflutter-admin
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

## Deployment

- You can build and deploy anywhere you want.
  - `npm run build`
  - Copy public folder to web server home folder.

### Firebase Hosting

To deploy fireflutter-admin to firebase, follow the instructions below.

- Edit firebase project id

```json
{
  "projects": {
    "default": "... Input your project id here ..."
  }
}
```

- Then run

```sh
firebase deploy --only hosting
```
