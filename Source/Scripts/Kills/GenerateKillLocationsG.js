//
// This creates a collection that contains the time based positions
// for where champions got kills globally.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "CHAMPION_KILL",
        "source": { $not: { $eq: null } }
      }
    },
    {
      $project: {
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
        _id: "global",
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
      $out: "KillLocationsG"
    }
  ],
  {
    allowDiskUse: true
  }
);
