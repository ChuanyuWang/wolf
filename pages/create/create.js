// pages/create/create.js

const app = getApp()

const ROLES = [
  { name: '预言家', value: 'seer', checked: 'true' },
  { name: '女巫', value: 'witch', checked: 'true' },
  { name: '猎人', value: 'hunter' },
  { name: '白痴', value: 'idiot' },
  { name: '守卫', value: 'guard' },
  { name: '骑士', value: 'knight' },
  { name: '盗贼', value: 'thief' },
  { name: '熊', value: 'bear' },
  { name: '狐狸', value: 'fox' },
  { name: '长老', value: 'elder' },
  { name: '禁言者', value: 'silence' },
  { name: '丘比特', value: 'cupid' },
  { name: '野孩子', value: 'waif' },
  { name: '魔术师', value: 'magician' }
]

const WOLF_ROLES = [
  { name: '白狼王', value: 'white' },
  { name: '狼美人', value: 'beauty' },
  { name: '恶魔', value: 'demon' },
  { name: '魅魔', value: 'succubus' },
  { name: '隐狼', value: 'stealth' }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    players: 6,
    players_index: 0,
    players_range: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    wolf: 2,
    wolf_index: 0,
    wolf_range: [2, 3, 4, 5, 6, 7, 8, 9],
    villagers: 3,
    roles: ROLES,
    wolf_roles: WOLF_ROLES,
    selected_roles: ['seer', 'witch'],
    selected_wolf_roles: []
  },

  bindPlayerChange: function (e) {
    this.setData({
      players: this.data.players_range[e.detail.value]
    })
    let new_wolf_range = [];
    for (let i = 2; i <= this.data.players / 2; i++) {
      new_wolf_range.push(i);
    }
    //更新狼人数量选择区间
    this.setData({
      wolf_range: new_wolf_range
    })
    this.checkVillagersCount()
  },
  checkMutantChange: function (e) {
    this.setData({
      selected_roles: e.detail.value
    })
    this.checkVillagersCount()
  },
  bindWolfChange: function (e) {
    this.setData({
      wolf: this.data.wolf_range[e.detail.value]
    })
    if (this.data.wolf < this.data.selected_wolf_roles.length) {
      this.setData({
        wolf_roles: WOLF_ROLES
      })
    }
    this.checkVillagersCount()
  },
  checkWolfChange: function (e) {
    this.setData({
      selected_wolf_roles: e.detail.value
    })
    if (this.data.selected_wolf_roles.length > this.data.wolf) {
      // update wolf
      this.setData({
        //TODO, update wolf_index
        wolf: this.data.selected_wolf_roles.length
      })
    }
    this.checkVillagersCount()
  },
  checkVillagersCount: function () {
    //更新村民数量
    this.setData({
      villagers: this.data.players - this.data.wolf - this.data.selected_roles.length
    })
    if (this.data.villagers < 1) {
      wx.showModal({
        title: '错误',
        content: '屠边局村民的人数不能少于1人',
        showCancel: false
      })
    }
  },

  createGame: function () {
    var gameoptions = {
      type: 'lyingman',
      player_number: this.data.players,
      wolf_number: this.data.wolf,
      villager_number: this.data.villagers,
      wolf_roles: this.data.selected_wolf_roles,
      roles: this.data.selected_roles
    }
    wx.request({
      url: app.config.baseUrl + '/wx/creategame',  // 获取openid
      method: 'POST',
      data: gameoptions,
      success: res => {
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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