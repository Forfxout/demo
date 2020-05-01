<template>
<l-map
    ref="map"
    :zoom.sync="zoom"
    :center="center"
    :options="mapOptions"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
>
    <l-tile-layer
        :url="tileOptions.url"
        :attribution="tileOptions.attribution"
        :opacity="tileOptions.opacity"
    />

    <l-control position="topright">
        <div>Found {{ documentsTotal }} documents</div>
    </l-control>

    <l-control
        position="bottomleft"
    >
        <charts-group-by-select @change="loadData" />
    </l-control>
</l-map>
</template>

<script>
import _ from 'lodash';
import L from 'leaflet';
import omnivore from '@mapbox/leaflet-omnivore';
import { LMap, LTileLayer, LControl } from 'vue2-leaflet';

import { mapActions } from '@/store';
import contriesData from '@/assets/countries.topo.json';
import ChartsGroupBySelect from '@/components/charts/ChartsGroupBySelect.vue';

const GROUP_BY_TOPICS = 'topics';

export default {
    name: 'MapPanel',
    components: {
        LControl,
        LMap,
        LTileLayer,
        ChartsGroupBySelect,
    },

    data() {
        return {
            zoom: 3,
            center: [0, 0],
            minZoom: 2,
            maxZoom: 6,
            mapOptions: {
                maxBounds: [[-70, -180], [80, 180]],
                scrollWheelZoom: false,
            },

            tileOptions: {
                // You can find other here: http://leaflet-extras.github.io/leaflet-providers/preview/
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                opacity: 0.4,
            },

            // TODO: Change pie chart size on zoom to make small one more visible
            minPieChartRadius: 15,
            maxPieChartRadius: 55,

            ...this.mapState({
                colorsConcepts: 'common.colorsConcepts',
                colorsTopics: 'common.colorsTopics',
                countries: 'common.countries',
                lang: 'common.lang',
                mapCountries: 'search.mapCountries',
                documentsTotal: 'search.documentsTotal',
                chartsGroupBy: 'search.chartsGroupBy',
            }),
        };
    },

    mounted() {
        const map = this.$refs.map.mapObject;
        // Fix map container size detection
        map.invalidateSize();

        // Create Pie Charts layers
        this.pieChartsLayer = new L.FeatureGroup();
        map.addLayer(this.pieChartsLayer);
        L.control.layers({}, { Charts: this.pieChartsLayer }, { collapsed: false })
            .addTo(map);
        this.countriesLayer = null;

        // Load data on start
        if (this.mapCountries === null) {
            this.loadData();
        } else {
            this.renderMap();
        }
    },

    watch: {
        mapCountries(data) {
            this.renderMap();
        },
    },

    computed: {
        maxDocCount() {
            return _.maxBy(
                Object.values(this.mapCountries),
                item => item.doc_count,
            ).doc_count;
        },

        countryColors() {
            return new L.CustomColorFunction(
                1, this.maxDocCount, L.ColorBrewer.Sequential.Greens[9], {
                    interpolate: true,
                },
            );
        },

        isGroupByTopic() {
            return this.chartsGroupBy === GROUP_BY_TOPICS;
        },
    },

    methods: {
        ...mapActions({
            doMapUpdate: 'search/doMapUpdate',
            doSearchOnMap: 'search/doSearchOnMap',
            setFilterValue: 'search/setFilterValue',
            setQueryTopics: 'search/setQueryTopics',
            setQueryConcepts: 'search/setQueryConcepts',
        }),

        loadData() {
            // TODO: Use explicit date filter to have same result for both searches
            this.doMapUpdate();
            this.doSearchOnMap();
        },

        findCountry(code) {
            return this.mapCountries.find(
                item => item.code.toLowerCase() === code.toLowerCase(),
            );
        },

        renderMap() {
            const map = this.$refs.map.mapObject;
            this.pieChartsLayer.clearLayers();

            if (this.countriesLayer) {
                map.removeLayer(this.countriesLayer);
            }

            const customLayer = L.geoJson(null, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', this.countriesOnClick);
                    const marker = this.pieChartMarker(feature, layer);
                    if (marker) {
                        marker.addTo(this.pieChartsLayer);
                    }
                },
                filter: this.countriesFilter,
                style: this.countriesStyle,
            }).bindTooltip(this.countriesTooltip, {
                direction: 'top',
                sticky: true,
            });

            this.countriesLayer = omnivore.topojson.parse(contriesData, null, customLayer);
            map.addLayer(this.countriesLayer);
            this.countriesLayer.bringToBack();

            const bounds = this.pieChartsLayer.getBounds();
            // Bounds are empty if there are no any data and pie charts
            if (bounds.isValid()) {
                map.fitBounds(bounds.pad(0.2));
            }
        },

        pieChartMarker({ properties }, layer) {
            const center = properties.coords || layer.getBounds().getCenter();
            const countryName = properties.name;
            const country = this.findCountry(properties.iso_a2);
            const countryData = this.isGroupByTopic ? country.topics : country.concepts;
            const colors = this.isGroupByTopic ? this.colorsTopics : this.colorsConcepts;

            if (countryData.length === 0) {
                return null;
            }

            const options = {
                data: {},
                chartOptions: {},
                radius: this.pieChartRadius(country),
                fillOpacity: 1,
                opacity: 0,
                tooltipOptions: {
                    iconSize: new L.Point(20, 20),
                },
            };

            countryData.forEach((item) => {
                const info = this.isGroupByTopic ? item.topic : item.concept;
                options.data[info.id] = item.doc_count;
                options.chartOptions[info.id] = {
                    displayName: `${info.name[this.lang]}(${countryName})`,
                    fillColor: colors[info.id],
                    ontologyObject: item,
                };
            });

            const pieMarker = new L.PieChartMarker(center, options);
            pieMarker.on('click', this.pieChartOnClick);
            return pieMarker;
        },

        pieChartRadius(data) {
            const delta = this.maxPieChartRadius - this.minPieChartRadius;
            return this.minPieChartRadius + delta * data.doc_count / this.maxDocCount;
        },

        pieChartOnClick({ layer }) {
            const { key, chartOptions } = layer.options;
            const { ontologyObject } = chartOptions[key];

            if (this.isGroupByTopic) {
                this.setQueryTopics([ontologyObject.topic]);
            } else {
                this.setQueryConcepts([ontologyObject.concept]);
            }
            this.loadData();
        },

        countriesStyle({ properties }) {
            const country = this.findCountry(properties.iso_a2);
            return {
                color: this.countryColors.evaluate(country.doc_count),
                stroke: false,
                fillOpacity: 0.7,
            };
        },

        countriesTooltip({ feature }) {
            const country = this.findCountry(feature.properties.iso_a2);
            return `${feature.properties.name}: ${country.doc_count} documents`;
        },

        countriesFilter({ properties }) {
            return Boolean(this.findCountry(properties.iso_a2));
        },

        countriesOnClick({ target }) {
            this.setFilterValue(['geoCountry', [target.feature.properties.iso_a2]]);
            this.loadData();
        },
    },
};
</script>
