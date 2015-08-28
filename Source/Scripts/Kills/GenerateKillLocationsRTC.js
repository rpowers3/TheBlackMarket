//
// This creates a collection that contains the time based positions
// for where champions got kills by region, team, and champion.
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
      $project: {
        region: true,
        // This null check is for the case where there is no killer information.
        // In this case the killer was any non-champion (tower, minion, monster).
        teamId: { $ifNull: [ "$source.t", "$target.t" ] },
        championId: { $ifNull: ["$source.c", 0 ] },
        timestamp: true,
        position: true
      }
    },
    {
      $sort: {
        "timestamp": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          teamId: "$teamId",
          championId: "$championId"
        },
        timestamps: { $push: "$timestamp" },
        x: { $push: "$position.x" },
        y: { $push: "$position.y" },
      }
    }
    ,
    {
      $out: "KillLocationsRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
