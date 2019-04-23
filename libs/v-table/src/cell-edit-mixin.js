'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../../src/utils/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _dom = require('../../src/utils/dom.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    methods: {
        cellEdit: function cellEdit(e, callback, rowIndex, rowData, field) {

            var target = e.target,
                self = this,
                oldVal = void 0,
                editInput = void 0,
                editInputLen = void 0,
                _actionFun = void 0,
                textAlign = void 0,
                childTarget = void 0;

            while (target.className && target.className.indexOf('v-table-body-cell') === -1 || !target.className) {
                target = target.parentNode;
            }

            childTarget = target.children[0];

            childTarget.style.display = 'none';

            if ((0, _dom.hasClass)(target, 'cell-editing')) {
                return false;
            }

            (0, _dom.addClass)(target, 'cell-editing');

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


            target.appendChild(editInput);

            editInput.focus();

            editInputLen = editInput.value.length;
            if (document.selection) {
                var ctr = editInput.createTextRange();
                ctr.moveStart('character', editInputLen);
                ctr.collapse();
                ctr.select();
            } else if (typeof editInput.selectionStart == 'number' && typeof editInput.selectionEnd == 'number') {
                editInput.selectionStart = editInput.selectionEnd = editInputLen;
            }

            _actionFun = function actionFun(e) {

                if (typeof e.keyCode === 'undefined' || e.keyCode === 0 || e.keyCode == 13) {

                    if ((0, _dom.hasClass)(target, 'cell-editing')) {

                        (0, _dom.removeClass)(target, 'cell-editing');
                    } else {
                        return false;
                    }

                    childTarget.style.display = '';

                    callback({
                        newValue: editInput.value,
                        oldValue: oldVal,
                        rowIndex: rowIndex,
                        rowData: rowData,
                        field: field
                    });

                    _utils2.default.unbind(editInput, 'blur', _actionFun);
                    _utils2.default.unbind(editInput, 'keydown', _actionFun);

                    target.removeChild(editInput);
                }
            };

            _utils2.default.bind(editInput, 'blur', _actionFun);
            _utils2.default.bind(editInput, 'keydown', _actionFun);
        },
        setCellEditDone: function setCellEditDone(payload) {
            this.cellEditDone && this.cellEditDone(payload.newValue, payload.oldValue, payload.rowIndex, payload.rowData, payload.field);
        },
        cellEditClick: function cellEditClick(e, isEdit, rowData, field, rowIndex) {
            if (isEdit) {
                this.cellEdit(e, this.setCellEditDone, rowIndex, rowData, field);
            }
        }
    }
};