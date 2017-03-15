import * as communication from '../core/communication'

export const me = () => communication.doGet('/me')

export const login = data => communication.doPost('/login', data)

export const signup = data => communication.doPost('/signup/email', data)
