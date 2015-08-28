//
// This creates a collection that contains the time based positions
// for where champions died by region, team, and champion.
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
        teamId: "$target.t",
        championId: "$target.c",
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
      $out: "DeathLocationsRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
