'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get('capacity');

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);

    params.set('capacity', filter);

    // setSearchParams(params); this works when using searchParams from react router

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex border border-primary-800 ">
      <Button
        filter={'all'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        all
      </Button>
      <Button
        filter={'small'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter={'medium'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter={'large'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ children, activeFilter, filter, handleFilter }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${activeFilter === filter ? `bg-primary-800 text-primary-50` : ''}`}
      onClick={() => {
        handleFilter(filter);
      }}
    >
      {children}
    </button>
  );
}

export default Filter;
