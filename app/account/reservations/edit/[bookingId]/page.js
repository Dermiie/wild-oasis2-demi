import ReservationForm from '@/app/_components/ReservationForm';
import { auth } from '@/app/_lib/auth';
import { getBooking, getCabin, getGuest } from '@/app/_lib/data-service';

export default async function Page({ params }) {
  const bookingId = params.bookingId;
  const session = await auth();

  const guest = await getGuest(session.user.email);
  const reservation = await getBooking(bookingId);
  const cabin = await getCabin(reservation.cabinId);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>
      <ReservationForm cabin={cabin} user={guest} bookingId={bookingId} />
    </div>
  );
}
