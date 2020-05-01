/**
 * Define the chunk method in the prototype of an array
 * that returns an array with arrays of the given size.
 *
 * @param chunkSize {Integer} Size of every group
 */

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'chunk', {
    value(chunkSize) {
        const that = this;
        return Array(
            Math.ceil(that.length / chunkSize),
        )
            .fill()
            .map((_, i) => that.slice(i * chunkSize, i * chunkSize + chunkSize));
    },
});

export default {};
