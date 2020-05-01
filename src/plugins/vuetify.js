import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Intersect } from 'vuetify/lib/directives';
import '@fortawesome/fontawesome-free/css/all.css';
import colors from 'vuetify/lib/util/colors';


Vue.use(Vuetify, {
    directives: {
        Intersect,
    },
});

export default new Vuetify({
    icons: {
        iconfont: 'fa',
    },
    theme: {
        themes: {
            light: {
                brand: colors.lightGreen.lighten1,

                // Change default colors
                primary: colors.blue.darken3,
                secondary: colors.blueGrey.darken3,
                accent: colors.blue.accent2,

                // Ontology colors
                concept: colors.lightGreen,
                topic: colors.teal,

                // Doc type colors
                twitter: '#1da1f2',
                facebook: '#4267b2',
                instagram: '#C13584',
                web: colors.green,
            },
        },
    },
});
