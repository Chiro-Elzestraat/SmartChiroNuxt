# SmartChiro

> Platform dat het beheren van alle informatie en inschrijvingen van leden & evenementen op 1 plaats bundelt.

## Meewerken?
### Build Setup

Je moet een self signed certificate aanmaken om de frontend op HTTPS te draaien.
Voer daarom volgend commando uit in de command line en vul de nodige velden met zelf gekozen waarden in.:

``` bash
openssl req -x509 -out server.crt -keyout server.key   -newkey rsa:2048 -nodes -sha256
```

Meer info op https://letsencrypt.org/docs/certificates-for-localhost/

``` bash
# dependencies installeren (dit commando moet je als eerste na een clone van deze repo uitvoeren)
$ npm run install

# locale dev server draaien op localhost:3000
$ npm run dev

# bouwen voor productie --> dit maakt de folder `dist` aan, deze kan je kopieëren naar een statische server.
$ npm run build
```

Voor een gedetailleerde uitleg over hoe dingen werken, bekijk de [Nuxt.js docs](https://nuxtjs.org).
