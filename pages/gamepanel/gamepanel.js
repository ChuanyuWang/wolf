// pages/gamepanel/gamepanel.js
const app = getApp()
const io = require('../../utils/weapp.socket.io.js')

Page({
  socket: null,

  /**
   * 页面的初始数据
   */
  data: {

  },

  handleConnectEvent(socket) {
    // Fired upon a connection including a successful reconnection.
    socket.on('connect', () => {
      console.log('connect God successfully');
    })

    socket.on('connect_error', (error) => {
      console.error('connect God fails: ' + error);
    });

    socket.on('connect_timeout', (timeout) => {
      // ...
    });

    socket.on('error', (error) => {
      console.error('socket error: ' + error);
    });

    socket.on('disconnect', (reason) => {
      console.log('disconnect God with reason: ' + reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      // ...
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      // ...
    });

    socket.on('reconnecting', (attemptNumber) => {
      // ...
    });

    socket.on('reconnect_error', (error) => {
      // ...
    });

    socket.on('reconnect_failed', () => {
      // ...
    });
  },

  loopGameEvent(socket) {
    socket.on('update', (data) => {
      if (data.error)
        return console.error(data.error);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.room) {
      app.globalData.room = options.room
    }

    // To be delete, debug only
    app.globalData.room = app.globalData.room == -1 ? 7231 : app.globalData.room

    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    this.socket = io('ws://localhost:3000/', {
      query: {
        room: app.globalData.room,
        userInfo: app.globalData.userInfo ? {
          nickname: app.globalData.userInfo.nickname,
          avatarUrl: app.globalData.userInfo.avatarUrl
        } : {},
        openid: app.globalData.openid
      }
    })

    this.handleConnectEvent(this.socket)

    this.loopGameEvent(this.socket)

    this.socket.on('which room', (fn) => {
      fn(app.globalData.room);
    });
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
    if (this.socket) {
      this.socket.close()
    }
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