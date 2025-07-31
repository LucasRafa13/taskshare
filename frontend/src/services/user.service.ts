import { ApiService } from './api'
import { User } from '../types'

class UserService extends ApiService {
  async searchUsers(query: string): Promise<User[]> {
    return this.get<User[]>('/users/search', { q: query })
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return this.get<User>(`/auth/email/${encodeURIComponent(email)}`)
    } catch (error) {
      const users = await this.searchUsers(email)
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      )

      if (!user) {
        throw new Error('Usuário não encontrado com este email')
      }

      return user
    }
  }
}

export const userService = new UserService()
export default userService
