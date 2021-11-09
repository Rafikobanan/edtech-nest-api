import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Should be string' })
  @Length(8, 64, { message: 'Invalid length' })
  password: string;
}
