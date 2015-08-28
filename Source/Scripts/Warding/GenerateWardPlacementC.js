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
          championId: { $ifNull: ["$source.c", 0] },
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
          championId: "$_id.championId",
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
          championId: "$_id.championId"
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
      $out: "WardPlacementC"
    }
  ],
  {
    allowDiskUse: true
  }
);
