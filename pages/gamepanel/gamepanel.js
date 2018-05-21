// pages/gamepanel/gamepanel.js
const app = getApp()
const io = require('../../utils/weapp.socket.io.js')

Page({
  socket: null,

  /**
   * 页面的初始数据
   */
  data: {
    left_players: [],
    right_players: [],
    players: [],
    selected: [],
    targets : 0,
    roles: '',
    next: '',
    logs: [
      { day: 1, message: '第一天' },
      { day: 2, message: '第一天' },
      { day: 3, message: '第一天' },
      { day: 4, message: '第一天' },
      { day: 5, message: '第一天' },
      { day: 6, message: '第一天' }
    ],
    isJudge: false
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
      console.log(data);
      this.updateGamePanel(data);
    });
  },

  selectPlayer: function(event) {
    let player = event.currentTarget.dataset.player;
    if (this.data.targets === 0) return;
    player.selected = true;
    this.data.selected.push(player);
    if (this.data.selected.length > this.data.targets) {
      this.data.selected.splice(0, 1)[0].selected = false;
    }
    // update selected flag in all players
    this.data.players.forEach((value, index, array) => {
      for (var i = 0;i<this.data.selected.length;i++) {
        if (value.seat == this.data.selected[i].seat) value.selected = true;
        else value.selected = false;
      }
    })
    if (this.data.next == 'sit down') {
      // TODO, dummy user is to be removed
      this.socket.emit('sit', player.seat, app.globalData.userInfo || {
        openid: "test open id",
        nickname: "test",
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLw0PBbQWuXPo8XqvQ8oZwmAsoJPfTiaQyAYIMUrhywIlicNzKnBxbFcZCC2kpaBJEXgibmicfibXFuWbg/132"
      })
    }
    this.updatePlayers(this.data.players);
  },

  startGame: function(event) {
    this.socket.emit('start', app.globalData.room)
  },

  updateGamePanel: function (room) {
    this.updatePlayers(room.players);
    this.setData({
      roles: room.roles,
      next: room.next
    })
    if (room.next == 'sit down') {
      this.setData({
        targets: 1,
        selected: []
      })
    }
  },

  updatePlayers: function (players) {
    var allPlayers = (players || []).map(function (value, index, array) {
      //TODO, handle status
      return {
        seat: value.seat,
        avatarUrl: value.avatarUrl ? value.avatarUrl : '/images/sitdown.png',
        role: value.role,
        isDead: value.isDead,
        isExiled: value.isExiled,
        selected: value.selected
      };
    })
    this.setData({
      players: allPlayers,
      left_players: this.getLeftPlayers(allPlayers),
      right_players: this.getRightPlayers(allPlayers)
    })
  },

  getLeftPlayers: function(players) {
    let mid = Math.ceil((players || []).length/2);
    return (players || []).slice(0, mid);
  },

  getRightPlayers: function (players) {
    let mid = Math.ceil((players || []).length / 2);
    return (players || []).slice(mid);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.room) {
      app.globalData.room = options.room
    }

    // To be delete, debug only
    app.globalData.room = app.globalData.room == -1 ? 2225 : app.globalData.room

    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    this.setData({
      isJudge: app.globalData.isJudge
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