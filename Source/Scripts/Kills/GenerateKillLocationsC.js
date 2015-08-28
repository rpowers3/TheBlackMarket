//
// This creates a collection that contains the time based positions
// for where champions got kills by champion.
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
        championId: { $ifNull: [ "$source.c", 0 ] },
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
          championId: "$championId"
        },
        timestamps: { $push: "$timestamp" },
        x: { $push: "$position.x" },
        y: { $push: "$position.y" },
      }
    }
    ,
    {
      $out: "KillLocationsC"
    }
  ],
  {
    allowDiskUse: true
  }
);
