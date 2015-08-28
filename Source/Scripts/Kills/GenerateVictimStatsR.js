//
// This script tallies up who is dying to who more often.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "CHAMPION_KILL"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          victim: "$target.c"
        },
        kills: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.victim": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region"
        },
        victims: { $push: "$_id.victim" },
        kills: { $push: "$kills" }
      }
    }
    ,
    {
      $out: "VictimStatsR"
    }
  ],
  {
    allowDiskUse: true
  }
);
