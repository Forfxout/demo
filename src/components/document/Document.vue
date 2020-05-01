<template>
<v-card
    v-once
    outlined
    :ripple="false"
    :style="styleOverrides"
    :class="{
        document: true,
        animated: animated,
    }"
    @click.capture.stop="$emit('select', doc)"
>
    <div class="document-fade-wrapper">
        <doc-content :doc="doc" />
    </div>
</v-card>
</template>

<script>
import DocContent from '@/components/document/DocContent.vue';


export default {
    name: 'Document',
    props: ['doc', 'height', 'animated'],

    components: {
        DocContent,
    },

    data() {
        return {
            styleOverrides: this.height ? { height: `${this.height}px` } : {},
        };
    },
};
</script>

<style scoped lang="sass">
.document
    cursor: pointer
    overflow-y: hidden

.document-fade-wrapper
    height: 100%
    mask-image: linear-gradient(to bottom, black 85%, transparent 99%)

.animated
    animation-name: highlight
    animation-duration: 15s
    animation-timing-function: linear
    animation-iteration-count: 1
    animation-play-state: running

@keyframes highlight
    0%
        background-color: #ffbb5c
    100.0%
        background-color: #ffffff
</style>
