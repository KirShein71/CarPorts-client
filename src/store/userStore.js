import { makeAutoObservable } from 'mobx'

class UserStore {
    id = null
    phone = null
    name = null
    isUser = false
    isAdmin = false
    isEmployee = false
    isBrigade = false
    isManagerSale = false
    isManagerProject = false
    isContructor = false
    isManagerProduction = false

    constructor() {
        makeAutoObservable(this)
    }

    login({id, phone, role, name}) {
        this.id = id
        this.phone = phone
        this.name = name
        this.isUser = role === 'USER'
        this.isAdmin = role === 'ADMIN'
        this.isEmployee = role === 'EMPLOYEE'
        this.isBrigade = role === 'INSTALLER'
        this.isManagerSale = role === 'ManagerSale'
        this.isManagerProject = role === 'ManagerProject'
        this.isConstructor = role === 'Constructor'
        this.isManagerProduction = role === 'ManagerProduction'
    }

    logout() {
        this.id = null
        this.phone = null
        this.name = null
        this.isUser = false
        this.isAdmin = false
        this.isEmployee = false
        this.isBrigade = false
        this.isManagerSale = false
        this.isManagerProject = false
        this.isConstructor = false
        this.isManagerProduction = false
    }
}

export default UserStore