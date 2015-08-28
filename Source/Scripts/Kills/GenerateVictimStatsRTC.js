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
          region: "$region",
          // If the source is null, the killer was a tower, minion, or
          // monsters. In this case set the championId to 0 and use the
          // opposing team from the target champion. While not technically
          // correct, I want to keep the teams separate for this data because
          // it is still interesting to know who's dying to the environment
          // more.
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
          championId: { $ifNull: [ "$source.c", 0 ] },
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
          region: "$_id.region",
          teamId: "$_id.teamId",
          championId: "$_id.championId"
        },
        victims: { $push: "$_id.victim" },
        kills: { $push: "$kills" }
      }
    }
    ,
    {
      $out: "VictimStatsRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
