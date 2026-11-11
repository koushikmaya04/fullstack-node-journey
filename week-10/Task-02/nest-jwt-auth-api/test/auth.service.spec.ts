import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';

describe('AuthService', () => {
  const users = { create: jest.fn(), findByEmailWithPassword: jest.fn() } as unknown as UsersService;
  const jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') } as unknown as JwtService;
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.signAsync as jest.Mock).mockResolvedValue('signed.jwt.token');
    service = new AuthService(users, jwt);
  });

  it('registers and returns a safe user plus access token', async () => {
    (users.create as jest.Mock).mockResolvedValue({ id: 7, name: 'Asha', email: 'asha@example.com', passwordHash: 'hash' });
    await expect(service.register({ name: 'Asha', email: 'asha@example.com', password: 'password123' }))
      .resolves.toEqual({ user: { id: 7, name: 'Asha', email: 'asha@example.com' }, accessToken: 'signed.jwt.token' });
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 7, email: 'asha@example.com' });
  });

  it('logs in when the password matches', async () => {
    const hash = await bcrypt.hash('password123', 4);
    (users.findByEmailWithPassword as jest.Mock).mockResolvedValue({ id: 7, name: 'Asha', email: 'asha@example.com', passwordHash: hash });
    const result = await service.login({ email: 'asha@example.com', password: 'password123' });
    expect(result.accessToken).toBe('signed.jwt.token');
  });

  it('rejects unknown users with 401', async () => {
    (users.findByEmailWithPassword as jest.Mock).mockResolvedValue(null);
    await expect(service.login({ email: 'missing@example.com', password: 'password123' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
