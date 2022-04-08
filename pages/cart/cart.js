// pages/cart/cart.js

import { request } from "../../request/good_request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allcheck:false,
    totalPrice:0,
    totalNum:0,

  },
  onLoad: function(){
    this.setData({
      totalPrice:0,
      totalNum:0,
      allcheck:false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      totalPrice:0,
      totalNum:0,
    })
    const phone = wx.getStorageSync('phone')
    // if(!phone||Date.now()-phone.time>1000*60*60*24*7){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   })
    //   return;
    // }
    let that = this;
    let app = getApp()
    let Url = app.globalData.ip+"/cart/getcart?phone="+phone.data;
    let cartUrl = app.globalData.ip+"/cart/setcart"
    async function getCart(){
      try{
        // const a  = await wx.showLoading();
        const res = await request({url:Url});
        // const hide = await wx.hideLoading();
        const store = {
          time:Date.now(),
          data:res
        }

        

        wx.setStorageSync('cart', store);
        let carts = wx.getStorageSync('cart');
        let prec = [];
        if(carts.data.data){
          for (let index = 0; index < carts.data.data.goods.length; index++) {
            let c = carts.data.data.goods[index];
            prec[index] = c
            prec[index].checked = false
         }
         const s = {
          time:Date.now(),
          data:prec
         }
         that.setData({
            cart:s,
         })
        }
        
      }catch(err){
        console.log(err);
      }
    };



    let carts = wx.getStorageSync('cart');
    if(!carts||carts===""||Date.now()-carts.time>1000*10){
      getCart();
    }else{
      let prec = []
      if(carts.data.data){
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
      
    }

  
  },

  handleChooseAddress(){
    wx.chooseAddress({
      success: (result) => {
        this.setData({
          address: result
        })
      },
    })
  },

  handleCheck(e){
    const gid = e.currentTarget.dataset.gid
    let cart = this.data.cart.data
    let index = cart.findIndex(v=>v.gid===gid)
    cart[index].checked=!cart[index].checked
    const s ={
      time:Date.now(),
      data:cart,
    }
    this.setData({
      cart:s
    });
    const cache = wx.getStorageSync('cart')
    cache.data.data.goods = cart

    wx.setStorageSync('cart', cache)
    
    const goods = this.data.cart.data
    let totalPrice = 0
    let totalNum = 0
    goods.forEach(v=>{
      if(v.checked){
        totalNum+=v.amount
        totalPrice+=v.amount*v.price
      }
    })

    this.setData({
      totalNum:totalNum,
      totalPrice:totalPrice.toFixed(2)
    })
  },

  handleAllCheck(){
    let change = !this.data.allcheck;
    this.setData({
      allcheck: change
    });
    const size = this.data.cart.data.length;
    if(size>=1){
      let s = this.data.cart.data;
      for (let index = 0; index < size; index++) {
   
        s[index].checked = change
      }
      const c ={
        time:Date.now(),
        data: s
      }
      this.setData({
        cart: c
      })
    }

    const goods = this.data.cart.data
   
    let totalPrice = 0
    let totalNum = 0
    goods.forEach(v=>{
      if(v.checked){
        totalNum+=v.amount
        totalPrice+=v.amount*v.price
      }
    })

    this.setData({
      totalNum:totalNum,
      totalPrice:totalPrice.toFixed(2)
    })
  },

  handleAdd(e){
    let that = this
    const gid = e.currentTarget.dataset.gid
    let app = getApp()
    let setUrl = app.globalData.ip+"/goods/detail?gid="+gid;
    let inventory = 0;
    async function getDetail(){
      try{
        const res = await request({url:setUrl});
  
        inventory = res.data.inventory;
     
      }catch(err){
        console.log(err);
      }
    };
    

    async function check(){
      try{
        const carts = that.data.cart.data
        for (let index = 0; index < carts.length; index++) {
          if(carts[index].gid===gid){
            if(carts[index].amount<inventory){
              carts[index].amount+=1
            }else{
              wx.showToast({
                title: '已无更多此商品库存',
                icon:"error"
              })
            }
          }
        }
      const store = {
        time:Date.now(),
        data:carts
      }
  
      that.setData({
        cart:store
      })
  
      const cache = wx.getStorageSync('cart')
      cache.data.data.goods = carts
  
      wx.setStorageSync('cart', cache)
    }catch(e){
      console.log(e)
    }
  }
    async function run(){
      const a = await getDetail();
      const b = await check();
    }
    run();
    

  },

  handleDec(e){
    const gid = e.currentTarget.dataset.gid
    const carts = this.data.cart.data
    for (let index = 0; index < carts.length; index++) {
      if(carts[index].gid===gid&&carts[index].amount>1){
        carts[index].amount-=1
      }
    }
    const store = {
      time:Date.now(),
      data:carts
    }

    this.setData({
      cart:store
    })
    const cache = wx.getStorageSync('cart')
    cache.data.data.goods = carts

    wx.setStorageSync('cart', cache)
  },

  handleInput(e){
    let that = this
    const gid = e.currentTarget.dataset.gid
    let app = getApp()
    let setUrl = app.globalData.ip+"/goods/detail?gid="+gid;
    let inventory = 0;
    async function getDetail(){
      try{
        const res = await request({url:setUrl});
   
        inventory = res.data.inventory;

      }catch(err){
        console.log(err);
      }
    };
    

    async function check(e){
      try{
        const carts = that.data.cart.data
        for (let index = 0; index < carts.length; index++) {
          if(carts[index].gid===gid){
            if(parseInt(e.detail.value)<inventory){
              carts[index].amount=parseInt(e.detail.value)
            }else{
              e.detail.value = carts[index].amount
              wx.showToast({
                title: '已无更多此商品库存',
                icon:"error"
             })
            }
        }
      }
      const store = {
        time:Date.now(),
        data:carts
      }
  
      that.setData({
        cart:store
      })
  
      const cache = wx.getStorageSync('cart')
      cache.data.data.goods = carts
  
      wx.setStorageSync('cart', cache)
    }catch(e){
      console.log(e)
    }
  }
    async function run(e){
      const a = await getDetail();
      const b = await check(e);
    }

    if(e.detail.value<=-0.000000001){
      wx.showToast({
        title: '请输入正整数',
        icon:"error"
      })
    }else if(e.detail.value%1!==0){
      wx.showToast({
        title: '请输入正整数',
        icon:"error"
      })
    }else if(e.detail.value>=1){
      run(e);
    }
    
    



      
  },
  
  onHide: function () {
    let app = getApp()
    let cartUrl = app.globalData.ip+"/cart/setcart";
    const carts = wx.getStorageSync('cart');
    if(carts.data.data){
      request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
    }
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let app = getApp()
    let cartUrl = app.globalData.ip+"/cart/setcart";
    const carts = wx.getStorageSync('cart');
    if(carts.data.data){
      request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
      wx.setStorageSync('cart', "");
    }
  },

  handleDel(e){
    let that = this
    const gid = e.currentTarget.dataset.gid
    const goods = this.data.cart.data
    wx.showModal({
      title:"提示",
      content:"您是否要删除",
      cancelColor: 'cancelColor',
      success(res){
        if(res.confirm){
          for (let index = 0; index < goods.length; index++) {
            if(goods[index].gid===gid){
              goods.splice(index,1)
            }
            const store = {
              time:Date.now(),
              data:goods
            }
            that.setData({
              cart:store
            })
            const befCache = wx.getStorageSync('cart')
            befCache.data.data.goods=goods
            befCache.time=Date.now()
            wx.setStorageSync('cart', befCache)
            let app = getApp()
            let cartUrl = app.globalData.ip+"/cart/setcart";
            const carts = wx.getStorageSync('cart');
      
            request({url:cartUrl,data:carts.data.data,method:"post",header:{ "accept": "*/*","content-type": "application/json" }});
          }
        }else if(res.cancel){
          console.log("用户取消删除")
        }
      }
    })
  },

  handlePay(){
    let that = this
    // wx.showToast({
    //   title: '暂无支付功能',
    //   icon:"error"
    // })
    const totalNum = this.data.totalNum
    const totalPrice = this.data.totalPrice
    if(this.data.address.userName===undefined){
      wx.showToast({
        title: '请先设置地址',
        icon:"error"
      })
    }else if(totalNum===0||totalPrice===0){
      wx.showToast({
        title: '请先选择商品',
        icon:"error"
      })
    }else{
      const moveCart = [];

      const cartData = that.data.cart.data
      for (let index = 0; index < cartData.length; index++) {
        const element = cartData[index];
        if(element["checked"]==true){
          moveCart.push(element["gid"])
        }
      }
      let curCart = wx.getStorageSync('cart');
      const bef = curCart.data.data.goods
      let payCart = [];
      for (let i = 0; i < moveCart.length; i++) {
        const delGid = moveCart[i];
        for (let j = 0; j < bef.length; j++) {
          const element = bef[j];
          if(element.gid==delGid){
            payCart.push(bef[j])
            bef.splice(j,1)
          }
          
        }
      }

      curCart.data.data.goods=bef
      wx.setStorageSync('cart', curCart)
      const cache = {
        data:payCart,
        time:Date.now()
      }
      wx.setStorageSync('payCart', cache)

      
      wx.navigateTo({
        url: '../pay/pay?totalPrice='+totalPrice+"&totalNum="+totalNum+"&address="+
        JSON.stringify(this.data.address),
      })
    }
  },


})