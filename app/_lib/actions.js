'use server';

import { revalidatePath } from 'next/cache';
// import { signOut } from 'next-auth/react';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export async function updateGuest(formData) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const nationalID = formData.get('nationalID');

  const country = formData.get('nationality').split('%');

  console.log(country);

  const [nationality, countryFlag] = country;

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please provide a valid nationalID');

  const updatedData = { nationality, nationalID, countryFlag };

  console.log(updatedData);

  const { data, error } = await supabase
    .from('guests')
    .update(updatedData)
    .eq('id', session.user.guestId);
  if (error) {
    console.error(error);
    throw new Error('Guest could not be updated');
  }

  revalidatePath('/account/profile');
}

export async function updateReservation(formData) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);

  const bookingId = Number(formData.get('bookingId'));
  const guestBookingIds = guestBookings.map((booking) => bookingId);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const numGuests = formData.get('numGuests');
  const observations = formData.get('observations');

  const updatedFields = { numGuests, observations };

  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  revalidatePath('/account/reservations');

  redirect('/account/reservations');
}

export async function deleteReservation(bookingId) {
  const session = await auth();

  if (!session) throw new Error('User must be logged in');

  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingIds = guestBookings.map((booking) => bookingId);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Reservation couldnt be deleted');
  }

  revalidatePath('/account/reservations');
}

export async function signinAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
