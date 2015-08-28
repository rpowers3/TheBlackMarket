//
// This creates a collection that contains the time based positions
// for where champions got kills by team.
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
        // This null check is for the case where there is no killer information.
        // In this case the killer was any non-champion (tower, minion, monster).
        teamId: { $ifNull: [ "$source.t", "$target.t" ] },
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
      $out: "KillLocationsT"
    }
  ],
  {
    allowDiskUse: true
  }
);
