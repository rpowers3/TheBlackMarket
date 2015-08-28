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
          monsterType: "$monsterType"
        },
        kills: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ { $ifNull: [ "$source.w", { $not: "$team.w" } ] }, false ] } }
      }
    },
    {
      $sort: {
        "_id.monsterType": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          championId: "$_id.championId"
        },
        monsterType: { $push: "$_id.monsterType" },
        kills: { $push: "$kills" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "EliteMonsterKillRC"
    }
  ],
  {
    allowDiskUse: true
  }
);
