<template>
<fragment>
    <v-card-subtitle class="pb-0 d-flex align-center">
        <span
            v-if="doc.publishing_date"
            class="subtitle-2 mr-2 mr-auto"
        >
            <v-icon x-small>fa-calendar</v-icon>
            {{ doc.publishing_date | moment("DD/MM/YYYY HH:mm") }}
        </span>

        <span
            v-else
            class="subtitle-2 mr-2 mr-auto"
        >
            <v-tooltip bottom>
                <template #activator="{ on }">
                    <v-icon
                        color="warning"
                        x-small
                        v-on="on"
                    >fa-calendar</v-icon>
                </template>

                <span>Indexing date</span>
            </v-tooltip>
            {{ doc.indexing_date | moment("DD/MM/YYYY HH:mm") }}
        </span>

        <v-btn
            v-if="doc.video"
            :href="doc.video"
            target="_blank"
            color="primary"
            class="ml-1"
            icon
            x-small
        >
            <v-icon>fa-video</v-icon>
        </v-btn>

        <v-btn
            v-if="doc.permalink"
            :href="doc.permalink"
            target="_blank"
            color="primary"
            class="ml-1"
            icon
            x-small
        >
            <v-icon>fa-external-link-alt</v-icon>
        </v-btn>
    </v-card-subtitle>

    <v-card-subtitle class="pt-1 pb-0 d-flex align-center">
        <doc-author
            :doc="doc"
            class="mr-2 mr-auto"
        />

        <doc-type :type="doc.type" />

        <v-chip
            v-for="lang in doc.native_languages"
            :key="lang"
            class="ml-1"
            color="blue-grey darken-1"
            title="Language"
            label
            outlined
            x-small
        >{{ lang }}</v-chip>

        <v-chip
            v-if="doc.geo_country"
            title="Country"
            class="ml-1"
            x-small
        >{{ doc.geo_country }}</v-chip>
    </v-card-subtitle>

    <v-card-subtitle
        v-if="ontology.length"
        class="pt-1 pb-0 align-center"
    >
        <v-chip
            v-for="item in ontology"
            :key="item.id"
            :color="item.color"
            :title="item.tooltip"
            class="mr-1"
            outlined
            x-small
        >{{ item.text }}</v-chip>
    </v-card-subtitle>

    <v-card-title
        v-if="title"
        class="doc-title subtitle-1 font-weight-bold pt-1 pb-0"
        style="display: block;"
    >
        <highlighted-text
            :text="title"
        />
    </v-card-title>

    <v-card-text class="pt-1">
        <video-player
            v-if="detailed && doc.video"
            :options="videoPlayerConfig"
        />
        <v-img-wrapper
            v-else-if="doc.preview_image"
            :src="doc.preview_image"
            max-width="150"
            max-height="150"
            contain
            class="float-left mr-1"
        />

        <highlighted-text
            :text="body"
            :highlightUrls="detailed"
        />

        <div
            v-if="detailed && showTranslation"
            class="translated-text">
            <v-card-title
                v-if="translatedTitle"
                class="doc-title subtitle-1 font-weight-bold pt-1 pb-0">
                {{translatedTitle}}
            </v-card-title>
            <v-card-text
                v-if="translatedBody">
                {{translatedBody}}
            </v-card-text>
        </div>

        <div>
            <v-btn
                @click="onClick"
                v-if="detailed && !doc.native_languages.includes(lang)"
                x-small
                text
                color="primary"
            >
                <span
                    v-if="showTranslation">hide translation
                </span>
                <span
                    v-else>show translation
                </span>
            </v-btn>
        </div>
    </v-card-text>
</fragment>
</template>

<script>
// NOTE: Do not use tooltip and menu in this component. There is a bug with virtual scroll.
// Tooltip uses code `window.pageYOffset || document.documentElement.scrollTop` and this
// triggers onScroll event with wrong `top` value of virtual scroll container.
// In the right way `top` is decreased when you scroll top and `paddingTop` is changed to
// keep visible container on the right place.
// When `window.pageYOffset || document.documentElement.scrollTop`
// is triggered `onScroll` with increased offset.
import he from 'he';
import { mapActions } from '@/store';

import DocAuthor from '@/components/document/DocAuthor.vue';
import DocType from '@/components/document/DocType.vue';
import HighlightedText from '@/components/document/HighlightedText.vue';
import VideoPlayer from '@/components/general/VideoPlayer.vue';
import VImgWrapper from '@/components/general/VImgWrapper.vue';


export default {
    name: 'DocContent',
    props: {
        doc: Object,
        detailed: Boolean,
    },
    components: {
        DocAuthor,
        DocType,
        HighlightedText,
        VideoPlayer,
        VImgWrapper,
    },
    methods: {
        ...mapActions({
            toggleShowTranslation: 'search/toggleShowTranslation',
            getTranslation: 'search/getTranslation',
        }),
        onClick() {
            if (!this.showTranslation) {
                if (!this.doc.body[this.lang]) {
                    this.getTranslation();
                }
            }
            this.toggleShowTranslation();
        },
    },

    data() {
        return this.mapState({
            lang: 'common.lang',
            showTranslation: 'search.showTranslation',
        });
    },

    computed: {
        docLang() {
            return this.doc.native_languages[0];
        },

        translatedTitle() {
            let translatedTitle;
            if (this.showTranslation && this.doc.title[this.lang]) {
                translatedTitle = this.doc.title[this.lang];
            } else {
                translatedTitle = '';
            }
            return he.decode(translatedTitle);
        },

        title() {
            let title;
            if (this.doc.highlight && this.doc.highlight.title[this.docLang]) {
                title = this.doc.highlight.title[this.docLang];
            } else {
                title = this.doc.title[this.docLang];
            }
            return he.decode(title);
        },

        translatedBody() {
            let translatedBody;
            if (this.showTranslation && this.doc.body[this.lang]) {
                translatedBody = this.doc.body[this.lang];
            } else {
                translatedBody = '';
            }
            return he.decode(translatedBody);
        },

        body() {
            let body;
            if (this.doc.highlight && this.doc.highlight.body[this.docLang]) {
                body = this.doc.highlight.body[this.docLang];
            } else {
                body = this.doc.body[this.docLang];
            }
            return he.decode(body);
        },

        topics() {
            if (this.detailed) {
                return this.doc.topics;
            }
            return this.doc.topics.slice(0, 3);
        },

        concepts() {
            if (!this.doc.concepts) {
                return [];
            }

            const concepts = this.doc.concepts.title;
            this.doc.concepts.body.forEach((concept) => {
                if (!concepts.find(c => c.id === concept.id)) {
                    concepts.push(concept);
                }
            });

            if (this.detailed) {
                return concepts;
            }
            return concepts.slice(0, 5);
        },

        ontology() {
            const output = [];

            this.topics.forEach(topic => output.push({
                id: topic.id,
                text: topic.name[this.lang],
                color: 'topic',
                tooltip: 'Topic',
            }));

            this.concepts.forEach(concept => output.push({
                id: concept.id,
                text: concept.name[this.lang],
                color: 'concept',
                tooltip: 'Concept',
            }));

            return output;
        },

        videoPlayerConfig() {
            return {
                video: {
                    url: this.doc.video,
                    pic: this.doc.cover_image,
                    thumbnails: this.doc.preview_image,
                },
            };
        },
    },
};
</script>

<style scoped lang="sass">
.doc-title
    word-break: break-word
.translated-text
    border-left: 4px solid gray
</style>
