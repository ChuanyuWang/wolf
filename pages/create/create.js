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
    villagers: 2,
    roles: ROLES,
    wolf_roles: WOLF_ROLES,
    options: {
      witch_save_on_first_night: false
    }
  },

  count: function(roles) {
    var count = 0;
    roles.forEach(function(value){
      if (value.checked) count++;
    })
    return count;
  },

  bindPlayerChange: function (e) {
    var player_number = this.data.players_range[e.detail.value];
    if (player_number - this.data.wolf - this.count(this.data.roles) < 1) {
      this.warnVillagersCount()
      return;
    }

    this.setData({
      players: player_number,
      players_index: e.detail.value,
      villagers: player_number - this.data.wolf - this.count(this.data.roles)
    })
    let new_wolf_range = [];
    for (let i = 2; i <= this.data.players / 2 + 1; i++) {
      new_wolf_range.push(i);
    }
    //更新狼人数量选择区间
    this.setData({
      wolf_range: new_wolf_range
    })
  },
  checkMutantChange: function (e) {
    // 村民数量不能少于1
    let mutant_number = e.detail.value.length
    if (this.data.players - mutant_number - this.data.wolf < 1) {
      // restore the roles
      this.setData({
        roles: this.data.roles
      })
      this.warnVillagersCount()
      return;
    }

    for (var i = 0; i < this.data.roles.length; i++) {
      var item = this.data.roles[i];
      item.checked = false;
      for (var j = 0; j < e.detail.value.length; j++) {
        if (item.value == e.detail.value[j]) {
          item.checked = true
          break;
        }
      }
    }

    // update roles
    this.setData({
      roles: this.data.roles,
      villagers: this.data.players - this.data.wolf - mutant_number
    })
    //this.checkVillagersCount()
  },
  bindWolfChange: function (e) {
    var wolf_number = this.data.wolf_range[e.detail.value]
    if (this.data.players - wolf_number - this.count(this.data.roles) < 1) {
      this.warnVillagersCount()
      return;
    }
    if (wolf_number < this.count(this.data.wolf_roles)) {
      //狼人数量小于狼人角色数量
      wx.showModal({
        title: '错误',
        content: '狼人数量小于狼人角色数量',
        showCancel: false
      })
      return;
    }
    // update wolf
    this.setData({
      wolf: wolf_number,
      wolf_index: e.detail.value,
      villagers: this.data.players - wolf_number - this.count(this.data.roles)
    })
  },
  checkWolfChange: function (e) {
    // 村民数量不能少于1
    let wolf_number = e.detail.value.length > this.data.wolf ? e.detail.value.length : this.data.wolf
    if (this.data.players - wolf_number - this.count(this.data.roles) < 1) {
      // restore the wolf roles
      this.setData({
        wolf_roles: this.data.wolf_roles
      })
      this.warnVillagersCount()
      return;
    }

    // update wolf
    this.setData({
      wolf: wolf_number,
      //TODO, update wolf_index
      //wolf_index: TBD
      villagers: this.data.players - wolf_number - this.count(this.data.roles)
    })

    for (var i = 0; i < this.data.wolf_roles.length; i++) {
      var item = this.data.wolf_roles[i];
      item.checked = false;
      for (var j = 0; j < e.detail.value.length; j++) {
        if (item.value == e.detail.value[j]) {
          item.checked = true
          break;
        }
      }
    }

    this.setData({
      wolf_roles: this.data.wolf_roles
    })
  },
  warnVillagersCount: function () {
    wx.showModal({
      title: '错误',
      content: '屠边局村民的人数不能少于1人',
      showCancel: false
    })
  },

  setWitchOption: function(e) {
    this.setData({
      'options.witch_save_on_first_night': Boolean(e.detail)
    })
  },

  createGame: function () {
    // get selected roles
    var wolf_roles = this.data.wolf_roles.filter(function(value){
      return value.checked
    })
    var roles = this.data.roles.filter(function (value) {
      return value.checked
    })
    var gameoptions = {
      type: 'lyingman',
      player_number: this.data.players,
      wolf_number: this.data.wolf,
      villager_number: this.data.villagers,
      wolf_roles: wolf_roles,
      roles: roles,
      options: this.data.options
    }
    wx.request({
      url: app.config.baseUrl + '/wx/creategame', 
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