<template>
    <div class="message">
        <ul>
            <li v-for="item in list">
                <div v-if="user && item.sender" :read="read(item)" @dblclick="dblClick(item.id)">
                    <p class="time" v-if="isShowTime($index)">
                        <span>{{ item.createdAt | date }}</span>
                    </p>

                    <div class="hiv" :class="{ self: user.id == item.sender.id }">
                        <div class="head" v-if="user.id != item.sender.id ">
                            <avator :avator="item.sender.avator"></avator>
                        </div>
                        <div class="content">
                            <div class="name">{{item.sender.name}}</div>
                            <div class="text">
                                {{ item.content }}
                            </div>
                        </div>
                        <div class="head" v-if="user.id == item.sender.id ">
                            <avator :avator="item.sender.avator"></avator>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import Avator from '../avator'

    export default {
        data() {
            return {
                ul: {}
            }
        },
        props: ['list'],
        components: {
            Avator
        },
        methods: {
            dblClick(id){
                let delItemIndex=0
                if(this.user.isAdmin)
                    this.$http.delete('api/chat/' + id)
                    .then(res=>{
                        let found = this.list.some((item) => {
                            delItemIndex++
                            return item.id == id
                        })
                        if (found)
                            this.list.splice(delItemIndex-1, 1)
                })
            },
            read(item) {
                if(this.indexView !='at')
                    return
                if(!this.$parent.$parent.show)
                    return
                if (item.session != '0-0' && item.sender.id != this.user.id && !item.read) {
                    this.$http.put('/api/chat/read', { chatId: item.id })
                        .then(res => {
                            item.read = res.body.read
                            if(item.read){
                                let unreadMsgNum = this.unreadMsgNum-1
                                if(unreadMsgNum < 0)
                                    unreadMsgNum=0
                                this.updateUnreadMsgNum(unreadMsgNum)
                            }
                                
                         })
                }
            },
            isShowTime(index) {
                if (index == 0)
                    return true
                if (new Date(this.list[index].createdAt).getTime() - new Date(this.list[index - 1].createdAt).getTime() > 60 * 1000)
                    return true
                return false
            }
        }
    }

</script>
<style lang="less" scoped>
    .message {
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