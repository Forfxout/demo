<template>
<fragment>
    <span v-for="item in textParts">
        <a
            v-if="item.type === 'url'"
            :href="item.text"
            target="_blank"
        >{{ item.text }}</a>

        <span
            v-else
            :style="{'color': item.type === 'match' ? 'black' : null}"
            :class="{
                'font-italic': item.type === 'match',
                'font-weight-black': item.type === 'match',
            }">{{ item.text }}</span>
    </span>
</fragment>
</template>

<script>
const urlRe = /((?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?)/gi;

const tagRe = /(<em>|<\/em>)/;

export default {
    name: 'HighlightedText',
    props: {
        text: String,
        highlightUrls: Boolean,
    },

    computed: {
        textParts() {
            const result = [];
            const parts = this.text.split(tagRe);
            parts.forEach((part, i) => {
                if (parts[i - 1] === '<em>' && parts[i + 1] === '</em>') {
                    result.push({ text: part, type: 'match' });
                } else if (part !== '<em>' && part !== '</em>') {
                    if (this.highlightUrls) {
                        result.push(...part.split(urlRe).map(p => ({ text: p, type: urlRe.test(p) ? 'url' : 'text' })));
                    } else {
                        result.push({ text: part, type: 'text' });
                    }
                }
            });
            return result.filter(p => p.text);
        },
    },
};
</script>
