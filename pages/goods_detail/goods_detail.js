// pages/goods_detail/goods_detail.js

import { request } from "../../request/good_request.js";

Page({
  data: {
    goods_detail:[],
    cart:[]
  },

  onLoad: function (options) {
    wx.showLoading();
    let that = this;
    let setUrl = "http://127.0.0.1:8080/goods/detail?gid="+options["gid"];
    async function getDetail(){
      try{
        const res = await request({url:setUrl});
        const hide = await wx.hideLoading();
        /* 此处原用 that.data.goods_detail = res.data 
           进行赋值，但在request响应前就把此值给wxml页面渲染
           造成页面空白，后采用setData */
        that.setData({
          goods_detail:res.data
        })
      }catch(err){
        console.log(err);
      }
    };
    getDetail();

    let Url = "http://127.0.0.1:8080/cart/getcart?phone=15757610036";
    let cartUrl = "http://127.0.0.1:8080/cart/setcart"
    async function getCart(){
      try{
        const res = await request({url:Url});
        const store = {
          time:Date.now(),
          data:res
        }
        wx.setStorageSync('cart', store);
      }catch(err){
        console.log(err);
      }
    };
    getCart();

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
    request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
    wx.setStorageSync('cart', "");
  },

  handlePreviewImage(e){
    const url = this.data.goods_detail.photo;
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: url,
    })
  },

  handleCartAdd(){
    let that = this;
    let setUrl = "http://127.0.0.1:8080/cart/getcart?phone=15757610036";
    let cartUrl = "http://127.0.0.1:8080/cart/setcart";
    async function getCart(){
      try{
        const res = await request({url:setUrl});
        const store = {
          time:Date.now(),
          data:res
        }
        wx.setStorageSync('cart', store);
      }catch(err){
        console.log(err);
      }
    };

    async function checkCart(){
      try{
        const carts = wx.getStorageSync('cart');
        if(Date.now()-carts.time>1000*10){
          const a = await request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }})
          const b = await getCart();
          const c = await checkCart();
        }else{
          for (var i=0;i<carts.data.data.goods.length;i++){ 
            const goods = JSON.parse(carts.data.data.goods[i]);
            console.log(JSON.stringify(goods));
            if(that.data.goods_detail["gid"]===goods.gid){
              goods.amount++;
              carts.data.data.goods[i] = JSON.stringify(goods);
            }
          }
          wx.setStorageSync('cart', carts);
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
          });
        } 
      }catch(err){
        console.log(err);
      }
    }
    checkCart();
  }
})
