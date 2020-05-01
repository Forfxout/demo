<template>
<v-progress-linear
    v-if="loading"
    :indeterminate="true"
    class="ma-0 loading-progress"
/>
</template>

<script>
export default {
    name: 'LoadingIndicator',

    data() {
        return this.mapState({
            loading: 'common.loading',
        });
    },
};
</script>

<style scoped lang="sass">
.loading-progress
    z-index: 1
    position: fixed
</style>
