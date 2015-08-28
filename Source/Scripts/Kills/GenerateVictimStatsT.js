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
          // If the source is null, the killer was a tower, minion, or
          // monsters. In this case use the opposing team from the target
          // champion. While not technically correct, I want to keep the
          // teams separate for this data because it is still interesting
          // to know who's dying to the environment more.
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
          teamId: "$_id.teamId"
        },
        victims: { $push: "$_id.victim" },
        kills: { $push: "$kills" }
      }
    }
    ,
    {
      $out: "VictimStatsT"
    }
  ],
  {
    allowDiskUse: true
  }
);
