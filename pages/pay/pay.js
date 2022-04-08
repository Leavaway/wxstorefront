// pages/cart/cart.js

import { request } from "../../request/good_request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
    ip:"https://www.jingjiangjinglian.cn",
    // ip:"http://127.0.0.1:8080",
    openid:{},
    address:{}
  },
  onLoad: function(options){
    this.setData({
      totalPrice:options["totalPrice"],
      totalNum:options["totalNum"],
      address:JSON.parse(options["address"])
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const cart = wx.getStorageSync('payCart')
    this.setData({
      cart:cart
    })
  },




//充值
// 流程图1.发起支付，掉后端接口，返回订单信息，
// 和调用wx.requestPayment需要的数据
  handlePay(e){
    let that = this
    const loginUrl = this.data.ip+"/pay/openid"
    async function getopenid(){
      const res = await wx.login();
      const openid = await request({url:loginUrl,data:{
        code:res.code
      }})
      that.setData({
        openid:openid.data
      })
    }
    

    async function prepay(){
      const ip = that.data.ip + "/pay/prepay"
      const des = that.data.cart.data
      let description = ""
      for (let index = 0; index < des.length; index++) {
        const title = des[index].title;
        description+=title.substring(0,10)
        description+="; "
      }
      const result = await request({url:ip,method:"post",data:{
        amount:Math.round(that.data.totalPrice*100),
        openid:that.data.openid,
        des:description,
      }})
      const res = result.data

      return res;
    }

    async function setpay(res){
      const e = res
      wx.requestPayment({
        nonceStr: res.nonceStr,
        package: res.package,
        paySign: res.paySign,
        timeStamp: res.timeStamp,
        signType:res.signType,
        "success":function(res){
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          const orderUrl = that.data.ip + "/pay/find";
          const phone = wx.getStorageSync('phone');
          const orderDetails = [];
          const cart = that.data.cart.data;
          for (let index = 0; index < cart.length; index++) {
            const element = cart[index];
            const payItem = {
              gid:element.gid,
              title:element.title,
              price:element.price,
              orderGoodNum:element.amount
            };
            orderDetails[index]=payItem

          }
          const a = request({url:orderUrl,method:"post",data:{
            phone:phone.data,
            orderSerialNum:e.orderNo,
            address:"收货人: "+that.data.address.userName+"; 手机号: "+that.data.address.telNumber+
            "; 收货地址: "+that.data.address.provinceName+that.data.address.cityName+that.data.address.countyName+
            that.data.address.detailInfo,
            expressNumber:"尚未发货",
            orderDetails:orderDetails,
            orderTotalPrice:that.data.totalPrice,
            orderTotalNum:that.data.totalNum,
            orderPhoto:that.data.cart.data[0].photo,
            orderStatus:2.0,
            timestamp:Date.now()
          }})
          

        },
        "fail":function(res){
          wx.showToast({
            title: '支付失败',
            icon: 'error',
            duration: 2000
          })

        },
        "complete":function(res){}
      })
    }
    async function run(){
      const a = await getopenid();
      const b = await prepay();
      const c = await setpay(b);
    }

    run()
    
  },

  onHide: function () {
    wx.setStorageSync('payCart', "")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync('payCart', "")
  },


})