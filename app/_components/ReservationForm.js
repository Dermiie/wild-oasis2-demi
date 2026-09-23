'use client';

import Image from 'next/image';
import { updateReservation } from '../_lib/actions';
import { useReservation } from './ReservationContext';
import { useFormStatus } from 'react-dom';

function ReservationForm({ cabin, user, bookingId }) {
  // CHANGE
  const { maxCapacity, observations, numGuests } = cabin;
  const { range } = useReservation();

  return (
    <div className="scale-[1.01]">
      <div className="flex items-center justify-between px-16 py-2 bg-primary-800 text-primary-300">
        <p>Logged in as</p>

        <div className="relative flex items-center gap-4">
          <Image
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="object-cover h-8 rounded-full"
            src={user.image || ''}
            alt={user.name}
            fill
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        className="flex flex-col gap-5 px-16 py-10 text-lg bg-primary-900"
        action={updateReservation}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="w-full px-5 py-3 rounded-sm shadow-sm bg-primary-200 text-primary-800"
            defaultValue={numGuests}
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
        <input hidden defaultValue={bookingId ?? null} name="bookingId" />

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="w-full px-5 py-3 rounded-sm shadow-sm bg-primary-200 text-primary-800"
            defaultValue={observations}
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          <p className="text-base text-primary-300">Start by selecting dates</p>
        </div>
        <Button />
      </form>
    </div>
  );
}

export default ReservationForm;

const Button = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="px-8 py-4 font-semibold transition-all bg-accent-500 text-primary-800 hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? 'Updating...' : 'Reserve Now'}
    </button>
  );
};
