<template>
<!-- Show empty div in any case to keep layout  -->
<div class="d-inline">
    <a
        v-if="url && displayName"
        :href="url"
        target="_blank"
        class="subtitle-1"
    >
        <v-icon x-small color="primary">fa-user</v-icon>
        {{ displayName }}
    </a>
    <span v-else-if="displayName" class="subtitle-1">
        <v-icon x-small>fa-user</v-icon>
        {{ displayName }}
    </span>
</div>
</template>

<script>
import { DOC_TYPE_TWITTER } from '@/lib/constants';


export default {
    name: 'DocAuthor',
    props: ['doc'],

    computed: {
        url() {
            if (this.doc.type === DOC_TYPE_TWITTER && this.doc.author_username) {
                return `https://twitter.com/${this.doc.author_username}/`;
            }
            return null;
        },

        displayName() {
            return this.doc.author_name || this.doc.author_username || this.doc.author_id;
        },
    },
};
</script>

<style scoped lang="sass">
a
    text-decoration: none
</style>
