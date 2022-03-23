// pages/user/user.js

import { request } from "../../request/good_request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    collectNum:0,
    historyNum:0,
    token:{},
    phone:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    // let that = this
    // const token = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe8c4d62827bb0bd1&secret=ef7ecbd22075b4a26c92f1e9fdeba051"
    // async function getToken(){
    //   try{
    //     const res = await request({url:token});
    //     that.setData({
    //       token: res.data.access_token
    //     })
    //     console.log("token:",res)
    //   }catch(err){
    //     console.log(err)
    //   }
    // }
    // getToken()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
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


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if(!userInfo||Date.now()-userInfo.time>1000*60*60*24*30){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return;
    }else{
      this.setData({
        userInfo:wx.getStorageSync('userInfo').data
      })
    }

    // 加载收藏内容
    let that = this;
    let app = getApp()
    const phone = wx.getStorageSync('phone')
    let Url = "https://"+app.globalData.ip+"/collect/check?phone="+phone.data;
    async function getCart(){
      try{
        const a  = await wx.showLoading();
        const res = await request({url:Url});
        const hide = await wx.hideLoading();
        that.setData({
          collectNum:res.data.collectGoodsList.length,
        })
       const cache = {
         time:Date.now(),
         data:res.data
       }
       wx.setStorageSync('collect', cache)
      }catch(err){
        console.log(err);
      }
    };
    getCart()

    //设置历史足迹
    let length = wx.getStorageSync('history').length
    this.setData({
      historyNum:length
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})