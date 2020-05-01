import { interpolateSpectral } from 'd3-scale-chromatic';

export const getColor = interpolateSpectral;

export function getColorsMap(items, getter) {
    getter = getter || (item => item.id);
    const colors = {};
    items.forEach((item, index) => {
        colors[getter(item)] = getColor(index / items.length);
    });
    return colors;
}
