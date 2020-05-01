<script>
import _ from 'lodash';

// Extend default VCombobox to keep text input
// TODO: It would be better to write own input component without all these hacks
import VCombobox from 'vuetify/lib/components/VCombobox/VCombobox';


export default {
    name: 'ComboboxWithTextInput',
    extends: VCombobox,
    props: {
        queryInput: {
            type: String,
            default: undefined,
        },
    },

    data() {
        return {
            searchInputVal: this.queryInput,
        };
    },

    created() {
        // Remove isFocused watcher from VAutocomplete. It triggers search on blur and this
        // leads to redirect to the Search page. By default we have autofocus on Search input
        // on all pages, so when you click anywhere, you trigger search and redirect to search page.
        const isFocusedWatcher = _.findLast(this._watchers, watcher => watcher.expression === 'isFocused');
        isFocusedWatcher.teardown();

        this.$watch('isFocused', (val) => {
            if (val) {
                document.addEventListener('copy', this.onCopy);
            } else {
                document.removeEventListener('copy', this.onCopy);
            }

            // Move cursor to the end to allow user continue typing
            if (val && this.$refs.input) {
                this.$refs.input.select();
                this.$refs.input.selectionStart = this.searchInputVal.length;
                this.$refs.input.selectionEnd = this.searchInputVal.length;
            }
        });
    },

    watch: {
        queryInput(val) {
            this.searchInputVal = val;
        },
    },

    computed: {
        // Default component always tries to reset search input.
        // Use searchInputVal instead default lazySearch to keep text input
        internalSearch: {
            get() {
                return this.searchInputVal;
            },

            set(val) {
                this.searchInputVal = val;
                this.$emit('update:query-input', val);
            },
        },
    },

    methods: {
        getCursorPosition() {
            return this.textInput.elm.selectionStart;
        },

        genInput() {
            // Save text input to get cursor position
            this.textInput = VCombobox.options.methods.genInput.call(this);
            return this.textInput;
        },

        closeMenu() {
            this.isMenuActive = false;
        },

        // This method by default tries to reset text input.
        // We want to keep text input, so just mock this method.
        setSearch() {},

        // FIXME: Clear text input on suggestion select. Now this may clear whole query.
        //        Add more clever decision
        // selectItem(item) {
        //     // If user select some suggested item, clear search input
        //     if (typeof item !== 'string') {
        //         this.internalSearch = null;
        //     }
        //     VCombobox.options.methods.selectItem.call(this, item);
        // },

        updateTags() {
            // Copy of default methods without text input clearing

            const menuIndex = this.getMenuIndex(); // If the user is not searching
            // and no menu item is selected
            // do nothing
            if (menuIndex < 0 && !this.searchIsDirty) return;

            if (this.editingIndex > -1) {
                this.updateEditing();
                return;
            }

            const index = this.selectedItems.indexOf(this.internalSearch);
            // If it already exists, do nothing
            // this might need to change to bring
            // the duplicated item to the last entered

            if (index > -1) {
                const internalValue = this.internalValue.slice();
                internalValue.splice(index, 1);
                this.setValue(internalValue);
            } // If menu index is greater than 1
            // the selection is handled elsewhere
            // TODO: find out where

            if (menuIndex > -1) return;
            this.selectItem(this.internalSearch);
        },
    },
};
</script>
