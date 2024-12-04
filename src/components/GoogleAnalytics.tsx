'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import ReactGA from 'react-ga4';

function GoogleAnalyticsInner({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: process.env.NODE_ENV !== 'production',
      gtagOptions: {
        debug_mode: process.env.NODE_ENV !== 'production'
      }
    });
    
    const currentPath = pathname + searchParams.toString();
    ReactGA.send({ hitType: "pageview", page: currentPath });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
      console.log('Pageview sent for:', currentPath);
    }
  }, [GA_MEASUREMENT_ID, pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
    </Suspense>
  );
}
