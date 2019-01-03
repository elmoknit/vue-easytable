<template>
    <dl :class="['v-dropdown',sizeClass]" v-click-outside="clickOutside">
        <dt class="v-dropdown-dt">
            <a :class="[isSelect ? 'v-dropdown-selected' :'']" @click.stop.prevent="toggleItems()"
               :style="{'width':width+'px'}">
                <slot></slot>
            </a>
        </dt>
        <dd v-show="visible" class="v-dropdown-dd">
            <ul class="v-dropdown-items" :style="{'min-width':width+'px','max-width':getMaxWidth+'px'}">
                <template v-if="isMultiple">
                    <v-checkbox-group is-vertical-show
                                      :min="min"
                                      :max="max"
                                      @change="checkboxGroupChange"
                                      v-model="checkboxGroupList"
                    >
                        <b-input type="text" ref="inputsearch" :placeholder="placeholderSearch" v-model="search" />
                        <li v-for="item in filteredInternalOptions"
                            :class="['v-dropdown-items-multiple',getTextAlignClass()]"
                        >

                            <v-checkbox :key="item.label" :label="item.label | highlight(search)"
                                        :showLine="item.showLine"></v-checkbox>
                        </li>
                    </v-checkbox-group>
                </template>
                <template v-else>
                    <li v-for="item in filteredInternalOptions" @click.stop="selectOptionClick(item)"
                        :class="['v-dropdown-items-li',item.selected ? 'active' : '']">
                        <a :class="['v-dropdown-items-li-a',getTextAlignClass()]" href="javascript:void(0);">{{item.label}}</a>
                    </li>
                </template>

                <li v-if="showOperation" class="v-dropdown-operation">
                    <a @click.stop="confirm" class="v-dropdown-operation-item" href="javascript:void(0)">{{confirmLabel}}</a>
                    <a @click.stop="rest" class="v-dropdown-operation-item" href="javascript:void(0)">{{resetLabel}}</a>
                </li>
            </ul>
        </dd>
    </dl>
</template>

<script>
    import settings from '../../src/settings/settings.js'
    import clickoutside from '../../src/directives/clickoutside.js'

    import VCheckboxGroup from '../../v-checkbox-group/index'
    import VCheckbox from '../../v-checkbox/index'

    import layerAdjustment from '../../src/mixins/layerAdjustment.js'

    export default {
        name: 'v-dropdown',
        components: {
            VCheckboxGroup, VCheckbox
        },
        mixins: [layerAdjustment],
        directives: {
            'click-outside': clickoutside
        },
        data() {
            return {

                visible: false,

                internalOptions: [],

                // checkboxGroup 选中的项
                checkboxGroupList: [],

                // 样式前缀
                textAlignPrefix: 'v-dropdown-items-li-a-',

                inputValue: '',

                // 是否有选项被改变（初始值为null 为了区分首次internalOptions 赋值的问题）
                isOperationChange: null,

                search: ''
            }
        },
        props: {
            // 如果是select 组件将特殊处理
            isSelect: {
                type: Boolean,
                default: false
            },
            showOperation: {
                type: Boolean,
                default: false
            },
            size: {
                type: String
            },

            width: {
                type: Number,
                default: 90

            },

            // select的最大宽度(超出隐藏)
            maxWidth: {
                type: Number
            },

            // 如果为true 会包含 checkbox
            isMultiple: {
                type: Boolean,
                default: false
            },

            // 用户传入v-model 的值 [{value/label/selected}]
            value: [Object, Array],

            // 占位符
            placeholder: {
                type: String,
                default: '请选择',
                validator: function (value) {
                    return value.length > 0
                }
            },

            // 文本居中方式 left|center|right
            textAlign: {
                type: String,
                default: 'left'
            },

            // 最小选中数量
            min: {
                type: Number,
                default: 0
            },

            // 最大选中数量
            max: {
                type: Number,
                default: 999
            },

            // 是否支持输入input
            isInput: {
                type: Boolean,
                default: false
            },
            confirmLabel: {
                type: String,
                default: 'Ok'
            },
            resetLabel: {
                type: String,
                default: 'Reset'
            },
            placeholderSearch: {
                type: String,
                default: 'Search'
            }

        },
        computed: {

            sizeClass() {
                let size = settings.sizeMaps[this.size] || settings.sizeMapDefault
                return size === settings.sizeMaps['large'] ? ' v-dropdown--large' : (size === settings.sizeMaps['middle'] ? ' v-dropdown--middle' : ' v-dropdown--small')
            },

            // 获取最大宽度(不设置则是无穷大)
            getMaxWidth() {
                var result = Infinity,
                    maxWidth = this.maxWidth,
                    width = this.width;

                if (maxWidth && maxWidth > 0 && maxWidth > width) {

                    result = maxWidth;
                }

                return result;
            },

            filteredInternalOptions(){
                return this.internalOptions.filter(filter => {
                    return filter.label.toLowerCase().indexOf(this.search.toLowerCase())>=0;
                });
            }
        },
        filters: {
            highlight: function (words, query) {
                if(query){
                    let iQuery = new RegExp(query, "ig");
                    return words.toString().replace(iQuery, function(matchedTxt,a,b){
                        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
                    });
                }else{
                    return words;
                }

            }
        },
        methods: {

            // 初始化
            init() {
                this.internalOptions = Object.assign([], this.value);


                this.checkboxGroupList = this.selectedLabels();

                if (this.isInput) {

                    this.setInputValue();
                }
            },

            // operation filter confirm
            confirm() {

                if (this.isOperationChange) {

                    this.$emit('on-filter-method', this.internalOptions);
                    this.isOperationChange = false;
                }
                this.hideDropDown();
            },

            // operation filter reset
            rest() {
                this.search = '';
                if (this.internalOptions.some(x => x.selected)) {

                    this.internalOptions.map(x => {

                        if (x.selected) {
                            x.selected = false;
                        }
                        return x;
                    })

                    this.checkboxGroupList = [];

                    // 使用户传入的v-model 生效
                    this.$emit('input', this.internalOptions);

                    this.$emit('change');

                    // 修复执行两次的bug
                    /*this.$emit('on-filter-method',this.internalOptions);

                    this.isOperationChange = false;*/
                }

                setTimeout(x => {

                    this.hideDropDown();
                }, 50)
            },

            hideDropDown() {

                if (this.showOperation && this.isOperationChange) {

                    this.$emit('on-filter-method', this.internalOptions);
                    this.isOperationChange = false;
                }

                this.visible = false;
            },

            showDropDown() {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.inputsearch.focus();
                })
            },

            // 设置文本框的值
            setInputValue() {

                var result, labels;

                labels = this.selectedLabels();
                if (Array.isArray(labels) && labels.length > 0) {
                    result = labels.join();
                }

                this.inputValue = result;
            },

            // checkbox 选中改变事件
            checkboxGroupChange() {

                this.selectOptionClick();
            },

            toggleItems() {

                //this.visible = !this.visible;

                if (this.visible) {

                    this.hideDropDown();

                } else {

                    this.showDropDown();

                    this.$nextTick(x => {
                        this.dropDownClick()
                    })
                }
            },

            selectOptionClick(item) {
                if (!this.isMultiple) {
                    this.internalOptions.map((x) => {

                        if (item.label === x.label) {
                            x.selected = true;
                        } else {
                            x.selected = false;
                        }
                        return x;
                    })
                } else { // 多选
                    this.internalOptions.map((x) => {

                        if (this.checkboxGroupList.includes(x.label)) {
                            x.selected = true;
                        } else {
                            x.selected = false;
                        }
                        return x;
                    })
                }

                if (!this.isMultiple) {
                    this.toggleItems();
                }

                if (this.isInput) {

                    this.setInputValue();
                }

                // 使用户传入的v-model 生效
                this.$emit('input', this.internalOptions);

                this.$emit('change');
            },

            // 获取样式名称
            getTextAlignClass() {

                return this.textAlignPrefix + this.textAlign;

            },

            // 当前选中项的label
            selectedLabels() {

                return this.internalOptions.filter(x => x.selected).map(x => {

                    if (x.selected) {
                        return x.label;
                    }
                });
            },

            clickOutside() {

                this.hideDropDown();
                //this.visible = false
            },

            // 下拉点击显示
            dropDownClick() {

                var dtEle = this.$el.querySelector('.v-dropdown-dt'),
                    ddItem = this.$el.querySelector('.v-dropdown-items');
                this.layerAdjustmentOnce(ddItem, dtEle, 2);
                return false;
            },

            // 确定下拉框的位置
            dropdownAdjust() {

                var dtEle = this.$el.querySelector('.v-dropdown-dt'),
                    ddItem = this.$el.querySelector('.v-dropdown-items');
                this.layerAdjustmentBind(ddItem, dtEle, 2);
            }

        },

        created() {

            this.init();
        },
        mounted() {

            this.dropdownAdjust();

        },
        watch: {
            'value': function (val) {
                this.init();
            },
            'internalOptions': function (val) {

                this.isOperationChange = (this.showOperation && this.isOperationChange !== null) ? true : false;
            }
        }
    }
</script>
