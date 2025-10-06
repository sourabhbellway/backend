import { IsEmail, IsNotEmpty, MinLength, Matches} from "class-validator";

export class LoginRegisterDto{
@IsEmail({},{message:'Invalid email address'})
email:string;

@IsNotEmpty({message:'Password is required'})
@MinLength(6,{message:'Password must be at least 6 characters'})
@Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain letters, numbers, and at least one special character (@$!%*?&)',
  })
password:string

}