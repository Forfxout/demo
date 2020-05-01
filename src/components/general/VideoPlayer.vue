<script>
import 'dplayer/dist/DPlayer.min.css';
import DPlayer from 'dplayer';


export default {
    name: 'VideoPlayer',
    props: {
        // See http://dplayer.js.org/guide.html#options
        options: {
            type: Object,
        },
    },

    data() {
        return {
            dp: null,
        };
    },

    mounted() {
        this.createPlayer();
    },

    watch: {
        options() {
            this.dp.destroy();
            this.createPlayer();
        },
    },

    render(h) {
        return h('div', {
            class: 'dplayer',
        }, []);
    },

    methods: {
        createPlayer() {
            this.options.container = this.$el;
            this.dp = new DPlayer(this.options);
        },
    },
};
</script>
