/* eslint-disable global-require, func-names, no-underscore-dangle, no-prototype-builtins */
import { Icon, Path, setOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-dvf';

// Overwrite some styles
import '@/styles/leaflet.sass';

// Fix https://github.com/Leaflet/Leaflet/issues/6662
Path.prototype.setStyle = function (style) {
    setOptions(this, style);
    if (this._renderer) {
        this._renderer._updateStyle(this);
        if (this.options.stroke && style && style.hasOwnProperty('weight')) {
            this._project();
        }
    }
    return this;
};

// this part resolve an issue where the markers would not appear
// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
