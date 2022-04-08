// index.js

import { request } from "../../request/good_request.js";

Page({
  data:{
    itemList:[
    ]
  },
  onLoad: function(options){
    const init = []
    wx.setStorageSync('history', init)
    var that = this
    let app = getApp();
    let linshi = []
    wx.showLoading({
      title: '正在加载',
    })
    async function getDetail(){
      try{
        let setUrl = app.globalData.ip+"/goods/allItems";
        const res = await request({url:setUrl})
        /* 此处原用 that.data.goods_detail = res.data 
           进行赋值，但在request响应前就把此值给wxml页面渲染
           造成页面空白，后采用setData */ 
        that.setData({
          itemList:res.data.slice(0,4),
        })
      }catch(err){
        console.log(err);
      }
    };
    getDetail()
    wx.hideLoading({
      success: (res) => {},
    })
  },

  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    const phone = wx.getStorageSync('phone')
    if(phone&&Date.now()-phone.time<1000*60*60*24*7){
      this.dialog.hideDialog();
    }
},

  showDialog: function(){
      this.dialog.showDialog();
  },

  confirmEvent: function(){
      this.dialog.hideDialog();
  },
  getPhoneNumber(e){
    // 用户点击授权后，这里可以做一些登陆操作
    
  },


})
