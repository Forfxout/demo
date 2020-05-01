<script>
import VSparkline from 'vuetify/lib/components/VSparkline/VSparkline';
import { genPath } from 'vuetify/lib/components/VSparkline/helpers/path';


// Use domain argument instead of [min(values), max(values)]
// Use logarithmic scale
function genPoints(values, boundary, domain) {
    const {
        minX, maxX, minY, maxY,
    } = boundary;
    const totalValues = values.length;
    const [minValue, maxValue] = domain;

    const gridX = (maxX - minX) / (totalValues - 1);
    const gridY = (maxY - minY) / ((Math.log(1 + maxValue) - Math.log(1 + minValue)) || 1);

    const res = values.map((value, index) => ({
        x: minX + index * gridX,
        y: maxY - (Math.log(1 + value) - Math.log(1 + minValue)) * gridY,
    }));
    return [{ x: minX, y: maxY - 0.00001 }, ...res, { x: maxX, y: maxY - 0.00001 }];
}


// Extend default VSparkline
// Allow passing fillColor and domain
export default {
    name: 'Sparkline',
    extends: VSparkline,
    props: {
        fillColor: String,
        domain: Array,
    },

    methods: {
        genPath() {
            const points = genPoints(this.normalizedValues, this.boundary, this.domain);

            return this.$createElement('path', {
                attrs: {
                    id: this._uid,
                    d: genPath(points, this._radius, this.fill, this.parsedHeight),
                    fill: this.fillColor || (this.fill ? `url(#${this._uid})` : 'none'),
                    stroke: this.fill ? 'none' : `url(#${this._uid})`,
                },
                ref: 'path',
            });
        },
    },
};
</script>
