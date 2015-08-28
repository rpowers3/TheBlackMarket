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
          championId: { $ifNull: [ "$source.c", 0 ] },
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
          championId: "$_id.championId"
        },
        victims: { $push: "$_id.victim" },
        kills: { $push: "$kills" }
      }
    }
    ,
    {
      $out: "VictimStatsC"
    }
  ],
  {
    allowDiskUse: true
  }
);
