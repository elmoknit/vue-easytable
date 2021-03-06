export default {

    data(){

        return {

            hoverRowIndex: -1,
            clickRowIndex: -1
        }
    },

    methods: {
        handleMouseEnter(rowIndex){
            if (this.rowHoverColor && this.rowHoverColor.length > 0) {
                this.hoverRowIndex = rowIndex;
            }

            this.rowMouseEnter && this.rowMouseEnter(rowIndex);
        },
        handleMouseOut(rowIndex){
            if (this.rowHoverColor && this.rowHoverColor.length > 0) {
                this.hoverRowIndex = -1;
            }

            this.rowMouseLeave && this.rowMouseLeave(rowIndex);
        },
        /*
         * Header cell click event
         * Note: if it is a complex header, field is an array
         * */
        titleCellClick(field,title){
            this.titleClick && this.titleClick(title,field);
        },
        /*
         * Header cell double click event
         * Note: if it is a complex header, field is an array
         * */
        titleCellDblClick(field,title){
            this.titleDblclick && this.titleDblclick(title,field);
        },
        // Row click event
        rowCellClick(rowIndex, rowData, column){
            if (this.rowClickColor && this.rowClickColor.length > 0) {
                this.clickRowIndex = rowIndex;
            }

            this.rowClick && this.rowClick(rowIndex, rowData, column);
        },

        // Line double click event
        rowCellDbClick(rowIndex, rowData, column){
            this.rowDblclick && this.rowDblclick(rowIndex, rowData, column);
        },

        /*
         * @method getHighPriorityBgColor Get the high priority line background color Priority click color > hover color > parity color > table bg color
         * */
        getHighPriorityBgColor(rowIndex){

            var result = '';

            if (this.clickRowIndex === rowIndex) {
                result = this.rowClickColor;

            } else if (this.hoverRowIndex === rowIndex) {
                result = this.rowHoverColor;
            }

            if (result.length <= 0) {
                if ((this.evenBgColor && this.evenBgColor.length > 0) || (this.oddBgColor && this.oddBgColor.length > 0)) {
                    result = (rowIndex + 1) % 2 === 0 ? this.evenBgColor : this.oddBgColor;
                }
            }

            if (result.length <= 0) {
                result = this.tableBgColor;
            }

            return result;
        },

        setRowBgColor(newVal, oldVal, color){
            let el = this.$el;

            if (!el) {
                return false;
            }

            let rowsCollection = [],
                oldRow, newRow;

            if (this.hasFrozenColumn) {
                rowsCollection.push(el.querySelectorAll('.v-table-leftview .v-table-row'));
            }

            rowsCollection.push(el.querySelectorAll('.v-table-rightview .v-table-row'));

            rowsCollection.forEach(rows => {
                oldRow = rows[oldVal];
                newRow = rows[newVal];

                if (oldRow) {
                    oldRow.style.backgroundColor = this.getHighPriorityBgColor(oldVal);
                    oldRow.childNodes.forEach(function (cell) {
                        cell.style.removeProperty("background-color");
                    });
                }

                if (newRow) {
                    newRow.style.backgroundColor = color;
                    newRow.childNodes.forEach(function (cell) {
                        cell.style.backgroundColor = color;
                    });
                }
            })
        },

        // 取消当前选中的行
        clearCurrentRow(){

            this.clickRowIndex = -1;
        }

    },

    watch: {

        'hoverRowIndex': function (newVal, oldVal) {

            this.setRowBgColor(newVal, oldVal, this.rowHoverColor);
        },

        'clickRowIndex': function (newVal, oldVal) {

            this.setRowBgColor(newVal, oldVal, this.rowClickColor);
        }
    }
}
