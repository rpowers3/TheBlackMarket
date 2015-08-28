//
// Calculates the per minute placement of wards for champions.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "WARD_PLACED"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          wardType: "$wardType",
          time: "$oneMinuteInterval"
        },
        wards: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.time": 1
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          wardType: "$_id.wardType"
        },
        times: { $push: "$_id.time" },
        wards: { $push: "$wards" }
      }
    },
    {
      $sort: {
        "_id.wardType": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region"
        },
        wards: {
          $push: {
            wardType: "$_id.wardType",
            times: "$times",
            wards: "$wards"
          }
        }
      }
    }
    ,
    {
      $out: "WardPlacementR"
    }
  ],
  {
    allowDiskUse: true
  }
);
