module.exports.mapGooglePlaceToDB = (g, oldFetchVersion = 0) => {
  const now = new Date();
  const PRICE_LEVEL_MAP = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4
  };
  return {
    google_place_id: g.id,

    /* ===== CORE (เดิม) ===== */
    core: {
      name: g.displayName?.text,
      primaryType: g.primaryType,
      types: g.types || [],
      location: {
        lat: g.location?.latitude,
        lng: g.location?.longitude
      },
      rating: g.rating,
      userRatingCount: g.userRatingCount,
      priceLevel: g.priceLevel
        ? PRICE_LEVEL_MAP[g.priceLevel] ?? null
        : null,
      businessStatus: g.businessStatus
    },

    /* ===== CONTACT ===== */
    contact: {
      phone: g.internationalPhoneNumber,
      website: g.websiteUri
    },

    /* ===== ADDRESS ===== */
    address: {
      formatted: g.formattedAddress
    },

    /* ===== OPENING HOURS ===== */
    openingHours: g.regularOpeningHours && {
      openNow: g.regularOpeningHours.openNow,
      weekdayDescriptions: g.regularOpeningHours.weekdayDescriptions,
      periods: g.regularOpeningHours.periods,
      nextOpenTime: g.regularOpeningHours.nextOpenTime
        ? new Date(g.regularOpeningHours.nextOpenTime)
        : null
    },

    /* ===== MEDIA ===== */
    media: {
      photos: (g.photos || []).map(p => ({
        name: p.name,
        width: p.widthPx,
        height: p.heightPx
      }))
    },

    /* ===== REVIEWS ===== */
    reviews: (g.reviews || []).map(r => ({
      authorName: r.authorAttribution?.displayName,
      rating: r.rating,
      text: r.text?.text,
      publishTime: r.publishTime ? new Date(r.publishTime) : null
    })),

    /* ===== 🔥 FEATURES ===== */
    features: {
      takeout: g.takeout,
      delivery: g.delivery,
      dineIn: g.dineIn,
      curbsidePickup: g.curbsidePickup,
      reservable: g.reservable,

      servesBreakfast: g.servesBreakfast,
      servesLunch: g.servesLunch,
      servesDinner: g.servesDinner,
      servesBrunch: g.servesBrunch,
      servesBeer: g.servesBeer,
      servesWine: g.servesWine,
      servesCocktails: g.servesCocktails,
      servesDessert: g.servesDessert,
      servesCoffee: g.servesCoffee,
      servesVegetarianFood: g.servesVegetarianFood,

      outdoorSeating: g.outdoorSeating,
      liveMusic: g.liveMusic,
      menuForChildren: g.menuForChildren,
      goodForChildren: g.goodForChildren,
      goodForGroups: g.goodForGroups,
      goodForWatchingSports: g.goodForWatchingSports,

      allowsDogs: g.allowsDogs,
      restroom: g.restroom
    },

    /* ===== EXTRA ===== */
    extra: {
      editorialSummary: g.editorialSummary?.text,
      generativeSummary: g.generativeSummary?.text,
      neighborhoodSummary: g.neighborhoodSummary?.text,
      reviewSummary: g.reviewSummary?.text,
      paymentOptions: g.paymentOptions,
      parkingOptions: g.parkingOptions,
      accessibilityOptions: g.accessibilityOptions,
      priceRange: g.priceRange
  ? {
      start: g.priceRange.startPrice
        ? {
            currencyCode: g.priceRange.startPrice.currencyCode ?? null,
            units: Number(g.priceRange.startPrice.units) || null
          }
        : null,
      end: g.priceRange.endPrice
        ? {
            currencyCode: g.priceRange.endPrice.currencyCode ?? null,
            units: Number(g.priceRange.endPrice.units) || null
          }
        : null
    }
  : null,
      pureServiceAreaBusiness: g.pureServiceAreaBusiness
    },

    /* ===== MAPS / RELATION ===== */
    maps: {
      googleMapsUri: g.googleMapsUri,
      googleMapsLinks: g.googleMapsLinks
    },

    subDestinations: g.subDestinations?.map(p => p.id),
    containingPlaces: g.containingPlaces?.map(p => p.id),

    ev: {
      evChargeOptions: g.evChargeOptions,
      evChargeAmenitySummary: g.evChargeAmenitySummary?.text,
      fuelOptions: g.fuelOptions
    },

    /* ===== METADATA ===== */
    metadata: {
      lastFetchedAt: now,
      expiresAt: new Date(now.getTime() + 86400000),
      fetchVersion: oldFetchVersion + 1,
      source: "google_places"
    }
  };
};
