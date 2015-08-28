//
// This script tallies up who is dying to who.
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
          // A 0 here represents any non champion. (Tower, minion, monster)
          killer: { $ifNull: [ "$source.c", 0 ] },
          championId: "$target.c"
        },
        deaths: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.killer": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          championId: "$_id.championId"
        },
        killers: { $push: "$_id.killer" },
        deaths: { $push: "$deaths" }
      }
    }
    ,
    {
      $out: "NemesisStatsRC"
    }
  ],
  {
    allowDiskUse: true
  }
);
