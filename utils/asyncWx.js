/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-16 11:28:22
 * @LastEditTime: 2023-03-17 22:11:39
 * @LastEditors: Zoe
 */

/* 
promise 形式 chooseAddress
*/
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    })
}

/* 
promise 形式 showModal
*/
export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/* 
promise 形式 showToast
*/
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    })
}

/* 
promise 形式 login
*/
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

/* 
promise 形式 requestPayment
*/
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);

            },
        });
    })
}

/* 
promise 形式 requestPayment
*/
export const getUserProfile = () => {
    return new Promise((resolve, reject) => {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })

    })
}