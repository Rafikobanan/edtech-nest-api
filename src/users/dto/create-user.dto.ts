import { IsString, Length } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @IsString({ message: 'Should be string' })
  @Length(1, 32, { message: 'Invalid length' })
  name: string;

  @IsString({ message: 'Should be string' })
  @Length(1, 32, { message: 'Invalid length' })
  lastName: string;
}
