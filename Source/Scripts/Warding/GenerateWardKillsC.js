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
          championId: { $ifNull: ["$source.c", 0] },
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
          championId: "$_id.championId",
          wardType: "$_id.wardType"
        },
        times: { $push: "$_id.time" },
        kills: { $push: "$kills" },
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
            kills: "$kills"
          }
        }
      }
    }
    ,
    {
      $out: "WardKillsC"
    }
  ],
  {
    allowDiskUse: true
  }
);
