import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/services/auth.service';
import { UserRole } from '@lootupspace/shared';

describe('Backend Auth Service Tests', () => {
  it('sends OTP to customer phone', async () => {
    const res = await AuthService.sendOtp('+919876543210');
    assert.equal(res.success, true);
    assert.ok(res.devOtp);
  });

  it('verifies demo OTP and returns valid JWT token', async () => {
    const res = await AuthService.verifyOtp('+919876543210', '123456');
    assert.ok(res.token);
    assert.equal(res.user.phone, '+919876543210');
  });

  it('provides instant demo login for each role', async () => {
    const customerLogin = await AuthService.demoLogin(UserRole.CUSTOMER);
    assert.equal(customerLogin.user.role, UserRole.CUSTOMER);

    const driverLogin = await AuthService.demoLogin(UserRole.DRIVER);
    assert.equal(driverLogin.user.role, UserRole.DRIVER);

    const warehouseLogin = await AuthService.demoLogin(UserRole.WAREHOUSE);
    assert.equal(warehouseLogin.user.role, UserRole.WAREHOUSE);

    const adminLogin = await AuthService.demoLogin(UserRole.ADMIN);
    assert.equal(adminLogin.user.role, UserRole.ADMIN);
  });
});

