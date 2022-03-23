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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this;
    let Url = "http://127.0.0.1:8080/cart/getcart?phone=15757610036";
    let cartUrl = "http://127.0.0.1:8080/cart/setcart"
    async function getCart(){
      try{
        const a  = await wx.showLoading();
        const res = await request({url:Url});
        const hide = await wx.hideLoading();
        const store = {
          time:Date.now(),
          data:res
        }

        

        wx.setStorageSync('cart', store);
        let carts = wx.getStorageSync('cart');
        let prec = [];
        for (let index = 0; index < carts.data.data.goods.length; index++) {
          let c = carts.data.data.goods[index];
          prec[index] = c
          prec[index].checked = false
       }
       const s = {
        time:Date.now(),
        data:prec
       }
       console.log("load")
       that.setData({
          cart:s,
       })
      }catch(err){
        console.log(err);
      }
    };



    let carts = wx.getStorageSync('cart');
    if(!carts||carts===""||Date.now()-carts.time>1000*10){
      getCart();
    }else{
      let prec = []
      for (let index = 0; index < carts.data.data.goods.length; index++) {
        let c = carts.data.data.goods[index];
        prec[index] = c
        prec[index].checked = false;
      }
      const ss = {
        time:Date.now(),
        data:prec
       }
       that.setData({
          cart:ss
       })
    }

  
  },

  onHide: function () {
    let cartUrl = "http://127.0.0.1:8080/cart/setcart";
    const carts = wx.getStorageSync('cart');
    console.log("carts: ",carts);
    request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let cartUrl = "http://127.0.0.1:8080/cart/setcart";
    const carts = wx.getStorageSync('cart');
    request({url:cartUrl,data:carts,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
    wx.setStorageSync('cart', "");
  },


  handlePay(){
    
  },


})