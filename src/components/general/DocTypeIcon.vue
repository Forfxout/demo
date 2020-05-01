<template>
<v-icon
    v-bind="$attrs"
    :title="docType"
>{{ icon }}</v-icon>
</template>

<script>
import {
    DOC_TYPE_TWITTER, DOC_TYPE_FACEBOOK, DOC_TYPE_WEB, DOC_TYPE_INSTAGRAM,
} from '@/lib/constants';


export default {
    name: 'DocTypeIcon',
    props: ['docType'],
    inheritAttrs: false,

    computed: {
        icon() {
            switch (this.docType) {
            case DOC_TYPE_TWITTER:
                return 'fab fa-twitter';
            case DOC_TYPE_FACEBOOK:
                return 'fab fa-facebook';
            case DOC_TYPE_INSTAGRAM:
                return 'fab fa-instagram';
            case DOC_TYPE_WEB:
                return 'fa-globe';
            default:
                return 'fa-file';
            }
        },
    },
};
</script>
