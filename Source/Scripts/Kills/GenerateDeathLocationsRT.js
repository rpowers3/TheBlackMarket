//
// This creates a collection that contains the time based positions
// for where champions died by region and team.
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
          teamId: "$teamId"
        },
        timestamps: { $push: "$timestamp" },
        x: { $push: "$position.x" },
        y: { $push: "$position.y" },
      }
    }
    ,
    {
      $out: "DeathLocationsRT"
    }
  ],
  {
    allowDiskUse: true
  }
);
