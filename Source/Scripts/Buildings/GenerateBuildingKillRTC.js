//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        eventType: "BUILDING_KILL"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          teamId: { $ifNull: [ "$source.t", { $cond: [ { $eq: [ "$team.t", 100 ] }, 200, 100 ] } ] },
          championId: { $ifNull: [ "$source.c", 0 ] },
          laneType: "$laneType",
          towerType: "$towerType"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ { $ifNull: [ "$source.w", { $not: "$team.w" } ] }, false ] } }
      }
    },
    {
      $sort: {
        "_id.laneType": 1,
        "_id.towerType": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          teamId: "$_id.teamId",
          championId: "$_id.championId"
        },
        laneTypes: { $push: "$_id.laneType" },
        towerTypes: { $push: "$_id.towerType" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "BuildingKillRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
