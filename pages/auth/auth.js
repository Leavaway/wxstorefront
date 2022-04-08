// pages/auth/auth.js

import { request } from "../../request/good_request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    portrait:{},
    nickName:{},
    token:{},
    phone:{}
  },

  onLoad:function(options){

  },

  handleUserInfo(e){
    const res = wx.getUserProfile({
      desc: '用于完善用户信息',
      success:res=>{
        const userInfo = res.userInfo
        const cache = {
          time:Date.now(),
          data:userInfo
        }
        wx.setStorageSync('userInfo', cache)
        this.setData({
          portrait:userInfo.avatarUrl,
          nickName:userInfo.nickName
        })
        wx.switchTab({
          url: '../user/user',
        })
      },
      fail:res=>{
        console.log("授权失败",res)
      }
    })
  },

  getPhoneNumber(e){
    let that = this

    const code = e.detail.code
    const token = this.data.token
    const phone = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token="+token;

    async function getPhone(){
      try{
        const res = await request({url:phone,data:{
          code:code
        },method:"post"});
        that.setData({
          phone: res.data.phone_info.phoneNumber
        })
        const cache = {
          time:Date.now(),
          data:res.data.phone_info.phoneNumber
        }
        wx.setStorageSync('phone',cache)
      }catch(err){
        console.log(err)
      }
    }
    getPhone()

  }
})