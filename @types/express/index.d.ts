import { UsersModel } from 'src/users/users.model';

declare global {
  namespace Express {
    // eslint-disable-next-line
    interface User extends UsersModel {}
  }
}
