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
          teamId: "$target.t",
          // A 0 here represents any non champion. (Tower, minion, monster)
          killer: { $ifNull: [ "$source.c", 0 ] }
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
          teamId: "$_id.teamId",
        },
        killers: { $push: "$_id.killer" },
        deaths: { $push: "$deaths" }
      }
    }
    ,
    {
      $out: "NemesisStatsT"
    }
  ],
  {
    allowDiskUse: true
  }
);
