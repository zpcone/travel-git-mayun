<template>
  <div class="tour_detail">
    <header-back :title="title"></header-back>
    <scroll class="tour_detail_wrap">
      <div  style="padding-bottom: 2rem">
      <div></div>
      <!-- <div class="to-date">
        <div class="left-wrapper" @click="selectDate">
          <div class="title">出发时间</div>
          <div class="name">{{modalData.dateText}}</div>
        </div>
        <div class="icon-wrapper">
          <i class="icon-arrow-right"></i>
        </div>
      </div> -->
      <div class="select-date">
        <ul>
          <li>
            <span>6月</span>
          </li>
          <li>
            <div>7月</div>
            <div>456元</div>
          </li>
          <li>
            <div>6月</div>
            <div>456元</div>
          </li>
        </ul>
        <div v-for="(item,index) in pullDate"  :key="index">
          <div class="date-title">{{item.title}}</div>
          <ul>
            <li v-for="(day, index) in item.date" :key="index" :class="day.classname"
                @click="(day.classname==='day'? dayClickEvent(day): null)">
              {{day.day}}
              <i v-for="(tag, index) in day.tags" :key="index" :class="tag[0]">
                {{tag[1]}}<span v-show="tag[0]==='price'">元</span>
              </i>
            </li>
          </ul>
        </div>
      </div>
        <!-- <div class="travel_info travel">
          <p class="term"><img src="../../common/images/icons/icon-address-black.png"/>{{detail.cfd}}出发</p>
        </div>
        <div style="height:44px;">
          <sticky scroll-box="vux_view_box_body" ref="sticky" :offset="46" :check-sticky-support="false">
            <tab :line-width="1" active-color="#3366cc">
              <tab-item selected>行程亮点</tab-item>
              <tab-item>费用包含</tab-item>
              <tab-item>预订须知</tab-item>
              <tab-item>其他事项</tab-item>
            </tab>
          </sticky>
        </div> -->
        <!-- <div class="travel_lights travel">
          <div style="padding: 1rem" v-html="detail.xq"></div>
        </div> -->
      </div>
    </scroll>
    <div class="tour_detail_handle">
      <div class="order" @click="orderTotal">
        <span style="color: #666;">总额：</span>
        <span style="color:red;">{{totalCount}}</span>
      </div>
      <div class="msg" @click="goKeFu">
        <span class="icon"></span>
        <span class="text">客服</span>
      </div>
      <div class="buy" @click="buy">提交订单</div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="kefu" confirm-text="拨号" title="客服电话" theme="android" @on-confirm="onKeFuConfirm">
        <p>18311420279</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import moment from 'moment'
// import dateChildren from '../serve/dateChildren'
// import selectTime from 'components/serve/selectTime' // 所有日期全部展示出来
// import selectTime from 'selectTime' // 所有日期全部展示出来
// import { PopupPicker,Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
import { Sticky, Tab, TabItem, Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea ,Confirm, TransferDomDirective as TransferDom } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Sticky, Tab, TabItem, Group, Cell, CellBox, Datetime, Picker, XTextarea, Confirm},
  data () {
    return {
      currentDate:['2017-08-28','2017-08-30'], // 进去就默认选中的日期
      dateJson: [{
        date: '2017-8-11',
        price: '100'
      },
      {
        date: '2017-8-13',
        price: '100',
        rest: '休'
      },
      {
        date: '2017-8-15',
        price: '100',
        discount: '折'
      },
      {
        date: '2017-8-16',
        price: '100',
        rest: '假'
      }],
      startDate:'2015-2-10',
      endDate:'2015-3-20',
      totalCount: '100.00', // 总额
      title: '选择团期和参团人数',
      kefu: false,
      detail: {}
    }
  },
  computed: {
    pullDate() {
      return this.getAll(this.startDate, this.endDate);
    }
  },
  created() {
    this._initTour()
  },
  directives: {
    TransferDom
  },
  methods: {
     getAll(start, end) {
      // 获取两个日期间的所有日期数据
      const sd = Number(
        moment(start)
          .startOf("month")
          .format("x")
      ); // 本月第一天
      const ed = Number(
        moment(end)
          .endOf("month")
          .format("x")
      ); // 本月最后一天

      let dataObject = {};

      dataObject[sd] = { title: moment(start).format("YYYY年MM月"), date: [] }; // 初始第一个月
      for (let w = 1; w < moment(sd).weekday(); w++) {
        // 对本月一号之前的周几补全。
        dataObject[sd].date.push({ year: "", month: "", day: "", week: w }); // 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
      }

      for (let i = sd; i <= ed;){
        const firstDay = Number(
          moment(i)
            .startOf("month")
            .format("x")
        ); // 当月第一天;--作为每个月的唯一标示

        if (
          moment(i).format("x") ===
            moment(
              moment(i)
                .startOf("month")
                .format("YYYY-MM-DD")
            ).format("x") &&
          i !== sd
        ) {
          // 如果是当月的第一天,添加下个月的数据
          console.log(i, sd);
          const op = {
            title: moment(i)
              .add(1, "days")
              .format("YYYY年MM月"), // 下个月的第一天
            date: []
          };
          for (let w = 1; w < moment(i).weekday(); w++) {
            // 对本月一号之前的周几补全。
            op.date.push({ year: "", month: "", day: "", week: w }); // 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
          }
          dataObject[i] = op;
        }

        //根据日期给div设置样式
        let className = this.setClass(start, end, i);

        const tag = this.pushTag(moment(i).format("YYYY-MM-DD")); // 折扣，休息等信息

        const option = {
          year: moment(i).format("YYYY"),
          month: moment(i).format("MM"),
          day: moment(i).format("DD"),
          week: moment(i).weekday(),
          classname: className,
          tags: tag
        };
        dataObject[firstDay].date.push(option);
        i = Number(
          moment(i)
            .add(1, "days")
            .format("x")
        ); // 下次赋值
      }
      debugger
      return dataObject;
    },
    pushTag(yearMonthDay) {
      // 添加 价格信息，是否休息等。。。
      let tags = [];
      for (let i = 0; i < this.dateJson.length; i++) {
        if (
          moment(yearMonthDay).format("x") ===
          moment(this.dateJson[i].date).format("x")
        ) {
          for (let key in this.dateJson[i]) {
            tags.push([key, this.dateJson[i][key]]);
          }
          break;
        }
      }
      return tags;
    },
    setClass(start, end, i) {
      //根据日期给div设置样式
      let className = "";
      if (i >= moment(start).format("x") && i <= moment(end)) {
        // 是否在开始和结束之间
        className = "day";
        if (moment(i).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
          // 今天
          className += " today";
        }
        this.currentDate.forEach(item => {
          // currentDate
          if (
            moment(i).format("YYYY-MM-DD") === moment(item).format("YYYY-MM-DD")
          ) {
            className += " curday";
          }
        });
      } else {
        className = "pass";
        if (moment(i).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
          className += " today";
        }
      }
      return className;
    },
    orderTotal() {
      console.log('总额')
    },
    selectTeamDate() {
      this.$router.push({
        path: '/selectedTeamDate'
      })
      // console.log('jglfdl')
    },
    onKeFuConfirm(){
      location.href = 'tel:18311420279'
    },
    goKeFu(){
      this.kefu = true
    },
    buy() {
      this.$router.push({path: `/tourSubmit`, query: {sceneryId: this.$route.params.id}})
    },
    _initTour () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getScenery.service?token=' + token + '&id=' + this.$route.params.id
      }).then((res) => {
        if (res.status === 200) {
          _this.detail = res.data.data[0]
          console.log(res.data)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../common/css/variable.less";
.select-date {
  background: #fafafa;
  color: #333;
  .date-title {
    width: 100%;
    background-color: transparent;
    color: #333;
    line-height: 14rem;
    font-weight: 400;
    text-align: center;
    letter-spacing: 0.025rem;
    font-size: 18px;
    z-index: 9;
  }
  ul {
    display: flex;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;

    li {
      flex: 1;
      position: relative;
      float: left;
      // width: 50px;
      width:1rem;
      height: 5rem;
      margin-bottom: -1px;
      border-bottom: 1px solid #e8e8e8;
      text-align: center;
      line-height: 58px;
      font-size: 18px;

      &.pass, &.future {
        color: #ccc;
        opacity: 0.5;
      }

      &.day {
        color: #333;
      }

      i {
        display: block;
        position: absolute;
        color: #333;
        font-style: normal;
        font-size: 12px;

        &.date {
          display: none;
          font-style: none;
        }

        &.rest, &.discount {
          right: 0.1rem;
          top: 0.1rem;
          width: 0.3rem;
          height: 0.3rem;
          background: #4AC29A;
          line-height: 0.3rem;
          color: #fff;
        }

        &.discount {
          background: #ff6600;
          color: #fff;
        }

        &.price {
          bottom: 0;
          left: 0;
          width: 100%;
          color: #333;
          font-size: 12px;
          line-height: 0.3rem;
        }
      }
    }
  }
}
  // =====
  .tour_detail {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 10000;
    .tour_detail_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      .travel{
        margin-bottom: 1rem;
        background: @color-text-w;
        &.travel_info{
          .title{
            font-size: @font-size-medium-x;
            line-height: 2rem;
            padding: 0.5rem 1rem;
          }
          .price{
            border-top: 1px solid #eee;
            font-size: @font-size-medium;
            line-height: 4rem;
            padding: 0 1rem;
            span{
              color: #ef605a;
            }
          }
          .teamDate{
            border-top: 1px solid #eee;
            font-size: @font-size-medium;
            line-height: 4rem;
            padding: 0 1rem;
            span{
              color: rgb(51, 102, 204);
            }
          }

          .term{
            img{
              width: 1.2rem;
              height: auto;
              vertical-align: middle;
              margin-right: 10px;
            }
            font-size: @font-size-medium;
            line-height: 2rem;
            padding: 0.5rem 1rem;
          }
        }
        .title{
          font-size: @font-size-large;
          line-height: 4rem;
          padding: 0 1rem;
        }
        img{
          width: 100%;
          height: 16rem;
        }
      }
    }
    .tour_detail_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      color: @color-text-w;
      .msg {
        width: 6rem;
        border-right: 1px solid #ddd;
        background: #fff;
        span {
          display: block;
          &.icon {
            height: 3rem;
            background: url("../../common/images/icons/icon-kf-g.png") no-repeat center center;
            background-size: 2.2rem auto;
          }
          &.text {
            font-size: 1.2rem;
            color: @color-text-g;
          }
        }
      }
      .order{
        flex: .5;
        border-right: 1px solid #ddd;
        background: #fff;
        line-height: 5rem;

      }
      .buy{
        flex: .5;
        background: @color-theme;
        line-height: 5rem;
      }
    }
  }
</style>
