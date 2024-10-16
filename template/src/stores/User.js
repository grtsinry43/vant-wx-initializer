/**
 * @name UserStore
 * @description 用户信息
 * 这里打开网页时就会通过携带wx相关信息向后端请求，获取信息并存储
 */
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            name: '',
            phone: '',
            title: '',
            belong: '',
            avatar: '',
        }
    },
    actions: {
        /**
         * @name setUser
         * @param data 传入的data应该是一个对象，包含name, phone, title
         */
        setUser(data){
            this.name = data.name;
            this.phone = data.phone;
            this.title = data.title;
        },
        /**
         * @name setAvatar
         * @param avatar 传入的avatar应该是一个字符串，表示头像的url
         */
        setAvatar(avatar){
            this.avatar = avatar;
        }
    },
});
