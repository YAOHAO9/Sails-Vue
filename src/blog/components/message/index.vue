<template>
    <div class="message">
        <ul>
            <li v-for="item in dataAndOperater.list">
                <p class="time">
                    <span>{{ item.createdAt | time }}</span>
                </p>

                <div class="hiv" :class="{ self: user.id == item.user.id }">
                    <div class="head" v-if="user.id != item.user.id ">
                        <avator :avator="item.user.avator"></avator>
                    </div>
                    <div class="content">
                        <div class="name">{{item.user.name}}</div>
                        <div class="text">
                            {{ item.content }}
                        </div>
                    </div>
                    <div class="head" v-if="user.id == item.user.id ">
                        <avator :avator="item.user.avator"></avator>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import Avator from '../avatar'

    export default {
        data() {
            return {
                ul: {}
            }
        },
        props: ['dataAndOperater'],
        components: {
            Avator
        },
        ready() {
            this.dataAndOperater.scrollToButtom = function () {
                var message = $('.message')[0]
                message.scrollTop = 10000000000
            }
        },
        vuex: {
            getters: {
                user: function (state) {
                    return state.user
                }
            },
            actions: {
                saveUser: function (store, val) {
                    store.dispatch('SAVEUSER', val);
                }
            }
        },
        filters: {
            // 将日期过滤为 hour:minutes
            time(date) {
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                return date.getHours() + ':' + date.getMinutes();
            }
        }
    }

</script>
<style lang="less" scoped>
    .message {
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 40px;
        overflow: auto;
        padding: 10px 5px;
        li {
            margin-bottom: 15px;
        }
        .time {
            margin: 7px 0;
            text-align: center;
            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                border-radius: 2px;
                background-color: #dcdcdc;
            }
        }
        .head {
            width: 46px;
        }
        .content {
            width: 100%;
            margin: 0 5px;
            .name {
                font-size: 12px;
                color: gray;
            }
            .text {
                display: inline-block;
                position: relative;
                padding: 0 10px;
                min-height: 30px;
                line-height: 2.5;
                font-size: 12px;
                text-align: left;
                word-break: break-all;
                background-color: #fafafa;
                border-radius: 4px;
                &:before {
                    content: " ";
                    position: absolute;
                    top: 9px;
                    right: 100%;
                    border: 6px solid transparent;
                    border-right-color: #fafafa;
                }
            }
        }
        .self {
            text-align: right;
            .text {
                background-color: #b2e281;
                &:before {
                    right: inherit;
                    left: 100%;
                    border-right-color: transparent;
                    border-left-color: #b2e281;
                }
            }
        }
    }
</style>