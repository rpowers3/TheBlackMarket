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
          teamId: {
            $ifNull: [
              "$source.t",
              {
                $cond: [
                  { $eq: [ "$target.t", 100 ] },
                  200,
                  100
                ]
              }
            ]
          },
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
          region: "$_id.region",
          teamId: "$_id.teamId",
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
          region: "$_id.region",
          teamId: "$_id.teamId",
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
      $out: "WardPlacementRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
