import deepClone from '../../src/utils/deepClone.js'

export default {
    data() {
        return {
            footerTotalHeight: 0
        }
    },
    computed: {
        frozenFooterCols() {
            let result = [];

            if (this.initInternalFooter.length > 0) {
                this.initInternalFooter.forEach(columns => {
                    result.push(columns.filter(col => col.isFrozen));
                });
            }

            return result;
        },
        noFrozenFooterCols() {
            let result = [];

            if (this.initInternalFooter.length > 0) {
                this.initInternalFooter.forEach(columns => {
                    result.push(columns.filter(col => !col.isFrozen));
                });
            }

            return result;
        },
        getFooterTotalRowHeight() {
            if (Array.isArray(this.footer) && this.footer.length > 0) {
                return this.footer.length * this.footerRowHeight;
            }
            return 0;
        },
        hasTableFooter() {
            return Array.isArray(this.footer) && this.footer.length;
        },

        initInternalFooter() {
            if (!(Array.isArray(this.footer) && this.footer.length > 0)) {
                return [];
            }

            let result = [],
                resultRow = [],
                cloneInternalColumns;

            // Prevent interference on the original array after sorting
            cloneInternalColumns = deepClone(this.internalColumns);

            cloneInternalColumns.sort(function (a, b) {

                if (a.isFrozen) {
                    return -1;
                } else if (b.isFrozen) {
                    return 1;
                }

                return 0;
            });

            this.footer.forEach((items, rows) => {
                resultRow = [];

                items.forEach((value, index) => {
                    resultRow.push({
                        content: value,
                        width: cloneInternalColumns[index].width,
                        align: cloneInternalColumns[index].columnAlign,
                        isFrozen: cloneInternalColumns[index].isFrozen ? true : false
                    });
                });

                result.push(resultRow);
            });
            return result;
        }
    },
    methods: {
        // Set the footer cell style
        setFooterCellClassName(isLeftView, rowIndex, colIndex, value) {
            let _colIndex = colIndex;

            // If it is the right column and there is a fixed column
            if (!isLeftView && this.hasFrozenColumn) {
                _colIndex += this.frozenCols.length;
            }

            return this.footerCellClassName && this.footerCellClassName(rowIndex, _colIndex, value);
        },
    }
}
