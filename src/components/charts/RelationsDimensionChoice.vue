<template>
<v-select
    :value="value"
    :items="items"
    v-on="$listeners"
    solo
/>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'RelationsDimensionChoice',
    props: {
        value: String,
    },

    data() {
        return this.mapState({
            lang: 'common.lang',
            ontologyACategories: 'common.ontologyACategories',
            ontologyCCategories: 'common.ontologyCCategories',
            relationsDimensionChoices: 'search.relationsDimensionChoices',
        });
    },

    computed: {
        items() {
            const output = this.relationsDimensionChoices.map(value => ({
                text: _.startCase(value),
                value,
            }));

            this.ontologyCCategories.forEach((item) => {
                output.push({
                    text: `${item.name[this.lang]} (concept category)`,
                    value: `concept_category:${item.id}`,
                });
            });

            this.ontologyACategories.forEach((item) => {
                output.push({
                    text: `${item.name[this.lang]} (author category)`,
                    value: `author_category:${item.id}`,
                });
            });

            return output;
        },
    },
};
</script>
