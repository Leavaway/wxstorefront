// index.js
Page({
  data:{
    photoList:[
      {
        id:1,
        name:"八重神子",
        source:"https://s3.bmp.ovh/imgs/2022/02/8bbfb7e017460c3f.jpg"
      },{
        id:2,
        name:"枫原万叶",
        source:"https://s3.bmp.ovh/imgs/2022/02/278add55a041f8e6.jpg"
      },{
        id:3,
        name:"胡桃",
        source:"https://s3.bmp.ovh/imgs/2022/02/9e266fff9796c274.jpg"
      }
    ],
    itemList:[
      {
        id:1,
        title:"2022版精讲精练历史与社会道德与法治七年级下册知识点解读",
        price:"20",
        source:"https://s3.bmp.ovh/imgs/2022/02/8bbfb7e017460c3f.jpg"
      },{
        id:2,
        title:"2022版精讲精练历史与社会道德与法治七年级下册知识点解读",
        price:"20",
        source:"https://s3.bmp.ovh/imgs/2022/02/278add55a041f8e6.jpg"
      },{
        id:3,
        title:"2022版精讲精练历史与社会道德与法治七年级下册知识点解读",
        price:"20",
        source:"https://s3.bmp.ovh/imgs/2022/02/9e266fff9796c274.jpg"
      },{
        id:4,
        title:"2022版精讲精练历史与社会道德与法治七年级下册知识点解读",
        price:"20",
        source:"https://s3.bmp.ovh/imgs/2022/02/2afc0305fee0e72e.jpg"
      }
    ]
  },
  onLoad: function(options){
    const init = []
    wx.setStorageSync('history', init)
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
