import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModal } from './components/auth-modal';
import { Navbar } from './components/navbar/navbar';
import { RentModal } from './components/rent-modal';
import { SearchModal } from './components/search-modal';
import { Toasts } from './components/toasts';

@Component({
  imports: [RouterOutlet, Navbar, AuthModal, SearchModal, RentModal, Toasts],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
