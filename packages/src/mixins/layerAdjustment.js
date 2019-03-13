import utils from '../utils/utils'

var __autoAdjustment__events__ = [];

export default {
    methods: {

        /*
         * Automatically adjust the floating layer (no binding event)
         *
         * @method layerAdjustmentBind
         * @param  {Dom}        layerElement        Floating layer element
         * @param  {Dom}        targetElement       Control element
         * @param  {Number}     distance            Upper and lower spacing of floating layer elements and control elements
         */
        layerAdjustmentOnce(layerElement, targetElement, distance) {

            var viewportOffset = utils.getViewportOffset(targetElement),
                layerElemHeight = typeof layerElement.getBoundingClientRect !== "undefined" ? layerElement.getBoundingClientRect().height : layerElement.clientHeight,
                layerElemWidth = typeof layerElement.getBoundingClientRect !== "undefined" ? layerElement.getBoundingClientRect().width : layerElement.clientWidth;

            if (viewportOffset.bottom < layerElemHeight) {

                layerElement.style.top = (viewportOffset.top - layerElemHeight - distance) + 'px';
            } else {

                layerElement.style.top = (viewportOffset.top + targetElement.clientHeight + distance) + 'px';
            }

            if ((viewportOffset.left+ layerElemWidth + distance) > window.innerWidth) {
                layerElement.style.left = (viewportOffset.left - layerElemWidth) + 'px';
            } else {
                layerElement.style.left = viewportOffset.left + 'px';
            }
        },

        /*
         * Automatically adjust the floating layer when scrolling
         *
         * @method layerAdjustmentBind
         * @param  {Dom}        layerElement        Floating layer element
         * @param  {Dom}        targetElement       Control element
         * @param  {Number}     distance            Upper and lower spacing of floating layer elements and control elements
         */
        layerAdjustmentBind(layerElement, targetElement, distance) {

            var handler = (e) => {

                setTimeout(x => {

                    this.layerAdjustmentOnce(layerElement, targetElement, distance);
                })
            }

            __autoAdjustment__events__.push(handler);
            utils.bind(window, 'scroll', handler);
            utils.bind(window, 'resize', handler);

        }
    },
    beforeDestroy() {

        utils.unbind(window, 'scroll', __autoAdjustment__events__);
        utils.unbind(window, 'resize', __autoAdjustment__events__);

    }
}
