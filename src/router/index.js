import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/home/home'
// import beerAndScence from 'components/home/beerAndScence'
import Mall from 'components/mall/mall'
import MallCard from 'components/mall/mall-card'
import Order from 'components/order/order'
import Mine from 'components/mine/mine'
import Hotel from 'components/home/hotel'
import HotelDetail from 'components/home/hotel-detail'
import HotelComment from 'components/home/hotel-comment'
import HotelImgs from 'components/home/hotel-imgs'
import HotelServe from 'components/home/hotel-serve'
import RoomDetail from 'components/home/room-detail'
import RoomBook from 'components/home/room-book'
import RoomBookConfirm from 'components/home/room-book-confirm'
import Meeting from 'components/serve/meeting'
import Business from 'components/serve/business'
import Business2 from 'components/serve/business2'
import Customized from 'components/serve/customized'
import CustomizedLead from 'components/serve/customized-lead'
import Vip from 'components/serve/vip'
import VipDetail from 'components/serve/vip-detail'
import VipOrderConfirm from 'components/serve/vip-order-confirm'
import TourLead from 'components/serve/tour-lead'
import Tour from 'components/serve/tour'
import TourDetail from 'components/serve/tour-detail'
import selectedTeamDate from 'components/serve/selectedTeamDate' // 选择团期
import TourSubmit from 'components/serve/tour-submit'
import Purse from 'components/serve/purse'
import OrderFinish from 'components/serve/order-finish'
import OrderSuccess from 'components/order/order-success'
import OrderPrePay from 'components/order/order-pre-pay'
import OrderComPay from 'components/order/order-com-pay'
import OrderRefundHotel from 'components/order/order-refund-hotel'
import OrderRefundGoods from 'components/order/order-refund-goods'
import MallWelfare from 'components/mall/mall-welfare'
import MallActivities from 'components/mall/mall-activities'
import MallStar from 'components/mall/mall-star'
import MallNews from 'components/mall/mall-news'
import MallSale from 'components/mall/mall-sale'
import GoodsDetail from 'components/mall/goods-detail'
import SubmitOrderGoods from 'components/mall/submit-order-goods'
import SubmitOrderGoodsShop from 'components/mall/submit-order-goodsShop'
import MineTicket from 'components/mine/mine-ticket'
import MineInvoice from 'components/mine/mine-invoice'
import CardInfo from 'components/mine/card-info'
import AddInvoice from 'components/mine/add-invoice'
import MineCollection from 'components/mine/mine-collection'
import MineAddress from 'components/mine/mine-address'
import MineShopCart from 'components/mine/shop-cart'
import AddAddress from 'components/mine/add-address'
import OrderAll from 'components/order/order-all'
import OrderDetailHotel from 'components/order/order-detail-hotel'
import OrderDetailGoods from 'components/order/order-detail-goods'
import AddComment from 'components/mine/add-comment'
import MineWish from 'components/mine/mine-wish'
import OrderCustomized from 'components/order/order-customized'
import OrderDetailCustomized from 'components/order/order-detail-customized'
import OrderCustomizedConfirm from 'components/order/order-customized-confirm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/mall',
      name: 'mall',
      component: Mall,
      children: [
        {
          path:'goods:id',
          name: 'GoodsDetail',
          component: GoodsDetail,
          children: [
            {
              path: 'comment',
              component: HotelComment
            }
          ]
        }
      ]
    },
    {
      path: '/mallCard',
      name: 'mallCard',
      component: MallCard,
      children: [
        {
          path:'/mallCard/goods',
          component: GoodsDetail
        }
      ]
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      children: [
        {
          path: '/order/hotelDetail',
          component: HotelDetail
        },
        {
          path: '/order/goodsDetail',
          component: GoodsDetail
        }
      ]
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      path: '/hotel',
      name: 'hotel',
      component: Hotel,
      children: [
        {
          path: 'hotel:id',
          name: 'HotelDetail',
          component: HotelDetail,
          children: [
            {
              path: 'hotelImg',
              name: 'hotelImg',
              component: HotelImgs
            },
            {
              path: 'comment',
              name: 'HotelComment',
              component: HotelComment
            },
            {
              path: 'serve',
              name: 'HotelServe',
              component: HotelServe
            },
            {
              path: 'room:roomId',
              name: 'RoomDetail',
              component: RoomDetail
            }
          ]
        }
      ]
    },
    {
      path: '/roomBook',
      name: 'roomBook',
      component: RoomBook
    },
    {
      path: '/roomBookConfirm',
      name: 'roomBookConfirm',
      component: RoomBookConfirm,
      children: [
        {
          path: '/roomBookConfirm/mineTicket',
          component: MineTicket
        },
        {
          path: '/roomBookConfirm/mineInvoice',
          component: MineInvoice,
          children: [
            {
              path: '/roomBookConfirm/mineInvoice/addInvoice',
              component: AddInvoice
            }
          ]
        }
      ]
    },
    {
      path: '/meeting',
      name: 'meeting',
      component: Meeting
    },
    {
      path: '/orderFinish',
      name: 'orderFinish',
      component: OrderFinish
    },
    {
      path: '/business',
      name: 'business',
      component: Business
    },
    {
      path: '/business2',
      name: 'business2',
      component: Business2
    },
    {
      path: '/customized',
      name: 'customized',
      component: Customized
    },
    {
      path: '/customizedLead',
      name: 'customizedLead',
      component: CustomizedLead
    },
    {
      path: '/vip',
      name: 'vip',
      component: Vip,
      children: [
        {
          path: ':id',
          name: 'vipDetail',
          component: VipDetail
        }
      ]
    },
    {
      path: '/tourLead',
      name: 'tourLead',
      component: TourLead
    },
    {
      path: '/tour',
      name: 'tour',
      component: Tour,
      children: [
        {
          path: ':id',
          component: TourDetail
        }
      ]
    },
    {
      path: '/mMallStar',
      name: 'mallStar',
      component: MallStar,
      children: [
        {
          path: ':id',
          component: TourDetail
        }
      ]
    },
    {
      path: '/mallNews',
      name: 'mallNews',
      component: MallNews,
      children: [
        {
          path: ':id',
          component: TourDetail
        }
      ]
    },
    {
      path: '/tourSubmit',
      name: 'tourSubmit',
      component: TourSubmit
    },
    {
      path: '/selectedTeamDate',
      name: 'teamDate',
      component: selectedTeamDate
    },
    {
      path: '/purse',
      name: 'purse',
      component: Purse
    },
    {
      path: '/mallWelfare',
      name: 'MallWelfare',
      component: MallWelfare
    },
    {
      path: '/mallActivities',
      name: 'MallActivities',
      component: MallActivities
    },
    {
      path: '/mallStar',
      name: 'MallStar',
      component: MallStar,
      children: [
        {
          path: ':id',
          component: TourDetail
        }
      ]
    },
    {
      path: '/mallSale',
      name: 'MallSale',
      component: MallSale
    },
    {
      path: '/mineTicket',
      name: 'mineTicket',
      component: MineTicket
    },
    {
      path: '/mineInvoice',
      name: 'mineInvoice',
      component: MineInvoice
    },
    {
      path: '/cardInfo',
      name: 'cardInfo',
      component: CardInfo
    },
    {
      path: '/addInvoice',
      name: 'addInvoice',
      component: AddInvoice
    },
    {
      path: '/mineCollection',
      name: 'mineCollection',
      component: MineCollection
    },
    {
      path: '/mineShopCart',
      name: 'mineShopCart',
      component: MineShopCart
    },
    {
      path: '/mineAddress',
      name: 'mineAddress',
      component: MineAddress
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      component: AddAddress
    },
    {
      path: '/submitOrderGoods',
      name: 'submitOrderGoods',
      component: SubmitOrderGoods,
      children: [
        {
          path: '/submitOrderGoods/chooseAddress',
          component: MineAddress,
          children: [
            {
              path: '/submitOrderGoods/chooseAddress/addAddress',
              component: AddAddress
            }
          ]
        },
        {
          path: '/submitOrderGoods/mineInvoice',
          component: MineInvoice,
          children: [
            {
              path: '/submitOrderGoods/mineInvoice/addInvoice',
              component: AddInvoice
            }
          ]
        },
        {
          path: '/submitOrderGoods/mineTicket',
          component: MineTicket
        }
      ]
    },
    {
      path: '/submitOrderGoodsShop',
      name: 'submitOrderGoodsShop',
      component: SubmitOrderGoodsShop,
      children: [
        {
          path: '/submitOrderGoodsShop/chooseAddress',
          component: MineAddress,
          children: [
            {
              path: '/submitOrderGoodsShop/chooseAddress/addAddress',
              component: AddAddress
            }
          ]
        },
        {
          path: '/submitOrderGoodsShop/mineInvoice',
          component: MineInvoice,
          children: [
            {
              path: '/submitOrderGoodsShop/mineInvoice/addInvoice',
              component: AddInvoice
            }
          ]
        },
        {
          path: '/submitOrderGoodsShop/mineTicket',
          component: MineTicket
        }
      ]
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    },
    {
      path: '/orderPrePay',
      name: 'orderPrePay',
      component: OrderPrePay
    },
    {
      path: '/orderComPay',
      name: 'orderComPay',
      component: OrderComPay,
      children: [
        {
          path: '/orderComPay/orderDetailHotel',
          component: OrderDetailHotel
        },
        {
          path: '/orderComPay/orderDetailGoods',
          component: OrderDetailGoods
        }
      ]
    },
    {
      path: '/orderAll',
      name: 'orderAll',
      component: OrderAll,
      children: [
        {
          path: '/orderAll/orderDetailHotel',
          component: OrderDetailHotel
        },
        {
          path: '/orderAll/orderDetailGoods',
          component: OrderDetailGoods
        }
      ]
    },
    {
      path: '/orderRefundHotel',
      name: 'orderRefundHotel',
      component: OrderRefundHotel
    },
    {
      path: '/orderRefundGoods',
      name: 'orderRefundGoods',
      component: OrderRefundGoods
    },
    {
      path: '/vipOrderConfirm',
      name: 'vipOrderConfirm',
      component: VipOrderConfirm,
      children: [
        {
          path: '/vipOrderConfirm/mineInvoice',
          component: MineInvoice
        },
        {
          path: '/vipOrderConfirm/chooseAddress',
          component: MineAddress,
          children: [
            {
              path: ':addAddress',
              component: AddAddress
            }
          ]
        }
      ]
    },
    {
      path: '/addComment',
      name: 'addComment',
      component: AddComment
    },
    {
      path: '/mineWish',
      name: 'mineWish',
      component: MineWish
    },
    {
      path: '/orderCustomized',
      name: 'orderCustomized',
      component: OrderCustomized
    },
    {
      path: '/orderDetailCustomized',
      name: 'OrderDetailCustomized',
      component: OrderDetailCustomized
    },
    {
      path: '/orderCustomizedConfirm',
      name: 'orderCustomizedConfirm',
      component: OrderCustomizedConfirm,
      children: [
        {
          path: '/orderCustomizedConfirm/mineInvoice',
          component: MineInvoice
        }
      ]
    }
  ]
})
