module.exports = {
    presets: [
        '@vue/app',
        ['@babel/env', { modules: false }],
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
    env: {
        test: {
            presets: [
                ['@babel/env', { targets: { node: 'current' } }],
            ],
        },
    },
};
