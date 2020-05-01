# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npx vue-cli-service serve
```

### Run for Staging to work with data from Staging API
```
npx vue-cli-service serve --mode staging
```

### Compiles and minifies for production
```
npx vue-cli-service build
```

### Lints and fixes files
```
npx vue-cli-service lint
```

### Run tests
```
npx vue-cli-service test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Countries TopoJSON

`frontend/src/assets/countries_full.topo.json` contains all countries with full data.
`frontend/src/assets/countries.topo.json` contains only name and ISO code.

If you need more feature, update and run command:
```
python -m tools.dev_countries_topojson frontend/src/assets/countries_full.topo.json frontend/src/assets/countries.topo.json
```

Initial GeoJSON is loaded from [here](https://geojson-maps.ash.ms/).

### Useful links to read

- https://www.learnrxjs.io/
- http://reactivex.io/rxjs/manual/index.html
- https://rxmarbles.com/
- https://material.io/
- https://vuetifyjs.com/en/getting-started/quick-start
