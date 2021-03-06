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
          teamId: { $ifNull: ["$source.t", { $cond: [{ $eq: ["$team.t", 100] }, 200, 100] }] },
          laneType: "$laneType",
          towerType: "$towerType"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [{ $ifNull: ["$source.w", { $not: "$team.w" }] }, false] } }
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
          teamId: "$_id.teamId"
        },
        laneTypes: { $push: "$_id.laneType" },
        towerTypes: { $push: "$_id.towerType" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "BuildingKillT"
    }
  ],
  {
    allowDiskUse: true
  }
);
