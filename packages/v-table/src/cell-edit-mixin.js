import utils from '../../src/utils/utils.js'
import {addClass, hasClass, removeClass} from '../../src/utils/dom.js'

export default {

    methods: {
        // cell edit
        cellEdit(e, callback, rowIndex, rowData, field) {

            let target = e.target,
                self = this,
                oldVal,
                editInput,
                editInputLen,
                actionFun,
                textAlign,
                childTarget;

            while ((target.className && target.className.indexOf('v-table-body-cell') === -1) || !target.className) {
                target = target.parentNode;
            }

            // Child node (span node)
            childTarget = target.children[0];

            // Hide the child nodes
            childTarget.style.display = 'none';

            if (hasClass(target, 'cell-editing')) {
                return false
            }

            addClass(target, 'cell-editing');

            oldVal = childTarget.innerText.trim();

            if (target.style.textAlign) {
                textAlign = target.style.textAlign;
            }

            editInput = document.createElement('input');
            editInput.value = oldVal;
            editInput.className = 'cell-edit-input';
            editInput.style.textAlign = textAlign;
            editInput.style.width = '100%';
            editInput.style.height = '100%';
            //editInput.style = `width:100%;height: 100%;text-align: ${textAlign};`;

            target.appendChild(editInput);

            editInput.focus();

            editInputLen = editInput.value.length;
            if (document.selection) {
                let ctr = editInput.createTextRange();
                ctr.moveStart('character', editInputLen);
                ctr.collapse();
                ctr.select();
            } else if (typeof editInput.selectionStart == 'number' && typeof editInput.selectionEnd == 'number') {
                editInput.selectionStart = editInput.selectionEnd = editInputLen;
            }

            actionFun = function (e) {

                if (typeof e.keyCode === 'undefined' || e.keyCode === 0 || e.keyCode == 13) {

                    if (hasClass(target, 'cell-editing')) {

                        removeClass(target, 'cell-editing');
                    } else {
                        return false;
                    }

                    childTarget.style.display = '';

                    // fixed this.value bug in IE9
                    callback({
                        newValue: editInput.value,
                        oldValue: oldVal,
                        rowIndex: rowIndex,
                        rowData: rowData,
                        field: field
                    });

                    utils.unbind(editInput, 'blur', actionFun);
                    utils.unbind(editInput, 'keydown', actionFun);

                    target.removeChild(editInput);
                }
            };


            utils.bind(editInput, 'blur', actionFun);
            utils.bind(editInput, 'keydown', actionFun);
        },
        setCellEditDone(payload) {
            this.cellEditDone && this.cellEditDone(payload.newValue, payload.oldValue, payload.rowIndex, payload.rowData, payload.field);
        },
        // 单元格点击
        cellEditClick(e, isEdit, rowData, field, rowIndex) {
            if (isEdit) {
                this.cellEdit(e, this.setCellEditDone, rowIndex, rowData, field)
            }
        },
    }
}
