// pages/goods_list/goods_list.js

import { request } from "../../request/good_request.js";

Page({

  /**
   * 页面的初始数据
   */
  data:{
    itemList:[
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    let that = this;
    let app = getApp()
    let setUrl = 0;
    
    async function setUrlBe(){
      if(options["category"]==="all"){
        setUrl = "https://"+app.globalData.ip+"/goods/allItems/";
      }else{
        setUrl = "https://"+app.globalData.ip+"/goods/itemLists/?category="+options["category"];
      }
    }

    async function getDetail(){
      try{
        const setU = await setUrlBe();
        const res = await request({url:setUrl});
        const hide = await wx.hideLoading();
        console.log("res",res)
        that.setData({
          itemList:res.data
        })
      }catch(err){
        console.log(err);
      }
    };
    getDetail();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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