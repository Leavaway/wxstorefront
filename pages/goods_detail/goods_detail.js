// pages/goods_detail/goods_detail.js

import { request } from "../../request/good_request.js";

Page({
  data: {
    goods_detail:{},
    cart:[],
    collect:{},
    isCollect:false,
  },

  onLoad: function (options) {
    const phoneCheck = wx.getStorageSync('phone')
    if(!phoneCheck){
      wx.switchTab({
        url: '../index/index',
      })
    }
    wx.showLoading();
    var that = this;
    let app = getApp();
    let setUrl = app.globalData.ip+"/goods/detail?gid="+options["gid"];
    async function getDetail(){
      try{
        const res = await request({url:setUrl})
        /* 此处原用 that.data.goods_detail = res.data 
           进行赋值，但在request响应前就把此值给wxml页面渲染
           造成页面空白，后采用setData */ 
        that.setData({
          goods_detail:res.data,
        })
      }catch(err){
        console.log(err);
      }
    };

    const phone = wx.getStorageSync('phone')
    let Url = app.globalData.ip+"/cart/getcart?phone="+phone.data;
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


    // 设置商品收藏
    let setC = app.globalData.ip+"/collect/check?phone="+phone.data;
    async function getCollect(){
      try{
        // const a  = await wx.showLoading();
        const res = await request({url:setC});
        // const hide = await wx.hideLoading();

        
        if(res.data.collectGoodsList){
          for (let i = 0; i < res.data.collectGoodsList.length; i++) {
            if(res.data.collectGoodsList[i].gid==options["gid"]){
              that.setData({
                isCollect:true,
              })
            }
          }
        }else{
          res.data.collectGoodsList=[]
        }

        that.setData({
          collect:res.data,
        })
      }catch(err){
        console.log(err);
      }
    };
    getCollect()

    async function setCache(){
      const history = wx.getStorageSync('history')
      if(history){
        let detail = that.data.goods_detail
        const cache = {
          gid:detail.gid,
          title:detail.title,
          price:detail.price,
          photo:detail.photo
        }
        const len = history.length
        if(len>=20){
          history.pop()
          history.splice(0,0,cache)
        }else{
          history.splice(0,0,cache)
        }
        wx.setStorageSync('history', history)
      }
    }
    async function set(){
      const a = await getDetail();
      const b = await setCache();
      wx.hideLoading();
    }
    set()
  },

  onShow: function(){
    const phoneCheck = wx.getStorageSync('phone')
    if(!phoneCheck){
      wx.switchTab({
        url: '../index/index',
      })
    }
  },

  onHide: function () {
    let app = getApp();
    let cartUrl =  app.globalData.ip+"/cart/setcart";
    const carts = wx.getStorageSync('cart');
    if(carts.data.data){
      request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
      wx.setStorageSync('cart', "");
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let app = getApp()
    let cartUrl = app.globalData.ip+"/cart/setcart";
    const carts = wx.getStorageSync('cart');
    // if(!carts&&carts!=""){
    //   request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
    //   wx.setStorageSync('cart', "");
    // }
    if(carts.data.data){
      request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
      wx.setStorageSync('cart', "");
    }
    
    const collects = this.data.collect;
    if(collects){
      let setCollect = app.globalData.ip+"/collect/setCheck";
      request({url:setCollect,data:collects,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
    }
    
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
    let app = getApp()
    let that = this;
    const phone = wx.getStorageSync('phone')
    let setUrl = app.globalData.ip+"/cart/getcart?phone="+phone.data;
    let cartUrl = app.globalData.ip+"/cart/setcart";
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
          let ishere = false
          let maxLen = carts.data.data.goods.length
          for (var i=0;i<carts.data.data.goods.length;i++){ 
            const goods = carts.data.data.goods[i];
            if(that.data.goods_detail["gid"]===goods.gid){
              ishere = true
              goods.amount++;
              carts.data.data.goods[i] = goods;
            }
          }
          if(!ishere){
            const good_detail = that.data.goods_detail
            const newGood = {
              gid:good_detail.gid,
              price:good_detail.price,
              amount:1,
              photo:good_detail.photo[0],
              title:good_detail.title,
              checked:false
            }
            carts.data.data.goods[maxLen]=newGood
            maxLen++
            ishere=true
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
  },

  handleCollect(){
    let that = this
    let collects = that.data.collect.collectGoodsList
    let isC = that.data.isCollect;
    const detail = that.data.goods_detail
    if(isC){
      for (let i = 0; i < collects.length; i++) {
        if(collects[i].gid==detail.gid){
          collects.splice(i,1)
        }
      }
    }else{
      const newC = {
        gid:detail.gid,
        title:detail.title,
        price:detail.price,
        photo:detail.photo[0]
      }
      collects.push(newC)
    }
    const cache = {
      collectGoodsList:collects,
      id:that.data.collect.id,
      phone:that.data.collect.phone
    }
    that.setData({
      isCollect:!isC,
      collect:cache
    })
    
  },
  handleSuperCartAdd(){
    let app = getApp()
    let that = this;
    const phone = wx.getStorageSync('phone')
    let setUrl = app.globalData.ip+"/cart/getcart?phone="+phone.data;
    let cartUrl = app.globalData.ip+"/cart/setcart";
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
          let ishere = false
          if(carts.data.data.goods){
            let maxLen = carts.data.data.goods.length
            for (var i=0;i<carts.data.data.goods.length;i++){ 
              const goods = carts.data.data.goods[i];
              if(that.data.goods_detail["gid"]===goods.gid){
                ishere = true
                goods.amount++;
                carts.data.data.goods[i] = goods;
              }
            }
          }
          
          if(!ishere){
            const good_detail = that.data.goods_detail
            const newGood = {
              gid:good_detail.gid,
              price:good_detail.price,
              amount:1,
              photo:good_detail.photo[0],
              title:good_detail.title,
              checked:false
            }
            if(carts.data.data.goods){
              const goods = carts.data.data.goods;
              goods.push(newGood);
              carts.data.data.goods = goods

            }else{
              const phone = wx.getStorageSync('phone')
              let goods = carts.data.data
              goods = {
                goods:[newGood],
                phone:phone.data
              }
              carts.data.data = goods

              console.log("goods",goods)

            }


            ishere=true
          }
          wx.setStorageSync('cart', carts);

        } 
      }catch(err){
        console.log(err);
      }
    }
    checkCart();
    wx.switchTab({
      url: '../cart/cart',
    })
    }
})
