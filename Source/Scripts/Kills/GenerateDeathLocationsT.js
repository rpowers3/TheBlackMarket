//
// This creates a collection that contains the time based positions
// for where champions died by team.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "CHAMPION_KILL",
        "source" : { $not: { $eq: null } }
      }
    },
    {
      $project: {
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
          teamId: "$teamId"
        },
        timestamps: { $push: "$timestamp" },
        xy: {
          $push: {
            $add: [
              { $multiply: [ "$position.x", 65536 ] },
              "$position.y"
            ]
          }
        }
      }
    }
    ,
    {
      $out: "DeathLocationsT"
    }
  ],
  {
    allowDiskUse: true
  }
);
