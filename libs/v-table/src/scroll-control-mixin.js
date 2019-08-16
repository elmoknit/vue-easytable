'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../../src/utils/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    methods: {
        mouseEnterBody2: function mouseEnterBody2(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            _utils2.default.bind(body2, 'scroll', this.body2Scroll);
        },
        mouseLeaveBody2: function mouseLeaveBody2(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            _utils2.default.unbind(body2, 'scroll', this.body2Scroll);
        },
        mouseEnterRightViewFooter: function mouseEnterRightViewFooter(e) {
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');
            _utils2.default.bind(rightViewFooter, 'scroll', this.rightViewFooterScroll);
        },
        mouseLeaveRightViewFooter: function mouseLeaveRightViewFooter(e) {
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');
            _utils2.default.unbind(rightViewFooter, 'scroll', this.rightViewFooterScroll);
        },
        body1Mousewheel: function body1Mousewheel(e) {
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            var e1 = e.originalEvent || window.event || e;
            var scrollHeight = e1.wheelDelta || e1.detail * -1;
            body2.scrollTop = body2.scrollTop - scrollHeight;
        },
        bodyScrollTop: function bodyScrollTop() {
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');

            if (body1) {
                body1.scrollTop = 0;
            }

            body2.scrollTop = 0;
        },
        body2Scroll: function body2Scroll() {
            var view2 = this.$el.querySelector('.v-table-rightview');
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');

            if (body1) {
                body1.scrollTop = body2.scrollTop;
            }

            view2.querySelector('.v-table-header').scrollLeft = body2.scrollLeft;
            view2.querySelector('.v-table-rightview .v-table-footer').scrollLeft = body2.scrollLeft;
        },
        rightViewFooterScroll: function rightViewFooterScroll() {
            var view2 = this.$el.querySelector('.v-table-rightview');
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');

            view2.querySelector('.v-table-header').scrollLeft = rightViewFooter.scrollLeft;
            view2.querySelector('.v-table-body').scrollLeft = rightViewFooter.scrollLeft;
        },
        scrollControl: function scrollControl() {
            var _this = this;

            this.unbindEvents();

            setTimeout(function (x) {
                var body1 = _this.$el.querySelector('.v-table-leftview .v-table-body');
                var body2 = _this.$el.querySelector('.v-table-rightview .v-table-body');
                var rightViewFooter = _this.$el.querySelector('.v-table-rightview .v-table-footer');

                _utils2.default.bind(body1, 'mousewheel', _this.body1Mousewheel);
                _utils2.default.bind(body2, 'mouseenter', _this.mouseEnterBody2);
                _utils2.default.bind(body2, 'scroll', _this.body2Scroll());
                _utils2.default.bind(body2, 'mouseleave', _this.mouseLeaveBody2);
                _utils2.default.bind(rightViewFooter, 'mouseenter', _this.mouseEnterRightViewFooter);
                _utils2.default.bind(rightViewFooter, 'mouseleave', _this.mouseLeaveRightViewFooter);

                if (rightViewFooter) {
                    body2.classList.remove("v-scrollbar-wrap");
                }
            });
        },
        unbindEvents: function unbindEvents() {
            var body1 = this.$el.querySelector('.v-table-leftview .v-table-body');
            var body2 = this.$el.querySelector('.v-table-rightview .v-table-body');
            var rightViewFooter = this.$el.querySelector('.v-table-rightview .v-table-footer');

            _utils2.default.unbind(body1, 'mousewheel', this.body1Mousewheel);
            _utils2.default.unbind(body2, 'mouseenter', this.mouseEnterBody2);
            _utils2.default.unbind(body2, 'scroll', this.body2Scroll);
            _utils2.default.unbind(body2, 'mouseleave', this.mouseLeaveBody2);
            _utils2.default.unbind(rightViewFooter, 'mouseenter', this.mouseEnterRightViewFooter);
            _utils2.default.unbind(rightViewFooter, 'mouseleave', this.mouseLeaveRightViewFooter);
        },
        scrollToTop: function scrollToTop() {
            this.bodyScrollTop();
        }
    },
    beforeDestroy: function beforeDestroy() {
        this.unbindEvents();
    }
};