import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }, 
        },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    localStorage.clear(); // Réinitialiser localStorage avant chaque test
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is authenticated', () => {
    localStorage.setItem('iduser', '123');
    localStorage.setItem('roleuser', 'admin');
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', () => {
    localStorage.removeItem('iduser');
    localStorage.removeItem('roleuser');
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});