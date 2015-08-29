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
      $out: "EliteMonsterPerMinuteKillC"
    }
  ],
  {
    allowDiskUse: true
  }
);
