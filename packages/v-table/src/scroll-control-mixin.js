/*
 * Mouse scrolling, scroll bar changes
 * */

import utils from '../../src/utils/utils.js'

export default {
    methods: {
        mouseEnterBody2: function mouseEnterBody2(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            utils.bind(body2, 'scroll', this.body2Scroll);
        },
        mouseLeaveBody2: function mouseLeaveBody2(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            utils.unbind(body2, 'scroll', this.body2Scroll);
        },
        mouseEnterRightViewFooter: function mouseEnterRightViewFooter(e) {
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');
            utils.bind(rightViewFooter, 'scroll', this.rightViewFooterScroll);
        },
        mouseLeaveRightViewFooter: function mouseLeaveRightViewFooter(e) {
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');
            utils.unbind(rightViewFooter, 'scroll', this.rightViewFooterScroll);
        },
        body1Mousewheel: function body1Mousewheel(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            var e1 = e.originalEvent || window.event || e;
            var scrollHeight = e1.wheelDelta || e1.detail * -1;
            body2.scrollTop = body2.scrollTop - scrollHeight;
        },
        // Scroll the table to the top (common and paginated)
        bodyScrollTop() {
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');

            if (body1) {
                body1.scrollTop = 0;
            }

            body2.scrollTop = 0;
        },
        body2Scroll() {
            var view2 = this.$el.querySelector('.v-table-rightview');
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');

            if (body1) {
                body1.scrollTop = body2.scrollTop;
            }

            view2.querySelector('.v-table-header').scrollLeft = body2.scrollLeft;
            view2.querySelector('.v-table-rightview .v-table-footer').scrollLeft = body2.scrollLeft;
        },
        rightViewFooterScroll() {
            var view2 = this.$el.querySelector('.v-table-rightview');
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');

            view2.querySelector('.v-table-header').scrollLeft = rightViewFooter.scrollLeft;
            view2.querySelector('.v-table-body').scrollLeft = rightViewFooter.scrollLeft;
        },
        // Scroll bar control in list
        scrollControl() {
            this.unbindEvents();

            // Fix the problem that the left fixed column binding scroll event is invalid
            setTimeout(x => {
                var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
                var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
                var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');

                utils.bind(body1, 'mousewheel', this.body1Mousewheel);
                utils.bind(body2, 'mouseenter', this.mouseEnterBody2);
                utils.bind(body2, 'scroll', this.body2Scroll());
                utils.bind(body2, 'mouseleave', this.mouseLeaveBody2);
                utils.bind(rightViewFooter, 'mouseenter', this.mouseEnterRightViewFooter);
                utils.bind(rightViewFooter, 'mouseleave', this.mouseLeaveRightViewFooter);

                if (rightViewFooter) {
                    body2.classList.remove("v-scrollbar-wrap");
                }
            })
        },
        unbindEvents() {
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');

            utils.unbind(body1, 'mousewheel', this.body1Mousewheel);
            utils.unbind(body2, 'mouseenter', this.mouseEnterBody2);
            utils.unbind(body2, 'scroll', this.body2Scroll);
            utils.unbind(body2, 'mouseleave', this.mouseLeaveBody2);
            utils.unbind(rightViewFooter, 'mouseenter', this.mouseEnterRightViewFooter);
            utils.unbind(rightViewFooter, 'mouseleave', this.mouseLeaveRightViewFooter);
        },
        // External exposure method
        scrollToTop() {
            this.bodyScrollTop();
        }
    },
    beforeDestroy() {
        this.unbindEvents();
    }
}
