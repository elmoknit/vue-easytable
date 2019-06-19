import utils from '../../src/utils/utils.js'

export default {
    data() {
        return {
            scrollbarWidth: 0
        }
    },
    methods: {
        // If there is a footer, the horizontal scroll bar is reflected on the footer.
        controlScrollBar() {
            if (this.hasTableFooter) {
                var body = this.$el.querySelector('.v-table-rightview .v-table-body');
                body.style.overflowX = 'hidden';
            }
        },
        setScrollbarWidth() {
            this.scrollbarWidth = utils.getScrollbarWidth();
        }
    }

}
