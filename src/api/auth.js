import * as communication from '../core/communication'

export const me = () => communication.doGet('/me')

export const login = data => communication.doPost('/login', data)

export const signup = data => communication.doPost('/signup/email', data)

export const changePassword = data => communication.doPost('/auth/password', data)

export const requestEmailLogin = data => communication.doPost('/login/email', data)
