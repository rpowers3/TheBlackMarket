//
// Calculates the per minute destruction of wards for champions.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "WARD_KILL"
      }
    },
    {
      $group: {
        _id: {
          teamId: {
            $ifNull: [
              "$source.t",
              {
                $cond: [
                  { $eq: [ "$target.t", 100 ] },
                  200,
                  100
                ]
              }
            ]
          },
          wardType: "$wardType",
          time: "$oneMinuteInterval"
        },
        kills: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.time": 1
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId",
          wardType: "$_id.wardType"
        },
        times: { $push: "$_id.time" },
        kills: { $push: "$kills" }
      }
    },
    {
      $sort: {
        "_id.wardType": 1,
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId"
        },
        wards: {
          $push: {
            wardType: "$_id.wardType",
            times: "$times",
            kills: "$kills"
          }
        }
      }
    }
    ,
    {
      $out: "WardKillsT"
    }
  ],
  {
    allowDiskUse: true
  }
);
