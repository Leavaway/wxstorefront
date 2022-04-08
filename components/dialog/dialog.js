// components/dialog/dialog.js

import { request } from "../../request/good_request.js";
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题
    title: {          
      type: String,     
      value: '标题' // 默认值
    },
    // 弹窗内容
    content :{
      type : String ,
      value : '弹窗内容'
    },

    // 弹窗确认按钮文字
    confirmText :{
      type : String ,
      value : '确定'
    } 
  },

  /**
   * 组件内私有数据
   */
  data: {
    // 弹窗显示控制
    isShow:true,
    token:{}
  },

  /**
   * 组件的公有方法列表
   */
  methods: {

    //隐藏弹框
    hideDialog(){
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog(){
      this.setData({
        isShow: !this.data.isShow
      })
    },
     /**
     * triggerEvent 组件之间通信
     */
    confirmEvent(){
      this.triggerEvent("confirmEvent");
    },

    getPhoneNumber(e){
      let that = this


      
      

      async function getPhone(){
        try{
          const tok = that.data.token
          // const phone = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token="+tok;
          const phone = "https://www.jingjiangjinglian.cn/phone/getPhone/";
          // const phone = "http://127.0.0.1:8080/phone/getPhone/";
          const code = e.detail.code

          const res = await request({url:phone,data:{
            code:code
          },method:"post"});
          const cache = {
            time:Date.now(),
            data:res.data.phone_info.phoneNumber
          }
          wx.setStorageSync('phone',cache)
        }catch(err){
          console.log(err)
        }
      }

      async function carry(){
        const b = await getPhone()

      }
      carry()
      this.triggerEvent("getphonenumber");
    }

  }
})
