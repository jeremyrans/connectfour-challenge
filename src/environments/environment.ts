// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBxhXVS53o4iSp3Ou7sXwOL0dyRVg5Q6Wk',
    authDomain: 'connectfour-challenge.firebaseapp.com',
    databaseURL: 'https://connectfour-challenge.firebaseio.com',
    projectId: 'connectfour-challenge',
    storageBucket: 'connectfour-challenge.appspot.com',
    messagingSenderId: '739640933230'
  }
};
