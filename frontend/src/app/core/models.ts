export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  favoriteIds: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
}

export interface ListingWithUser extends Listing {
  user: User;
}

export interface Reservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  listing: Listing;
}

export interface ListingFilters {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export interface CreateListing {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
}

export interface CreateReservation {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface Category {
  label: string;
  description: string;
  icon: string;
}
