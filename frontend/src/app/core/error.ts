import { HttpErrorResponse } from '@angular/common/http';

export function errorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof HttpErrorResponse) {
    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    if (typeof error.error?.title === 'string') {
      return error.error.title;
    }

    if (error.status === 0) {
      return 'Could not reach the API. Is the .NET server running?';
    }

    if (error.status === 401) {
      return 'Please log in to continue.';
    }
  }

  return fallback;
}
