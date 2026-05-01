import { makeAutoObservable } from 'mobx'

class UserStore {
    id = null
    phone = null
    name = null
    role = null
    projectId = null
    isUser = false
    isAdmin = false
    isEmployee = false
    isBrigade = false
    isManagerSale = false
    isManagerProject = false
    isConstructor = false
    isManagerProduction = false

    constructor() {
        makeAutoObservable(this)
    }

    login({id, phone, role, name, projectId}) {
        this.id = id
        this.phone = phone
        this.name = name || null
        this.role = role
        this.projectId = projectId || null
        
        // Сбрасываем все флаги
        this.isUser = false
        this.isAdmin = false
        this.isEmployee = false
        this.isBrigade = false
        this.isManagerSale = false
        this.isManagerProject = false
        this.isConstructor = false
        this.isManagerProduction = false
        
        // Устанавливаем правильный флаг на основе роли
        switch (role) {
            case 'User':
                this.isUser = true
                break
            case 'Admin':
                this.isAdmin = true
                break
            case 'Employee':
                this.isEmployee = true
                break
            case 'Installer':
                this.isBrigade = true
                break
            case 'ManagerSale':
                this.isManagerSale = true
                break
            case 'ManagerProject':
                this.isManagerProject = true
                break
            case 'Constructor':
                this.isConstructor = true
                break
            case 'ManagerProduction':
                this.isManagerProduction = true
                break
            default:
                console.warn('Unknown role:', role)
        }
        
        // Сохраняем в localStorage для персистентности
        localStorage.setItem('userRole', role)
        localStorage.setItem('userId', id)
        if (projectId) localStorage.setItem('projectId', projectId)
        
        console.log('User logged in:', { role, name, projectId })
    }

    logout() {
        this.id = null
        this.phone = null
        this.name = null
        this.role = null
        this.projectId = null
        this.isUser = false
        this.isAdmin = false
        this.isEmployee = false
        this.isBrigade = false
        this.isManagerSale = false
        this.isManagerProject = false
        this.isConstructor = false
        this.isManagerProduction = false
        
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId')
        localStorage.removeItem('projectId')
        localStorage.removeItem('token')
    }
}

export default UserStore