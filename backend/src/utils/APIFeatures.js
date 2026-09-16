// ---- APIFeatures: builds the search query, 
// The listings page has filters, a search box and pages. Doing
// all that inside the controller would make it 100 lines long.
// So we keep it here, and the controller stays clean:
//     new APIFeatures(Property.find(), req.query)
//       .filter().search().paginate()
//
// A class is a blueprint. 'new' makes one copy to work with.
class APIFeatures {
  // constructor runs once, when we say 'new APIFeatures(...)'
  // query       = the unfinished mongoose search
  // queryString = what the user asked for (req.query), the
  //               part of the address after the ? mark
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  // FILTER - the tick boxes: price, type, room, amenities
  filter() {
    // start empty, and add a rule only if the user asked for it
    let filterQuery = {};
    // ... makes a copy, so we never damage the original
    let queryObj = { ...this.queryString };

    // PRICE. $gte = greater than or equal, $lte = less or equal.
    // The > sign means 'and above', so there is no upper limit.
    if (queryObj.minPrice && queryObj.maxPrice) {
      if (queryObj.maxPrice.includes(">")) {
        filterQuery.price = { $gte: queryObj.minPrice };
      } else {
        filterQuery.price = {
          $gte: queryObj.minPrice,
          $lte: queryObj.maxPrice,
        };
      }
    }

    // TYPE. It arrives as one string 'House,Flat', so we cut it
    // at the commas and trim the spaces. $in = match any of them.
    if (queryObj.propertyType) {
      let propertyTypeArray = queryObj.propertyType
        .split(",")
        .map((value) => value.trim());
      filterQuery.propertyType = { $in: propertyTypeArray };
    }

    // ROOM TYPE. Only one value, so a plain match is enough.
    if (queryObj.roomType) {
      filterQuery.roomType = queryObj.roomType;
    }

    // AMENITIES. May arrive as one value or as a list, so we
    // force it into a list either way.
    if (queryObj.amenities) {
      const amenitiesArray = Array.isArray(queryObj.amenities)
        ? queryObj.amenities
        : [queryObj.amenities];

      // the dot goes INSIDE the amenities object.
      // $all = must have ALL of them, not just one.
      filterQuery["amenities.name"] = { $all: amenitiesArray };
    }
    // add these rules to the search. Nothing runs yet - mongoose
    // only collects the rules until we await it.
    this.query = this.query.find(filterQuery);
    // return this = give the object back, so the next method can
    // be joined on with a dot: .filter().search().paginate()
    return this;
  }


  // SEARCH - the box on top: city, guests, dates
  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    // CITY. $or = any one of these may match. We compare in
    // small letters with no spaces, because the model saves the
    // city that way too ('New Delhi' -> 'newdelhi').
    // The ? : is a short if-else. No city typed -> empty {}.
    searchQuery = queryObj.city
      ? {
          $or: [
            { "address.city": queryObj.city.toLowerCase().replaceAll(" ", "") },
            {
              "address.state": queryObj.city.toLowerCase().replaceAll(" ", ""),
            },
            { "address.area": queryObj.city.toLowerCase().replaceAll(" ", "") },
          ],
        }
      : {};

    // GUESTS. The house must hold at least this many people.
    if (queryObj.guests) {
      searchQuery.maximumGuest = { $gte: queryObj.guests };
      queryObj.guests;
    }

    // DATES - the hardest part. We must hide houses that are
    // already booked on those days.
    // $elemMatch looks inside the currentBookings list,
    // $not turns it around: show me the ones where NO booking
    // clashes with the dates the guest asked for.
    if (queryObj.dateIn && queryObj.dateOut) {
      searchQuery.$and = [
        {
          currentBookings: {
            $not: {
              $elemMatch: {
                $or: [
                  {
                    fromDate: { $lt: queryObj.dateOut },
                    toDate: { $gt: queryObj.dateIn },
                  },
                  {
                    fromDate: { $lt: queryObj.dateIn },
                    toDate: { $gt: queryObj.dateIn },
                  },
                ],
              },
            },
          },
        },
      ];
    }

    // add these rules on top of the filter rules
    this.query = this.query.find(searchQuery);
    return this;
  }


  // PAGINATE - show 12 at a time, not 500 at once
  paginate() {
    // * 1 turns the text '2' into the number 2.
    // || 1 means: nothing sent, so start at page 1.
    let page = this.queryString.page * 1 || 1;
    // how many per page. 12 by default.
    let limit = this.queryString.limit * 1 || 12;
    // page 1 skips 0, page 2 skips 12, page 3 skips 24
    let skip = (page - 1) * limit;

    // skip that many, then take only 'limit' of them
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


// propertyController imports this to build the listings search
export { APIFeatures };
