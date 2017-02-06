<template>
<div class="message" v-scroll-bottom>
    <ul>
        <li v-for="item in messages.messages">
            <p class="time">
                <span>{{ item.date | time }}</span>
            </p>
            
            <div class="hiv" :class="{ self: item.self }">
                <div class="head" v-if="!item.self">
                    <avator  :avatar="/static/img/mm.jpg"></avator>
                </div>
                <div class="content">
                    <div class="name">刀郎</div>
                    <div class="text">
                    {{ item.content }}
                    </div>
                </div>
                <div class="head" v-if="item.self">
                    <avator  :avatar="/static/img/mm.jpg"></avator>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>
<script>
import Avator from '../avatar'

export default  {
    data() {
      return {
        user: {
          name: 'coffce',
          img: '/static/img/mm.jpg'
        },
        messages: 
          {
            id: 1,
            messages: [
              {
                  user: {
              name: '示例介绍',
              img: '/static/img/mm.jpg'
            },
                content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
                date: new Date()
              }, {
                  user: {
              name: '示例介绍',
              img: '/static/img/mm.jpg'
            },
                content: '项目地址: https://github.com/coffcer/vue-chat',
                date: new Date()
              },
              {
                  user: {
              name: '示例介绍',
              img: '/static/img/mm.jpg'
            },
                content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
                date: new Date(),
                self:true
              }, {
                  user: {
              name: '示例介绍',
              img: '/static/img/mm.jpg'
            },
                content: '项目地址: https://github.com/coffcer/vue-chat',
                date: new Date(),
                self:true
              }
            ]
          }
      }
    },
    components:{
        Avator
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return date.getHours() + ':' + date.getMinutes();
        }
    },
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom' () {
            this.vm.$nextTick(() => {
                this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
            });
        }
    }
}
</script>
<style lang="less" scoped>


.message {
    padding: 10px 5px;
    overflow-y: scroll;

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
    .head{
        width: 46px;
    }
    .content{
        width: 100%;
        margin: 0 5px;

        .name{
            font-size: 12px;
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