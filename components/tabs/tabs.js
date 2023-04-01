/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-12 17:30:48
 * @LastEditTime: 2023-03-12 18:04:11
 * @LastEditors: Zoe
 */
// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type:Array,
      value:[]
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    handleItemTap(e) {
      // 1 获取点击的索引
      const {index} = e.target.dataset;
      // 2 触发父组件中的事件 自定义
      this.triggerEvent("tabsItemChange",{index});
       
    }

  }
})
