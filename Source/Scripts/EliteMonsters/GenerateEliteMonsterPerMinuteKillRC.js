//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        eventType: "ELITE_MONSTER_KILL"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          championId: { $ifNull: [ "$source.c", 0 ] },
          monsterType: "$monsterType",
          oneMinuteInterval: "$oneMinuteInterval"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ { $ifNull: [ "$source.w", { $not: "$team.w" } ] }, false ] } }
      }
    },
    {
      $sort: {
        "_id.oneMinuteInterval": 1
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          championId: "$_id.championId",
          monsterType: "$_id.monsterType"
        },
        times: { $push: "$_id.oneMinuteInterval" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" },
      }
    },
    {
      $sort: {
        "_id.monsterType": 1
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          championId: "$_id.championId"
        },
        monsters: {
          $push: {
            monsterType: "$_id.monsterType",
            times: "$times",
            count: "$count",
            timesWon: "$timesWon",
          }
        }
      }
    }
    ,
    {
      $out: "EliteMonsterPerMinuteKillRC"
    }
  ],
  {
    allowDiskUse: true
  }
);
