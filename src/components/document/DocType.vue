<template>
<v-chip
    title="Document type"
    :color="color"
    outlined
    x-small
>{{ type }}</v-chip>
</template>

<script>
import {
    DOC_TYPE_TWITTER, DOC_TYPE_FACEBOOK, DOC_TYPE_WEB, DOC_TYPE_INSTAGRAM,
} from '@/lib/constants';


export default {
    name: 'DocType',
    props: ['type'],

    computed: {
        color() {
            switch (this.type) {
            case DOC_TYPE_TWITTER:
                return 'twitter';
            case DOC_TYPE_FACEBOOK:
                return 'facebook';
            case DOC_TYPE_INSTAGRAM:
                return 'instagram';
            case DOC_TYPE_WEB:
                return 'web';
            default:
                return 'blue-grey';
            }
        },
    },
};
</script>
