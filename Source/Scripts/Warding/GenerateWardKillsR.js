//
// Calculates the per minute destruction of wards for champions.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "WARD_KILL"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          wardType: "$wardType",
          time: "$oneMinuteInterval"
        },
        kills: { $sum: 1 }
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
        kills: { $push: "$kills" }
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
            kills: "$kills"
          }
        }
      }
    }
    ,
    {
      $out: "WardKillsR"
    }
  ],
  {
    allowDiskUse: true
  }
);
