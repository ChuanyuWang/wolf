// pages/gamepanel/gamepanel.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.room) {
      app.globalData.room = options.room
    }
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    wx.connectSocket({
      url: 'ws://localhost:3000/',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: "GET"
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
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