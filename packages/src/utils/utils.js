import settings from '../settings/settings'

export default {
    /* Get the left and top offset of the current element
        * left: the leftmost distance of the element from the left side of the document
        * top: the distance from the top of the element to the top of the document
        * right: the distance from the right side of the document to the right of the document
        * bottom: the distance from the bottom of the element to the bottom of the document
        * right2: the distance from the left side of the document to the right of the document
        * bottom2: the bottom of the element is the distance from the bottom of the document
        * */
    getViewportOffset(element) {
        var doc = document.documentElement,
            box = typeof element.getBoundingClientRect !== "undefined" ? element.getBoundingClientRect() : 0,
            scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
            scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
            offsetLeft = box.left + window.pageXOffset,
            offsetTop = box.top + window.pageYOffset;

        var left = offsetLeft - scrollLeft,
            top = offsetTop - scrollTop;

        return {
            left: left,
            top: top,
            right: window.document.documentElement.clientWidth - box.width - left,
            bottom: window.document.documentElement.clientHeight - box.height - top,
            right2: window.document.documentElement.clientWidth - left,
            bottom2: window.document.documentElement.clientHeight - top,
        }
    },
    /*
     * Event binding
     *
     * @method bind
     * @param  {dom||window}   elem       The dom node or window object that needs to be bound
     * @param  {String}        event      Bound event name
     * @param  {Function}      handler     Event processing method
     */
    bind(elem, event, handler) {
        if (elem && elem !== 'undefined' && event && handler) {
            event = event === 'mousewheel' ? (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll") : event;

            if (document.attachEvent) { //if IE (and Opera depending on user setting)
                elem.attachEvent("on" + event, handler);
            } else { //WC3 browsers
                elem.addEventListener(event, handler, false);
            }
        }
    },
    /*
     * Remove event binding
     *
     * @method unbind
     * @param  {dom||window}   elem         Need to remove the bound dom node or window object
     * @param  {String}        event        Bound event name
     * @param  {Function||Array<Function>}  handler    Event processing method, can be an array
     */
    unbind(elem, event, handler) {
        if (elem && elem !== 'undefined' && event && handler) {
            event = event === 'mousewheel' ? (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll") : event;
            var handlers = [];

            if (Array.isArray(handler) && handler.length > 0) {
                handlers = handler;
            } else {
                handlers.push(handler);
            }

            if (document.removeEventListener) {

                handlers.forEach(e => {
                    elem.removeEventListener(event, e, false);
                })
            } else {

                handlers.forEach(e => {
                    elem.removeEventListener('on' + event, e);
                })
            }
        }
    },
    // Determine if the html element is currently included
    isHtml(val) {
        return /<[a-z][\s\S]*>/i.test(val);
    },
    // Get the current dislpay value
    getDisplayValue(ele) {
        if (ele) {
            return ele.currentStyle ? ele.currentStyle.display : getComputedStyle(ele, null).display;
        }
    },
    // Whether to include horizontal scroll bars
    hasHorizontalScrollBar(ele) {
        if (ele) {
            return ele.scrollWidth > ele.clientWidth;
        }
    },
    // Whether to include a vertical scroll bar
    hasVerticalScrollBar(ele) {
        if (ele) {
            return ele.scrollHeight > ele.clientHeight;
        }
    },
    // Get the width of the scroll bar
    getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.className = settings.scrollbarClass;
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.position = 'absolute';
        outer.style.top = '-9999px';
        document.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';

        const inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    },
    // Get parent component information
    getParentCompByName(context, name) {
        let parent = context.$parent;

        while (parent) {
            if (parent.$options.name !== name) {
                parent = parent.$parent;
            } else {
                return parent;
            }
        }

        return null;
    },
    // Get multiple eligible subcomponent information
    getChildCompsByName(context, name) {
        let result = [];
        let childrens = context.$children;

        while (childrens && childrens.length > 0) {
            childrens.forEach(child => {
                childrens = child.$children ? child.$children : null;

                if (child.$options.name === name) {
                    result.push(child);
                }

            })
        }

        return result;
    }

}
