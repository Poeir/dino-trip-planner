module.exports.mapGooglePlaceToDB = (g,oldFetchVersion = 0) => {
  const now = new Date();

  return {
    google_place_id: g.id,

    /* ===== CORE ===== */
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
      priceLevel: g.priceLevel,
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
    openingHours: g.regularOpeningHours
      ? {
          openNow: g.regularOpeningHours.openNow,
          weekdayDescriptions: g.regularOpeningHours.weekdayDescriptions,
          periods: g.regularOpeningHours.periods,
          nextOpenTime: g.regularOpeningHours.nextOpenTime
            ? new Date(g.regularOpeningHours.nextOpenTime)
            : null
        }
      : null,

    /* ===== MEDIA ===== */
    media: {
      photos: (g.photos || []).map(p => ({
        name: p.name,
        width: p.widthPx,
        height: p.heightPx
      }))
    },

    /* ===== REVIEWS (เก็บเฉพาะที่จำเป็น) ===== */
    reviews: (g.reviews || []).map(r => ({
      authorName: r.authorAttribution?.displayName,
      rating: r.rating,
      text: r.text?.text,
      publishTime: r.publishTime
        ? new Date(r.publishTime)
        : null
    })),

    /* ===== METADATA ===== */
    metadata: {
      lastFetchedAt: now,
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24), // 24 ชม.
      fetchVersion: oldFetchVersion + 1,
      source: "google_places"
    }
  };
};
