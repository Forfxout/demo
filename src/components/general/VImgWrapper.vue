<script>
import VImg from 'vuetify/lib/components/VImg';

export default VImg.extend({
    name: 'VImgWrapper',
    methods: {
        onError() {
            this.$emit('error', this.src);
        },
    },
});
</script>
