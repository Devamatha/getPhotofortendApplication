import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const username=localStorage.getItem('UserName')
  const router=inject(Router); 
  if(username){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
