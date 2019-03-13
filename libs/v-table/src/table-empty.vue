<template>

    <div class="v-table-empty">
        <!--Form no data prompt message-->
        <div class="v-table-empty-content"
             :style="{'height':contentHeight+'px','width':width+'px','top':titleHeight+'px'}">
            <div class="v-table-empty-inner"
                 :style="{'height':contentHeight+'px','width':'100%','line-height':contentHeight+'px'}"
                 v-html="getCurrentContent"></div>
        </div>

        <!--Table without data scroll bar-->
        <div class="v-table-empty-scroll"
             :style="{'height':contentHeight+'px','width':width+'px','top':titleHeight+'px'}">
            <div class="v-table-empty-inner"
                 :style="{'height':contentHeight+'px','width':'100%','line-height':contentHeight+'px'}"
                 v-html="getCurrentContent"></div>
            <!--<div class="v-table-empty-inner" :style="{'height':'1px','width':totalColumnsWidth+'px'}" v-html="getCurrentContent"></div>-->
        </div>

    </div>

</template>

<script>
    import utils from '../../src/utils/utils.js'

    export default{

        props: {
            titleHeight: [Number, String],
            contentHeight: [Number, String],
            width: [Number, String],
            totalColumnsWidth: [Number, String],
            errorContent: {
                type: [String]
            },
            isLoading: [Boolean]

        },

        computed: {
            // 获取当前要显示的内容
            getCurrentContent(){

                var result = '';

                if (!this.isLoading) {
                    result = this.errorContent;
                }

                return result;
            }

        }
    }
</script>
