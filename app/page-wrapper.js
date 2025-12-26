import { getPackages } from '@/lib/supabase/packages'
import HomePageContent from '@/components/home/HomePageContent'

export default async function HomePage() {
  // Fetch all tour sections in parallel
  const [
    tourListTours,
    sightSeeTours,
    desertResortTours,
    themeParkTours,
    buggyBikeTours,
    privateTourTours,
    executiveTourTours,
    comboDealTours,
    waterParkTours,
    skyTourTours,
    seaAdvantucherTours,
    dhowCruiseTours,
  ] = await Promise.all([
    getPackages({ displayPage: 'tour-list', limit: 8 }),
    getPackages({ displayPage: 'sight-see-list', limit: 8 }),
    getPackages({ displayPage: 'desert-resort-list', limit: 8 }),
    getPackages({ displayPage: 'theme-park-list', limit: 8 }),
    getPackages({ displayPage: 'buggy-bike-list', limit: 8 }),
    getPackages({ displayPage: 'private-tour-list', limit: 8 }),
    getPackages({ displayPage: 'executive-tour-list', limit: 8 }),
    getPackages({ displayPage: 'combo-deal-list', limit: 8 }),
    getPackages({ displayPage: 'water-park-list', limit: 8 }),
    getPackages({ displayPage: 'sky-tour-list', limit: 8 }),
    getPackages({ displayPage: 'sea-advantucher-list', limit: 8 }),
    getPackages({ displayPage: 'dhow-cruise-list', limit: 8 }),
  ])

  const initialToursData = {
    'tour-list': tourListTours.map(t => ({ ...t, link: `/tour-details?slug=${t.slug}` })),
    'sight-see-list': sightSeeTours.map(t => ({ ...t, link: `/sight-see-Tdetails?slug=${t.slug}` })),
    'desert-resort-list': desertResortTours.map(t => ({ ...t, link: `/desert-resort-details?slug=${t.slug}` })),
    'theme-park-list': themeParkTours.map(t => ({ ...t, link: `/theme-park-details?slug=${t.slug}` })),
    'buggy-bike-list': buggyBikeTours.map(t => ({ ...t, link: `/buggy-bike-details?slug=${t.slug}` })),
    'private-tour-list': privateTourTours.map(t => ({ ...t, link: `/private-tour-details?slug=${t.slug}` })),
    'executive-tour-list': executiveTourTours.map(t => ({ ...t, link: `/executive-tour-details?slug=${t.slug}` })),
    'combo-deal-list': comboDealTours.map(t => ({ ...t, link: `/combo-deal-details?slug=${t.slug}` })),
    'water-park-list': waterParkTours.map(t => ({ ...t, link: `/water-park-details?slug=${t.slug}` })),
    'sky-tour-list': skyTourTours.map(t => ({ ...t, link: `/sky-tour-details?slug=${t.slug}` })),
    'sea-advantucher-list': seaAdvantucherTours.map(t => ({ ...t, link: `/sea-advantucher-details?slug=${t.slug}` })),
    'dhow-cruise-list': dhowCruiseTours.map(t => ({ ...t, link: `/dhow-cruise-details?slug=${t.slug}` })),
  }

  return <HomePageContent initialToursData={initialToursData} />
}

