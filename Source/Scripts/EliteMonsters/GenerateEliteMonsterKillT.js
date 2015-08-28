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
          teamId: { $ifNull: [ "$source.t", { $cond: [ { $eq: [ "$team.t", 100 ] }, 200, 100 ] } ] },
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
          teamId: "$_id.teamId"
        },
        monsterType: { $push: "$_id.monsterType" },
        kills: { $push: "$kills" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "EliteMonsterKillT"
    }
  ],
  {
    allowDiskUse: true
  }
);
