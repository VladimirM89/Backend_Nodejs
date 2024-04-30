import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/auth/models/tokenPayload';

export const CurrentUser = createParamDecorator(
  (key: keyof TokenPayload, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return key ? user[key] : user;
  },
);
