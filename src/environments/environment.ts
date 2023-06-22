// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { version } from '../../../../package.json'

export const environment = {
    production: false,

    SERVER_DOCS_URL: 'http://localhost:5291/',
    SERVER_API_URL: 'http://localhost:5291/',

    SERVER_PUBLIC_KEY:
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCXn1KW/Kxp3+1olLQuH7p71io4C0CKF61GySLQ29kOQ6uDQGmDLYof9oquHgAQp/ZHm/jVnthdmXG8iO4i8I/lIi1aQn34I9wn6HmBMRNUai59UuQlyPZDCTWk7EFz0gPwZ46aV/uWdMwCPk2Xn+OAejcESLBP3WG9HbTHo0/lQIDAQAB',

    appVersion: '1.2.3',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
