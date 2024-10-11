import { makeAutoObservable } from 'mobx'

class UserStore {
    id = null
    phone = null
    isUser = false
    isAdmin = false
    isEmployee = false
    isBrigade = false

    constructor() {
        makeAutoObservable(this)
    }

    login({id, phone, role}) {
        this.id = id
        this.phone = phone
        this.isUser = role === 'USER'
        this.isAdmin = role === 'ADMIN'
        this.isEmployee = role === 'EMPLOYEE'
        this.isBrigade = role === 'INSTALLER'
    }

    logout() {
        this.id = null
        this.phone = null
        this.isUser = false
        this.isAdmin = false
        this.isEmployee = false
        this.isBrigade = false
    }
}

export default UserStore